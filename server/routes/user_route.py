from flask_restful import Resource
from flask import request
from flask_jwt_extended import jwt_required, get_jwt_identity

from server.extensions import db
from server.models.user import User


# =========================
# USER (SELF) ROUTES
# =========================

class UserProfileResource(Resource):
    """View own profile"""

    @jwt_required()
    def get(self):
        user = User.query.get(get_jwt_identity())

        return {
            "id": user.id,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "phone": user.phone,
            "city": user.city,
            "town": user.town,
            "address": user.address,
            "role": user.role,
            "is_active": user.is_active,
            "created_at": user.created_at.isoformat()
        }, 200


class UserProfileUpdateResource(Resource):
    """Update own profile"""

    @jwt_required()
    def put(self):
        user = User.query.get(get_jwt_identity())
        data = request.get_json()

        for field in ["first_name", "last_name", "phone", "city", "town", "address"]:
            if field in data:
                setattr(user, field, data[field])

        db.session.commit()
        return {"message": "Profile updated successfully"}, 200


class ChangePasswordResource(Resource):
    """Change own password"""

    @jwt_required()
    def put(self):
        user = User.query.get(get_jwt_identity())
        data = request.get_json()

        if not data.get("current_password"):
            return {"message": "Current password is required"}, 400

        if not user.check_password(data["current_password"]):
            return {"message": "Current password is incorrect"}, 400

        if data.get("new_password") != data.get("confirm_password"):
            return {"message": "Passwords do not match"}, 400

        user.set_password(data["new_password"])
        db.session.commit()

        return {"message": "Password changed successfully"}, 200


# =========================
# ADMIN ROUTES
# =========================

class AdminUserListResource(Resource):
    """Admin: list all users"""

    @jwt_required()
    def get(self):
        admin = User.query.get(get_jwt_identity())

        if not admin or not admin.is_admin():
            return {"message": "Admin access required"}, 403

        users = User.query.all()

        return [
            {
                "id": u.id,
                "first_name": u.first_name,
                "last_name": u.last_name,
                "email": u.email,
                "phone": u.phone,
                "role": u.role,
                "is_active": u.is_active,
                "created_at": u.created_at.isoformat()
            }
            for u in users
        ], 200


class AdminUserDetailResource(Resource):
    """Admin: view single user"""

    @jwt_required()
    def get(self, user_id):
        admin = User.query.get(get_jwt_identity())

        if not admin or not admin.is_admin():
            return {"message": "Admin access required"}, 403

        user = User.query.get(user_id)

        if not user:
            return {"message": "User not found"}, 404

        return {
            "id": user.id,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "phone": user.phone,
            "city": user.city,
            "town": user.town,
            "address": user.address,
            "role": user.role,
            "is_active": user.is_active,
            "created_at": user.created_at.isoformat()
        }, 200


class AdminUserUpdateResource(Resource):
    """Admin: update user"""

    @jwt_required()
    def put(self, user_id):
        admin = User.query.get(get_jwt_identity())

        if not admin or not admin.is_admin():
            return {"message": "Admin access required"}, 403

        user = User.query.get(user_id)
        data = request.get_json()

        if not user:
            return {"message": "User not found"}, 404

        for field in [
            "first_name", "last_name", "phone",
            "city", "town", "address",
            "role", "is_active"
        ]:
            if field in data:
                setattr(user, field, data[field])

        db.session.commit()
        return {"message": "User updated successfully"}, 200


class AdminUserDeleteResource(Resource):
    """Admin: deactivate user (soft delete)"""

    @jwt_required()
    def delete(self, user_id):
        admin = User.query.get(get_jwt_identity())

        if not admin or not admin.is_admin():
            return {"message": "Admin access required"}, 403

        user = User.query.get(user_id)

        if not user:
            return {"message": "User not found"}, 404

        user.is_active = False
        db.session.commit()

        return {"message": "User deactivated successfully"}, 200
