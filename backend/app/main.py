from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from api.routes.api_routes import register_routes


app = FastAPI(title="A & T Ecommerce Solution API",
              version="0.0.1",
              summary="A Swagger API for the project \"A & T Ecommerce Solution\" serves the API endpoints for managing and handling " \
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


register_routes(app)
