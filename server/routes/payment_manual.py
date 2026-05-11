from flask_restful import Resource
from flask import request
from flask_jwt_extended import jwt_required, get_jwt_identity

from server.extensions import db
from server.models.payment import Payment
from server.models.order import Order
from server.models.user import User


class ManualPaymentConfirmResource(Resource):
    """
    Admin confirms payment after user pays manually via Paybill
    Works for both guest and logged-in user orders.
    """

    @jwt_required()
    def post(self):
        data = request.get_json()

        order_id = data.get("order_id")
        mpesa_receipt = data.get("mpesa_receipt")

        if not order_id:
            return {"message": "order_id is required"}, 400

        admin = User.query.get(get_jwt_identity())
        if not admin or not admin.is_admin():
            return {"message": "Admin access required"}, 403

        order = Order.query.get(order_id)
        if not order:
            return {"message": "Order not found"}, 404

        if order.payment_status == "paid":
            return {"message": "Order already marked as paid"}, 400

        # Determine phone number
        phone_number = order.user.phone if order.user_id else order.guest_phone
        if not phone_number:
            return {"message": "Order has no phone number"}, 400

        # Create or update payment record
        payment = Payment.query.filter_by(order_id=order.id).first()
        if not payment:
            payment = Payment(
                order_id=order.id,
                user_id=order.user_id,
                amount=order.total_amount,
                payment_method="mpesa",
                mpesa_receipt=mpesa_receipt,
                phone_number=phone_number,
                status="confirmed"
            )
            db.session.add(payment)
        else:
            payment.status = "confirmed"
            payment.mpesa_receipt = mpesa_receipt
            payment.phone_number = phone_number

        # Update order payment status
        order.payment_status = "paid"

        db.session.commit()

        return {
            "message": "Payment confirmed successfully",
            "order_id": order.id,
            "status": order.payment_status
        }, 200
