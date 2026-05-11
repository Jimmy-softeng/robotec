from server.extensions import db


class ShippingOption(db.Model):
    __tablename__ = "shipping_options"

    id = db.Column(db.Integer, primary_key=True)

    area_name = db.Column(db.String(100), nullable=False, unique=True)
    cost = db.Column(db.Float, nullable=False)

    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=db.func.now())
