from flask_restful import Resource
from flask import request
from flask_jwt_extended import (
    get_jwt_identity,
    jwt_required
)

from server.extensions import db
from server.models.product import Product
from server.models.order import Order
from server.models.order_item import OrderItem
from server.models.user import User

import secrets


# ==========================================
# HELPERS
# ==========================================

def generate_order_number():
    """Generate random order number"""
    return secrets.token_hex(8).upper()


# ==========================================
# CHECKOUT / CREATE ORDER
# ==========================================

class CheckoutResource(Resource):

    @jwt_required(optional=True)
    def post(self):

        data = request.get_json() or {}
        user_id = get_jwt_identity()

        items = data.get("items", [])

        if not items:
            return {"message": "Cart is empty"}, 400

        # ==========================================
        # GUEST INFO
        # ==========================================
        if not user_id:
            guest_name = data.get("guest_name")
            guest_phone = data.get("guest_phone")
            guest_email = data.get("guest_email")

            if not guest_name or not guest_phone or not guest_email:
                return {
                    "message": "Guest details required"
                }, 400
        else:
            guest_name = None
            guest_phone = None
            guest_email = None

        # ==========================================
        # REQUIRED SHIPPING FIELDS
        # ==========================================
        required_fields = [
            "city",
            "town",
            "address",
            "shipping_cost"
        ]

        for field in required_fields:
            if field not in data:
                return {
                    "message": f"{field} is required"
                }, 400

        shipping_cost = float(data["shipping_cost"])

        subtotal = 0

        # ==========================================
        # VALIDATE PRODUCTS + STOCK
        # ==========================================
        for item in items:

            product = Product.query.get(item["id"])

            if not product:
                return {
                    "message": "Product not found"
                }, 404

            if product.stock_quantity < item["quantity"]:
                return {
                    "message":
                    f"Insufficient stock for {product.name}"
                }, 400

            subtotal += (
                product.price * item["quantity"]
            )

        total_amount = subtotal + shipping_cost

        # ==========================================
        # CREATE ORDER
        # ==========================================
        order = Order(
            order_number=generate_order_number(),
            user_id=user_id,

            guest_name=guest_name,
            guest_phone=guest_phone,
            guest_email=guest_email,

            city=data["city"],
            town=data["town"],
            address=data["address"],
            shipping_cost=shipping_cost,

            total_amount=total_amount,

            payment_status="pending",
            order_status="pending"
        )

        db.session.add(order)
        db.session.flush()

        # ==========================================
        # CREATE ORDER ITEMS
        # ==========================================
        for item in items:

            product = Product.query.get(item["id"])

            order_item = OrderItem(
                order_id=order.id,
                product_id=product.id,
                product_name=product.name,
                product_price=product.price,
                quantity=item["quantity"],
                subtotal=(
                    product.price * item["quantity"]
                )
            )

            # reduce stock
            product.stock_quantity -= item["quantity"]

            db.session.add(order_item)

        db.session.commit()

        return {
            "message": "Order created successfully",
            "order_id": order.id,
            "total_amount": total_amount
        }, 201


# ==========================================
# USER ORDER HISTORY
# ==========================================

class UserOrdersResource(Resource):

    @jwt_required()
    def get(self):

        user_id = get_jwt_identity()

        orders = (
            Order.query
            .filter_by(user_id=user_id)
            .order_by(Order.created_at.desc())
            .all()
        )

        return [
            {
                "order_id": o.id,
                "order_number": o.order_number,

                "city": o.city,
                "town": o.town,
                "address": o.address,
                "shipping_cost": o.shipping_cost,

                "total_amount": o.total_amount,
                "status": o.order_status,
                "payment_status": o.payment_status,
                "created_at":
                o.created_at.isoformat()
            }
            for o in orders
        ], 200


# ==========================================
# SINGLE ORDER DETAILS
# ==========================================

class OrderDetailResource(Resource):

    @jwt_required(optional=True)
    def get(self, order_id):

        order = Order.query.get(order_id)

        if not order:
            return {
                "message": "Order not found"
            }, 404

        items = (
            OrderItem.query
            .filter_by(order_id=order.id)
            .all()
        )

        return {
            "order_id": order.id,
            "order_number": order.order_number,

            "city": order.city,
            "town": order.town,
            "address": order.address,
            "shipping_cost": order.shipping_cost,

            "status": order.order_status,
            "payment_status": order.payment_status,

            "subtotal":
            sum(i.subtotal for i in items),

            "total_amount":
            order.total_amount,

            "items": [
                {
                    "product_name":
                    i.product_name,

                    "product_price":
                    i.product_price,

                    "quantity":
                    i.quantity,

                    "subtotal":
                    i.subtotal
                }
                for i in items
            ]
        }, 200


# ==========================================
# ADMIN - VIEW ALL ORDERS
# ==========================================

class AdminOrdersResource(Resource):

    @jwt_required()
    def get(self):

        user_id = get_jwt_identity()

        admin = User.query.get(user_id)

        if not admin or not admin.is_admin():
            return {
                "message":
                "Admin access required"
            }, 403

        orders = (
            Order.query
            .order_by(Order.created_at.desc())
            .all()
        )

        return [
            {
                "order_id": o.id,
                "order_number": o.order_number,

                "customer": (
                    o.guest_name
                    if o.guest_name
                    else
                    f"{o.user.first_name} "
                    f"{o.user.last_name}"
                ),

                "phone": (
                    o.guest_phone
                    if o.guest_phone
                    else o.user.phone
                ),

                # ✅ NEW FIELDS
                "city": o.city,
                "town": o.town,
                "address": o.address,
                "shipping_cost":
                o.shipping_cost,

                "total_amount":
                o.total_amount,

                "status":
                o.order_status,

                "payment_status":
                o.payment_status,

                "created_at":
                o.created_at.isoformat()

            }
            for o in orders
        ], 200