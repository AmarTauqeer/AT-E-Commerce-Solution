from fastapi import FastAPI
from app.api.auth import router as auth_router
from app.api.category import router as category_router
from app.api.product import router as product_router
from app.api.role import router as role_router
from app.api.user import router as user_router
from app.api.user_permission import router as user_permission_router
from app.api.order import router as order_router
from app.api.order_items import router as order_items_router
from app.api.resource import router as resource_router

def register_routes(app: FastAPI):
    app.include_router(auth_router, prefix="/auth")
    app.include_router(role_router, prefix="/role")
    app.include_router(user_router, prefix="/user")
    app.include_router(user_permission_router, prefix="/user-permission")
    app.include_router(category_router, prefix="/category")
    app.include_router(product_router, prefix="/product")
    app.include_router(order_router, prefix="/order")
    app.include_router(order_items_router, prefix="/orderItems")
    app.include_router(resource_router, prefix="/resource")