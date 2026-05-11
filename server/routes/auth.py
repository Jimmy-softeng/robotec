from flask_restful import Resource
from flask import request
from flask_jwt_extended import create_access_token
from flask_mail import Message
from datetime import timedelta
import secrets

from server.extensions import db, mail
from server.models.user import User
from server.models.cart import Cart
from server.models.cart_item import CartItem


# =========================
# HELPER: MERGE GUEST CART
# =========================
def merge_guest_cart_to_user(user_id, session_id):
    if not session_id:
        return

    guest_cart = Cart.query.filter_by(session_id=session_id).first()
    if not guest_cart:
        return

    user_cart = Cart.query.filter_by(user_id=user_id).first()

    # If user has no cart, attach guest cart
    if not user_cart:
        guest_cart.user_id = user_id
        guest_cart.session_id = None
        db.session.commit()
        return

    # Merge items
    for item in guest_cart.items:
        existing = next(
            (i for i in user_cart.items if i.product_id == item.product_id),
            None
        )
        if existing:
            existing.quantity += item.quantity
        else:
            item.cart_id = user_cart.id

    db.session.delete(guest_cart)
    db.session.commit()


# =========================
# REGISTER
# =========================
class RegisterResource(Resource):
    def post(self):
        data = request.get_json()

        required_fields = [
            "first_name", "last_name", "email",
            "phone", "password", "confirm_password"
        ]

        for field in required_fields:
            if field not in data:
                return {"message": f"{field} is required"}, 400

        if data["password"] != data["confirm_password"]:
            return {"message": "Passwords do not match"}, 400

        if User.query.filter_by(email=data["email"]).first():
            return {"message": "Email already registered"}, 400

        verification_token = secrets.token_urlsafe(32)

        user = User(
            first_name=data["first_name"],
            last_name=data["last_name"],
            email=data["email"],
            phone=data["phone"],
            city=data.get("city"),
            town=data.get("town"),
            address=data.get("address"),
            role="user",
            is_verified=False,
            email_verification_token=verification_token
        )

        user.set_password(data["password"])

        db.session.add(user)
        db.session.commit()

        verify_url = f"http://localhost:3000/verify/{verification_token}"

        msg = Message(
            subject="Verify your Robotec account",
            recipients=[user.email],
            body=f"""
Hello {user.first_name},

Thank you for registering at Robotec.

Please verify your email by clicking the link below:

{verify_url}

If you did not create this account, please ignore this email.
"""
        )

        mail.send(msg)

        return {
            "message": "Registration successful. Please check your email to verify your account."
        }, 201


# =========================
# EMAIL VERIFICATION
# =========================
class VerifyEmailResource(Resource):
    def get(self, token):
        user = User.query.filter_by(email_verification_token=token).first()

        if not user:
            return {"message": "Invalid or expired verification token"}, 400

        user.is_verified = True
        user.email_verification_token = None
        db.session.commit()

        return {
            "message": "Email verified successfully. You can now log in."
        }, 200


# =========================
# LOGIN
# =========================
class LoginResource(Resource):
    def post(self):
        data = request.get_json()

        if "email" not in data or "password" not in data:
            return {"message": "Email and password are required"}, 400

        user = User.query.filter_by(email=data["email"]).first()

        if not user or not user.check_password(data["password"]):
            return {"message": "Invalid email or password"}, 401

        if not user.is_verified:
            return {"message": "Please verify your email before logging in"}, 403

        if not user.is_active:
            return {"message": "Account has been disabled"}, 403

        # 🔥 MERGE GUEST CART HERE
        session_id = request.headers.get("X-Session-ID")
        merge_guest_cart_to_user(user.id, session_id)

        access_token = create_access_token(
            identity=str(user.id),
            expires_delta=timedelta(hours=1)
        )

        return {
            "access_token": access_token,
            "user": {
                "id": user.id,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "email": user.email,
                "role": user.role,
                "created_at": user.created_at.isoformat()
            }
        }, 200
