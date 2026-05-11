from sqlalchemy import UniqueConstraint
from server.extensions import db

class Cart(db.Model):
    __tablename__ = "carts"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)
    session_id = db.Column(db.String(255), nullable=True)
    updated_at = db.Column(db.DateTime, default=db.func.now(), onupdate=db.func.now())

    # relationships
    items = db.relationship("CartItem", backref="cart", cascade="all, delete-orphan", lazy=True)

    __table_args__ = (
        UniqueConstraint("session_id", name="uq_carts_session_id"),
    )
