from flask import Flask
from server.extensions import db,jwt, migrate, cors
from server.config import Config
from flask_restful import Api
from server.extensions import mail
from server.routes.auth import RegisterResource, LoginResource, VerifyEmailResource
from server.routes.user_route import UserProfileResource, UserProfileUpdateResource,ChangePasswordResource, AdminUserListResource, AdminUserDetailResource, AdminUserUpdateResource, AdminUserDeleteResource
from server.routes.product import ProductListResource, ProductDetailResource, ProductCategoryResource, AdminProductCreateResource,AdminProductListResource, AdminProductUpdateResource, AdminProductDeleteResource
from server.routes.cart import CartResource, AddToCartResource, UpdateCartItemResource, RemoveCartItemResource, ClearCartResource
from server.routes.order import CheckoutResource, UserOrdersResource, OrderDetailResource, AdminOrdersResource
from server.routes.payment_manual import ManualPaymentConfirmResource
from server.routes.order_admin import AdminOrderStatusUpdateResource
from server.routes.review import ProductReviewsResource, CreateReviewResource, DeleteReviewResource
from server.routes.shipping_option import ShippingOptionsListResource, AdminShippingOptionsResource, AdminShippingOptionDetailResource
from server.routes.admin_settings import AdminSettingsResource,PublicSettingsResource
def create_app():
    app = Flask(__name__)
    # Load configuration
    app.config.from_object(Config)

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    cors.init_app(app)
    # Initialize JWT manager
    jwt.init_app(app)
    mail.init_app(app)

    # Initialize Flask-Restful API
    api = Api(app)
    #login and register
    api.add_resource(RegisterResource, "/auth/register")
    api.add_resource(VerifyEmailResource, "/auth/verify/<string:token>")
    api.add_resource(LoginResource, "/auth/login")
    # User profile routes
    api.add_resource(UserProfileResource, "/users/profile")
    api.add_resource(UserProfileUpdateResource, "/users/profile/update")
    api.add_resource(ChangePasswordResource, "/users/change-password")
    # Admin routes
   
    api.add_resource(AdminUserListResource, "/admin/users")
    api.add_resource(AdminUserDetailResource, "/admin/users/<int:user_id>")
    api.add_resource(AdminUserUpdateResource, "/admin/users/<int:user_id>")
    api.add_resource(AdminUserDeleteResource, "/admin/users/<int:user_id>")
    api.add_resource(AdminProductListResource, "/admin/products")
    # Product routes
            
    api.add_resource(ProductListResource, "/products")
    api.add_resource(ProductDetailResource, "/products/<int:product_id>")
    api.add_resource(ProductCategoryResource, "/products/category/<string:category>")

    api.add_resource(AdminProductCreateResource, "/admin/products")
    api.add_resource(AdminProductUpdateResource, "/admin/products/<int:product_id>")
    api.add_resource(AdminProductDeleteResource, "/admin/products/<int:product_id>")
    # Cart routes
    api.add_resource(CartResource, "/cart")
    api.add_resource(AddToCartResource, "/cart/add")
    api.add_resource(UpdateCartItemResource, "/cart/update")
    api.add_resource(RemoveCartItemResource, "/cart/remove/<int:cart_item_id>")
    api.add_resource(ClearCartResource, "/cart/clear")

    # Order routes
    api.add_resource(CheckoutResource, "/checkout")
    api.add_resource(UserOrdersResource, "/orders")
    api.add_resource(OrderDetailResource, "/orders/<int:order_id>")
    api.add_resource(AdminOrdersResource, "/admin/orders")
    api.add_resource(ManualPaymentConfirmResource,"/admin/payments/confirm")
    # Admin order status update
    api.add_resource(AdminOrderStatusUpdateResource,"/admin/orders/<int:order_id>/status")

    # Product reviews
    api.add_resource(ProductReviewsResource,"/products/<int:product_id>/reviews")
    api.add_resource(CreateReviewResource,"/products/<int:product_id>/reviews/add")
    api.add_resource(DeleteReviewResource,"/admin/reviews/<int:review_id>")

    # Public (checkout)
    api.add_resource(PublicSettingsResource, "/settings")
    api.add_resource(ShippingOptionsListResource,"/shipping-options")
    # Admin
    api.add_resource(AdminShippingOptionsResource,"/admin/shipping-options")
    api.add_resource(AdminShippingOptionDetailResource,"/admin/shipping-options/<int:option_id>")

    # Admin settings
    api.add_resource(AdminSettingsResource, "/admin/settings")  
    return app
