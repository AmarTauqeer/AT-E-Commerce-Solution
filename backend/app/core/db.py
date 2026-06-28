from sqlalchemy import create_engine
import sqlalchemy
from sqlalchemy.orm import sessionmaker
from core.config import get_settings
from sqlmodel import SQLModel, Session

settings = get_settings()

SQLALCHEMY_DATABASE_URL = settings.DATABASE_URL

engine = create_engine(SQLALCHEMY_DATABASE_URL,pool_size=20, max_overflow=0)

SQLModel.metadata.create_all(engine)

def get_db():
    with Session(engine) as session:
        yield session