from flask_restful import Resource
from flask import request
from flask_jwt_extended import jwt_required, get_jwt_identity

from server.extensions import db
from server.models.shipping_option import ShippingOption
from server.models.user import User


# ===============================
# PUBLIC ROUTE (FOR CHECKOUT)
# ===============================

class ShippingOptionsListResource(Resource):
    """
    Public: List active shipping options
    Used during checkout
    """

    def get(self):
        options = ShippingOption.query.filter_by(is_active=True).all()

        return [
            {
                "id": o.id,
                "area_name": o.area_name,
                "cost": o.cost
            }
            for o in options
        ], 200


# ===============================
# ADMIN ROUTES
# ===============================

class AdminShippingOptionsResource(Resource):
    """
    Admin: Create & list shipping options
    """

    @jwt_required()
    def get(self):
        admin = User.query.get(get_jwt_identity())
        if not admin or not admin.is_admin():
            return {"message": "Admin access required"}, 403

        options = ShippingOption.query.all()

        return [
            {
                "id": o.id,
                "area_name": o.area_name,
                "cost": o.cost,
                "is_active": o.is_active
            }
            for o in options
        ], 200

    @jwt_required()
    def post(self):
        admin = User.query.get(get_jwt_identity())
        if not admin or not admin.is_admin():
            return {"message": "Admin access required"}, 403

        data = request.get_json()

        area_name = data.get("area_name")
        cost = data.get("cost")

        if not area_name or cost is None:
            return {"message": "area_name and cost are required"}, 400

        option = ShippingOption(
            area_name=area_name,
            cost=float(cost)
        )

        db.session.add(option)
        db.session.commit()

        return {"message": "Shipping option added"}, 201


class AdminShippingOptionDetailResource(Resource):
    """
    Admin: Update / deactivate shipping option
    """

    @jwt_required()
    def put(self, option_id):
        admin = User.query.get(get_jwt_identity())
        if not admin or not admin.is_admin():
            return {"message": "Admin access required"}, 403

        option = ShippingOption.query.get(option_id)
        if not option:
            return {"message": "Shipping option not found"}, 404

        data = request.get_json()

        if "area_name" in data:
            option.area_name = data["area_name"]
        if "cost" in data:
            option.cost = float(data["cost"])
        if "is_active" in data:
            option.is_active = data["is_active"]

        db.session.commit()

        return {"message": "Shipping option updated"}, 200
