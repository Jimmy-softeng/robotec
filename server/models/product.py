from server.extensions import db

class Product(db.Model):
    __tablename__ = "products"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    category = db.Column(db.String(50), nullable=False)  # boards, sensors, kits
    price = db.Column(db.Float, nullable=False)
    description = db.Column(db.Text)
    image_url = db.Column(db.String(255))
    stock_quantity = db.Column(db.Integer, default=0)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=db.func.now())

    # relationships
    
    cart_items = db.relationship("CartItem",backref="product",lazy=True)
    order_items = db.relationship("OrderItem",backref="product",lazy=True)
    reviews = db.relationship("Review",backref="product",cascade="all, delete-orphan",lazy=True)