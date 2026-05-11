from server.extensions import db
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    city = db.Column(db.String(100))
    town = db.Column(db.String(100))
    address = db.Column(db.Text)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), default="user")  # admin | user
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=db.func.now())
    is_verified = db.Column(db.Boolean, default=False)
    email_verification_token = db.Column(db.String(255), nullable=True)
    #relationships
    carts = db.relationship("Cart",backref="user",lazy=True)
    orders = db.relationship("Order",backref="user",lazy=True)
    payments = db.relationship("Payment",backref="user",lazy=True)
    reviews = db.relationship("Review",backref="user",lazy=True)
    # helper methods
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def is_admin(self):
        return self.role == "admin"
