from server.extensions import db

class AdminSetting(db.Model):
    __tablename__ = "admin_settings"

    id = db.Column(db.Integer, primary_key=True)
    shop_name = db.Column(db.String(100),nullable=False,default="Robotec Store")
    paybill_number = db.Column(db.String(20),nullable=False)
    paybill_account = db.Column(db.String(50),nullable=False)
    shipping_cost = db.Column(db.Float,default=0.0)
    support_phone = db.Column(db.String(20),nullable=True)
    support_email = db.Column(db.String(100),nullable=True)
    shop_address = db.Column(db.String(200),nullable=True)
    updated_at = db.Column(db.DateTime,default=db.func.now(),onupdate=db.func.now())
