from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles


from app.api.routes.api_routes import register_routes


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

# local
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=[
#         "http://localhost:3000",
#         "http://127.0.0.1"
#     ],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )
# for production

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://at-ecommerce-solution.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = Path(__file__).resolve().parent
app.mount(
    "/static",
    StaticFiles(directory=BASE_DIR / "static"),
    name="static",
)

# app.mount(
#     "/static",
#     StaticFiles(directory="static"),
#     name="static",
# )

@app.get("/")
def health_check():
    return {"message":"The health check is successfull!"}


register_routes(app)
