from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import APIKeyCookie
from fastapi.staticfiles import StaticFiles

from api.auth import router as auth_router
from api.category import router as category_router
from api.product import router as product_router
from api.role import router as role_router
from api.user import router as user_router
from api.user_permission import router as user_permission_router
from api.order import router as order_router
from api.order_items import router as order_items_router
from api.resource import router as resource_router

app = FastAPI(title="A & T Ecommerce Solution API",
              version="0.0.1",
              summary="A Swagger API for the project 'A & T Ecommerce Solution' serves the API endpoints for managing and handling " \
              "category, products, users, roles, permissions, customer orders, and payments",
              description="Secure authentication and authorization (role-based) using JWT and HttpOnly Cookies, provides CRUD(create, read, update, delete) " \
              "operations on category, products, roles, user permissions, resources, etc.",
              contact={
                  "name": "Amar Tauqeer",
                  "email": "amar.tauqeer@gmail.com",
              }, swagger_ui_parameters={"syntaxHighlight": {"theme": "obsidian"}})

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount(
    "/static",
    StaticFiles(directory="static"),
    name="static",
)


app.include_router(auth_router, prefix="/auth")
app.include_router(role_router, prefix="/role")
app.include_router(user_router, prefix="/user")
app.include_router(user_permission_router, prefix="/user-permission")
app.include_router(category_router, prefix="/category")
app.include_router(product_router, prefix="/product")
app.include_router(order_router, prefix="/order")
app.include_router(order_items_router, prefix="/orderItems")
app.include_router(resource_router, prefix="/resource")
