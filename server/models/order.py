from server.extensions import db

class Order(db.Model):
    __tablename__ = "orders"

    id = db.Column(db.Integer, primary_key=True)

    order_number = db.Column(db.String(50),unique=True,nullable=False)

    # user or guest
    user_id = db.Column(db.Integer,db.ForeignKey("users.id"),nullable=True)
    guest_name = db.Column(db.String(150))
    guest_phone = db.Column(db.String(20))
    guest_email = db.Column(db.String(120))
    city = db.Column(db.String(100))
    town = db.Column(db.String(100))
    address = db.Column(db.Text)
    shipping_cost = db.Column(db.Float, default=0)
    total_amount = db.Column(db.Float, nullable=False)

    payment_status = db.Column(db.String(20),default="pending")  # pending | paid
    order_status = db.Column(db.String(20),default="pending")  # pending | shipped | delivered
    created_at = db.Column(db.DateTime,default=db.func.now())

    # relationship
    items = db.relationship("OrderItem",backref="order",cascade="all, delete-orphan",lazy=True)
    payments = db.relationship("Payment",backref="order",lazy=True)