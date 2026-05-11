from flask_restful import Resource
from flask import request
from flask_jwt_extended import jwt_required, get_jwt_identity

from server.extensions import db
from server.models.review import Review
from server.models.order import Order
from server.models.order_item import OrderItem
from server.models.product import Product
from server.models.user import User


class ProductReviewsResource(Resource):
    """
    Public: View reviews for a product
    """

    def get(self, product_id):
        reviews = (
            Review.query
            .filter_by(product_id=product_id)
            .order_by(Review.created_at.desc())
            .all()
        )

        return [
            {
                "review_id": r.id,
                "rating": r.rating,
                "comment": r.comment,
                "user": f"{r.user.first_name} {r.user.last_name}",
                "created_at": r.created_at.isoformat()
            }
            for r in reviews
        ], 200


class CreateReviewResource(Resource):
    """
    User: Create a review for a product they bought
    """

    @jwt_required()
    def post(self, product_id):
        user_id = get_jwt_identity()
        data = request.get_json()

        rating = data.get("rating")
        comment = data.get("comment")

        if not rating or rating not in [1, 2, 3, 4, 5]:
            return {"message": "Rating must be between 1 and 5"}, 400

        product = Product.query.get(product_id)
        if not product:
            return {"message": "Product not found"}, 404

        purchased = (
            db.session.query(OrderItem)
            .join(Order)
            .filter(
                Order.user_id == user_id,
                Order.order_status == "completed",
                OrderItem.product_id == product_id
            )
            .first()
        )

        if not purchased:
            return {"message": "You can only review products you purchased"}, 403

        existing = Review.query.filter_by(
            user_id=user_id,
            product_id=product_id
        ).first()

        if existing:
            return {"message": "You already reviewed this product"}, 400

        review = Review(
            user_id=user_id,
            product_id=product_id,
            rating=rating,
            comment=comment
        )

        db.session.add(review)
        db.session.commit()

        return {"message": "Review added successfully"}, 201


class DeleteReviewResource(Resource):
    """
    Admin: Delete inappropriate reviews
    """

    @jwt_required()
    def delete(self, review_id):
        admin = User.query.get(get_jwt_identity())

        if not admin or not admin.is_admin():
            return {"message": "Admin access required"}, 403

        review = Review.query.get(review_id)
        if not review:
            return {"message": "Review not found"}, 404

        db.session.delete(review)
        db.session.commit()

        return {"message": "Review deleted successfully"}, 200
