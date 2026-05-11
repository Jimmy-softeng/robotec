from server.extensions import db

class OrderItem(db.Model):
    __tablename__ = "order_items"

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer,db.ForeignKey("orders.id"),nullable=False)
    product_id = db.Column(db.Integer,db.ForeignKey("products.id"),nullable=False)
    product_name = db.Column(db.String(150),nullable=False)
    product_price = db.Column(db.Float,nullable=False)
    quantity = db.Column(db.Integer,nullable=False,default=1)
    subtotal = db.Column(db.Float,nullable=False)

    created_at = db.Column(db.DateTime,default=db.func.now())
