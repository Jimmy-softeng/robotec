from flask_restful import Resource
from flask import request
from flask_jwt_extended import jwt_required, get_jwt_identity

from server.extensions import db
from server.models.product import Product
from server.models.user import User


# ==================================================
# PUBLIC PRODUCT ROUTES (NO AUTH REQUIRED)
# ==================================================

class ProductListResource(Resource):
    def get(self):
        products = Product.query.filter_by(is_active=True).all()

        return [
            {
                "id": p.id,
                "name": p.name,
                "price": p.price,
                "category": p.category,
                "image_url": p.image_url
            }
            for p in products
        ], 200


class ProductDetailResource(Resource):
    def get(self, product_id):
        product = Product.query.filter_by(id=product_id, is_active=True).first()

        if not product:
            return {"message": "Product not found"}, 404

        return {
            "id": product.id,
            "name": product.name,
            "price": product.price,
            "category": product.category,
            "description": product.description,
            "image_url": product.image_url,
            "stock_quantity": product.stock_quantity
        }, 200


class ProductCategoryResource(Resource):
    def get(self, category):
        products = Product.query.filter_by(category=category, is_active=True).all()

        return [
            {
                "id": p.id,
                "name": p.name,
                "price": p.price,
                "image_url": p.image_url
            }
            for p in products
        ], 200


# ==================================================
# ADMIN PRODUCT ROUTES
# ==================================================

class AdminProductCreateResource(Resource):

    @jwt_required()
    def post(self):
        admin = User.query.get(get_jwt_identity())

        if not admin or not admin.is_admin() or not admin.is_active:
            return {"message": "Admin access required"}, 403

        # ✅ FIX: handle FormData
        data = request.form

        print("Content-Type:", request.content_type)
        print("FORM DATA:", data)

        required_fields = ["name", "price", "category"]
        for field in required_fields:
            if not data.get(field):
                return {"message": f"{field} is required"}, 400

        product = Product(
            name=data.get("name"),
            price=float(data.get("price")),
            category=data.get("category"),
            description=data.get("description"),
            image_url=data.get("image_url"),
            stock_quantity=int(data.get("stock_quantity", 0)),
            is_active=True
        )

        db.session.add(product)
        db.session.commit()

        return {"message": "Product added successfully"}, 201


class AdminProductListResource(Resource):

    @jwt_required()
    def get(self):
        admin = User.query.get(get_jwt_identity())

        if not admin or not admin.is_admin() or not admin.is_active:
            return {"message": "Admin access required"}, 403

        products = Product.query.order_by(Product.created_at.desc()).all()

        return [
            {
                "id": p.id,
                "name": p.name,
                "price": p.price,
                "category": p.category,
                "stock_quantity": p.stock_quantity,
                "image_url": p.image_url,
                "is_active": p.is_active,
                "created_at": p.created_at.isoformat()
            }
            for p in products
        ], 200


class AdminProductUpdateResource(Resource):

    @jwt_required()
    def put(self, product_id):
        admin = User.query.get(get_jwt_identity())

        if not admin or not admin.is_admin() or not admin.is_active:
            return {"message": "Admin access required"}, 403

        product = Product.query.get(product_id)

        if not product:
            return {"message": "Product not found"}, 404

        # ✅ FIX: handle FormData
        data = request.form

        for field in [
            "name",
            "price",
            "category",
            "description",
            "image_url",
            "stock_quantity",
            "is_active"
        ]:
            if field in data:
                value = data.get(field)

                if field == "price":
                    value = float(value)
                elif field == "stock_quantity":
                    value = int(value)

                setattr(product, field, value)

        db.session.commit()

        return {"message": "Product updated successfully"}, 200


class AdminProductDeleteResource(Resource):

    @jwt_required()
    def delete(self, product_id):
        admin = User.query.get(get_jwt_identity())

        if not admin or not admin.is_admin() or not admin.is_active:
            return {"message": "Admin access required"}, 403

        product = Product.query.get(product_id)

        if not product:
            return {"message": "Product not found"}, 404

        product.is_active = False
        db.session.commit()

        return {"message": "Product deleted successfully"}, 200