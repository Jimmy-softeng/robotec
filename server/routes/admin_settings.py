from flask_restful import Resource, reqparse
from flask_jwt_extended import jwt_required, get_jwt_identity
from functools import wraps

from server.extensions import db
from server.models.admin_setting import AdminSetting
from server.models.user import User


# -----------------------------
# Admin role decorator
# -----------------------------
def admin_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if not user or user.role != "admin":
            return {"message": "Admin access required"}, 403

        return fn(*args, **kwargs)

    return wrapper


# -----------------------------
# Request parser
# -----------------------------
settings_parser = reqparse.RequestParser()
settings_parser.add_argument("shop_name", type=str)
settings_parser.add_argument("paybill_number", type=str)
settings_parser.add_argument("paybill_account", type=str)
settings_parser.add_argument("shipping_cost", type=float)
settings_parser.add_argument("support_phone", type=str)
settings_parser.add_argument("support_email", type=str)
settings_parser.add_argument("shop_address", type=str)


# -----------------------------
# Admin Settings Resource
# -----------------------------
class AdminSettingsResource(Resource):

    @jwt_required()
    @admin_required
    def get(self):
        """
        Get admin settings (single row)
        """
        settings = AdminSetting.query.first()

        if not settings:
            return {"message": "Admin settings not found"}, 404

        return {
            "id": settings.id,
            "shop_name": settings.shop_name,
            "paybill_number": settings.paybill_number,
            "paybill_account": settings.paybill_account,
            "shipping_cost": settings.shipping_cost,
            "support_phone": settings.support_phone,
            "support_email": settings.support_email,
            "shop_address": settings.shop_address,
            "updated_at": settings.updated_at.isoformat() if settings.updated_at else None
        }, 200

    @jwt_required()
    @admin_required
    def put(self):
        """
        Update admin settings
        """
        settings = AdminSetting.query.first()
        data = settings_parser.parse_args()

        if not settings:
            return {"message": "Admin settings not found"}, 404

        for key, value in data.items():
            if value is not None:
                setattr(settings, key, value)

        db.session.commit()

        return {"message": "Admin settings updated successfully"}, 200
class PublicSettingsResource(Resource):
    def get(self):
        settings = AdminSetting.query.first()

        if not settings:
            return {"message": "Settings not found"}, 404

        return {
            "shop_name": settings.shop_name,
            "paybill_number": settings.paybill_number,
            "paybill_account": settings.paybill_account,
            "shipping_cost": settings.shipping_cost,
            "support_phone": settings.support_phone,
            "support_email": settings.support_email,
            "shop_address": settings.shop_address,
        }, 200