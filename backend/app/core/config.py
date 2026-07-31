import os
from pathlib import Path
from dotenv import load_dotenv
from pydantic_settings import BaseSettings

env_path=Path(".")/".env"

load_dotenv(dotenv_path=env_path)

class Settings(BaseSettings):
    # DB_USER: str = os.getenv('DBUSERNAME')
    # DB_PASSWORD: str = os.getenv('PASSWORD')
    # DATABASE: str = os.getenv('DATABASENAME')
    # DBHOST:str = os.getenv('DBHOST')
    # # local
    # DATABASE_URL:str = f"postgresql://{DB_USER}:{DB_PASSWORD}{DBHOST}/{DATABASE}"

    PROD_DATABASE:str= os.getenv('PROD_DATABASE')
    PROD_DB_USER:str= os.getenv('PROD_DB_USER')
    PROD_DB_PASSWORD:str= os.getenv('PROD_DB_PASSWORD')
    PROD_DB_HOST:str= os.getenv('PROD_DB_HOST')
        
    # production

    DATABASE_URL:str = f"postgresql+psycopg2://{PROD_DB_USER}:{PROD_DB_PASSWORD}@{PROD_DB_HOST}:5432/{PROD_DATABASE}?sslmode=require"
    # print(f"{DATABASE_URL}")
    
    # JWT
    JWT_SECRET: str = os.getenv('JWT_SECRET','ASDFDSLFDSLFJDSLFSDLF23274923749324929$$$$$7777/////+++++++')
    JWT_ALGORITHM: str = os.getenv('JWT_ALGORITHM','HS256')
    ACCESS_TOKEN_EXPIRE_MINUTES: int =  os.getenv('JWT_TOKEN_EXPIRE_MINUTE', 60)

def get_settings()->Settings:
    return Settings()