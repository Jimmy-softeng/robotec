from server.extensions import db

class Payment(db.Model):
    __tablename__ = "payments"

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer,db.ForeignKey("orders.id"),nullable=False)
    user_id = db.Column(db.Integer,db.ForeignKey("users.id"),nullable=True)
    amount = db.Column(db.Float,nullable=False)
    payment_method = db.Column(db.String(50),default="mpesa")
    mpesa_receipt = db.Column(db.String(100),unique=True,nullable=True)
    phone_number = db.Column(db.String(20),nullable=False)
    status = db.Column(db.String(20),default="pending")  # pending, completed, failed
    created_at = db.Column(db.DateTime,default=db.func.now())
