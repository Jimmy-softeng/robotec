from flask_restful import Resource
from flask import request
from flask_jwt_extended import jwt_required, get_jwt_identity

from server.extensions import db
from server.models.order import Order
from server.models.user import User


ALLOWED_STATUSES = [
    "pending_payment",
    "paid",
    "shipped",
    "completed",
    "cancelled"
]


class AdminOrderStatusUpdateResource(Resource):
    """
    Admin updates the status of an order:
    pending_payment → paid → shipped → completed
    """

    @jwt_required()
    def put(self, order_id):
        data = request.get_json()
        new_status = data.get("status")

        if not new_status:
            return {"message": "status is required"}, 400

        if new_status not in ALLOWED_STATUSES:
            return {"message": f"Invalid status. Allowed: {ALLOWED_STATUSES}"}, 400

        # Get the admin user
        admin = User.query.get(get_jwt_identity())
        if not admin or not admin.is_admin():
            return {"message": "Admin access required"}, 403

        # Get the order
        order = Order.query.get(order_id)
        if not order:
            return {"message": "Order not found"}, 404

        # Business rules
        if order.order_status == "cancelled":
            return {"message": "Cancelled orders cannot be updated"}, 400

        if order.order_status == "completed":
            return {"message": "Completed orders cannot be updated"}, 400

        # Update the order status
        order.order_status = new_status
        db.session.commit()

        return {
            "message": "Order status updated successfully",
            "order_id": order.id,
            "new_status": order.order_status
        }, 200
