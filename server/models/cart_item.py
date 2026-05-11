from server.extensions import db

class CartItem(db.Model):
    __tablename__ = "cart_items"

    id = db.Column(db.Integer, primary_key=True)

    cart_id = db.Column(
        db.Integer,
        db.ForeignKey("carts.id", ondelete="CASCADE"),
        nullable=False
    )

    product_id = db.Column(
        db.Integer,
        db.ForeignKey("products.id"),
        nullable=False
    )

    quantity = db.Column(db.Integer, nullable=False, default=1)

    price_at_time = db.Column(db.Float, nullable=False)

    created_at = db.Column(db.DateTime, default=db.func.now())
