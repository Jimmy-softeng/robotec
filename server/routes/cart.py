from flask_restful import Resource
from flask import request
from flask_jwt_extended import get_jwt_identity, jwt_required
from server.extensions import db
from server.models.cart import Cart
from server.models.cart_item import CartItem
from server.models.product import Product


def get_or_create_cart(user_id=None, session_id=None):
    """
    Returns the cart for a user or guest.
    Merges guest cart into user cart if both exist.
    """
    cart = None

    if user_id:
        # Get user cart
        cart = Cart.query.filter_by(user_id=user_id).first()
        if not cart:
            cart = Cart(user_id=user_id)
            db.session.add(cart)
            db.session.commit()

        # Merge guest cart if session_id exists
        if session_id:
            guest_cart = Cart.query.filter_by(session_id=session_id).first()
            if guest_cart:
                for item in guest_cart.items:
                    # Merge quantities if item exists
                    existing_item = next(
                        (i for i in cart.items if i.product_id == item.product_id), None
                    )
                    if existing_item:
                        existing_item.quantity += item.quantity
                    else:
                        item.cart_id = cart.id
                        db.session.add(item)
                db.session.delete(guest_cart)
                db.session.commit()

    elif session_id:
        cart = Cart.query.filter_by(session_id=session_id).first()
        if not cart:
            cart = Cart(session_id=session_id)
            db.session.add(cart)
            db.session.commit()

    return cart


# ==================================================
# CART ROUTES
# ==================================================

class CartResource(Resource):
    """Get current cart"""
    
    @jwt_required(optional=True)
    def get(self):
        session_id = request.headers.get("X-Session-ID")
        user_id = get_jwt_identity()

        cart = get_or_create_cart(user_id=user_id, session_id=session_id)
        cart_items = CartItem.query.filter_by(cart_id=cart.id).all()

        items = []
        total_amount = 0.0

        for item in cart_items:
            subtotal = item.quantity * item.product.price
            total_amount += subtotal
            items.append({
                "cart_item_id": item.id,
                "product_id": item.product.id,
                "product_name": item.product.name,
                "product_image": item.product.image_url,
                "price": item.product.price,
                "quantity": item.quantity,
                "subtotal": subtotal
            })

        return {
            "cart_id": cart.id,
            "items": items,
            "total_amount": total_amount
        }, 200


class AddToCartResource(Resource):
    """Add item to cart"""
    
    @jwt_required(optional=True)
    def post(self):
        data = request.get_json()
        product_id = data.get("product_id")
        quantity = int(data.get("quantity", 1))
        session_id = request.headers.get("X-Session-ID")
        user_id = get_jwt_identity()

        product = Product.query.get(product_id)
        if not product or not product.is_active:
            return {"message": "Product not found"}, 404

        cart = get_or_create_cart(user_id=user_id, session_id=session_id)

        cart_item = CartItem.query.filter_by(
            cart_id=cart.id, product_id=product_id
        ).first()

        if cart_item:
            cart_item.quantity += quantity
        else:
            cart_item = CartItem(
                cart_id=cart.id,
                product_id=product_id,
                quantity=quantity,
                price_at_time=product.price
 )
            db.session.add(cart_item)

        db.session.commit()
        return {"message": "Item added to cart successfully"}, 200


class UpdateCartItemResource(Resource):
    """Update quantity of a cart item"""
    
    @jwt_required(optional=True)
    def put(self):
        data = request.get_json()
        cart_item_id = data.get("cart_item_id")
        quantity = int(data.get("quantity", 1))

        if quantity < 1:
            return {"message": "Quantity must be at least 1"}, 400

        cart_item = CartItem.query.get(cart_item_id)
        if not cart_item:
            return {"message": "Cart item not found"}, 404

        cart_item.quantity = quantity
        db.session.commit()
        return {"message": "Cart item updated successfully"}, 200


class RemoveCartItemResource(Resource):
    """Remove a cart item"""
    
    @jwt_required(optional=True)
    def delete(self, cart_item_id):
        cart_item = CartItem.query.get(cart_item_id)
        if not cart_item:
            return {"message": "Cart item not found"}, 404

        db.session.delete(cart_item)
        db.session.commit()
        return {"message": "Item removed from cart"}, 200


class ClearCartResource(Resource):
    """Clear all items from the cart"""
    
    @jwt_required(optional=True)
    def delete(self):
        session_id = request.headers.get("X-Session-ID")
        user_id = get_jwt_identity()

        cart = get_or_create_cart(user_id=user_id, session_id=session_id)
        CartItem.query.filter_by(cart_id=cart.id).delete()
        db.session.commit()

        return {"message": "Cart cleared successfully"}, 200
