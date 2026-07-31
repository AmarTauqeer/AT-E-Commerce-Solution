import bcrypt
from fastapi import Cookie, Depends, HTTPException
from jose import JWTError, jwt
from datetime import datetime, timedelta

from fastapi.security import APIKeyCookie
from datetime import timedelta, datetime
from jose import jwt
from app.core.config import get_settings


settings = get_settings()

# shows lock icon in swagger
cookie_scheme = APIKeyCookie(
    name="access_token",
    auto_error=False
)


def get_password_hash(password: str) -> str:
    """Hash a password using bcrypt"""
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain_password: str, hashed: str) -> bool:
    """Verify a password against its hash"""
    return bcrypt.checkpw(
        plain_password.encode("utf-8"),
        hashed.encode("utf-8"),
    )


def create_access_token(data: dict):

    expire = datetime.utcnow() + timedelta(days=7)

    payload = data.copy()
    payload.update({"exp": expire})

    return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)

def create_refresh_token(data):
    return jwt.encode(data, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)

def get_current_user(
    access_token: str = Depends(cookie_scheme)
):

    if access_token is None:
        raise HTTPException(
            status_code=401,
            detail="Not authenticated"
        )

    try:
        payload = jwt.decode(
            access_token,
            settings.JWT_SECRET,
            settings.JWT_ALGORITHM
        )
        return payload

    except JWTError:
        return HTTPException(
            status_code=401,
            detail="Invalid token"
        )


