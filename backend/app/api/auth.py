from api.helper.send_email import send_reset_email
from fastapi.security import APIKeyCookie
from pydantic import BaseModel, EmailStr

from api.otp import send_otp_email, verify_otp
from core.config import get_settings
from fastapi import APIRouter, Depends, Response, HTTPException, Cookie
from schemas.auth_schema import LoginSchema, ResetPassword
from core.security import create_access_token, get_current_user, get_password_hash, verify_password
from jose import jwt

from schemas.users_schema import ForgotPassword
from sqlalchemy.orm import Session
from core.db import get_db
from api.models.models import User


settings = get_settings()

router = APIRouter(tags=["Authentication & Authorization"])

@router.post("/signin")
async def login(data: LoginSchema, response: Response, db: Session = Depends(get_db)):

    user = db.query(User).filter(
        User.email == data.username, User.role_id == data.role).first()
    # print(user)

    if not user:
        return HTTPException(
            status_code=401, detail="user doesn't exist")

    if not user.is_active:
        return HTTPException(
            status_code=401, detail="user is not active")

    if not user.is_verified:
        return HTTPException(
            status_code=401, detail="user is not verified")

    is_valid = verify_password(
        data.password,
        user.password
    )

    if not is_valid:
        return HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    token = create_access_token({
        "sub": data.username
    })

    # check role for admin
    if user.role_id == 2:

        response.set_cookie(
            key="access_token",
            value=token,
            httponly=True,
            secure=False,  # True in production HTTPS
            samesite="lax",
            max_age=60 * 60 * 24 * 7,
            path="/"
        )

        response.set_cookie(
            key="refresh_token",
            value=token,
            httponly=True,
            secure=False,  # True in production HTTPS
            samesite="lax",
            max_age=60 * 60 * 24 * 7,
            path="/"
        )

    return {
        "message": "Logged in without two factor authentication"
    }

@router.post("/verify-email")
async def verify_email(
    token: str,
    db: Session = Depends(get_db)
):
    try:

        payload = jwt.decode(
            token,
            settings.JWT_SECRET,
            settings.JWT_ALGORITHM
        )

        email = payload["sub"]

    except jwt.PyJWTError:

        return HTTPException(
            400,
            "Invalid token"
        )

    user = (
        db.query(User)
        .filter(
            User.email == email
        )
        .first()
    )

    if not user:
        raise HTTPException(
            404,
            "User not found"
        )

    user.is_active = True
    user.is_verified = True

    db.commit()

    return {
        "message":
        "Account verified"
    }


@router.get("/me")
async def get_me(user=Depends(get_current_user)):
    return user


@router.post("/logout")
async def logout(response: Response):

    response.delete_cookie(
        key="access_token",
        # path="/"
    )
    response.delete_cookie(
        key="refresh_token",
        # path="/"
    )

    return {
        "message": "Logged out"
    }


# otp implementation

class EmailRequest(BaseModel):
    email: EmailStr


class OTPVerifyRequest(BaseModel):
    email: EmailStr
    otp: str


@router.post("/request-otp")
async def request_otp(data: EmailRequest):
    # print(data.email)
    # otp = generate_otp(data.email)
    await send_otp_email(data.email)
    return {"message": "OTP sent"}


@router.post("/verify-otp")
def verify(data: OTPVerifyRequest, response: Response):
    if not verify_otp(data.email, data.otp):
        raise HTTPException(400, "Invalid or expired OTP")

    token = create_access_token({
        "sub": data.email
    })

    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=False,  # True in production HTTPS
        samesite="lax",
        max_age=60 * 60 * 24 * 7,
        path="/"
    )

    response.set_cookie(
        key="refresh_token",
        value=token,
        httponly=True,
        secure=False,  # True in production HTTPS
        samesite="lax",
        max_age=60 * 60 * 24 * 7,
        path="/"
    )

    return {"message": "Logged in"}

@router.post("/forgot-password")
async def forgot_password(
    data: ForgotPassword,
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(User.email == data.email).first()

    # Prevent email enumeration
    if not user:
        return {
            "message": "If an account exists, a reset link has been sent."
        }

    token = create_access_token({
        "sub": data.email
    })

    await send_reset_email(data.email)

    return {
        "message": "If an account exists, a reset link has been sent."
    }

@router.post("/reset-password")
async def reset_password(
    data: ResetPassword,
    db: Session = Depends(get_db)
):
    

    try:

        payload = jwt.decode(
            data.token,
            settings.JWT_SECRET,
            settings.JWT_ALGORITHM
        )

        email = payload["sub"]

    except jwt.PyJWTError:

        return HTTPException(
            400,
            "Invalid token"
        )


    user = (
        db.query(User)
        .filter(
            User.email == email
        )
        .first()
    )

    if not user:
        raise HTTPException(
            404,
            "User not found"
        )
    hashed_password = get_password_hash(data.password)
    user.password = hashed_password
    db.commit()

    return {
        "message": "Password updated successfully."
    }

@router.post("/consent")
def save_consent(choice: str, response: Response):

    response.set_cookie(
        key="cookie_consent",
        value=choice,      # accepted / rejected
        httponly=True,
        secure=False,      # True in production HTTPS
        samesite="lax",
        max_age=60*60*24*365
    )

    return {
        "message": "Consent saved",
        "choice": choice
    }


@router.get("/consent")
def get_consent(cookie_consent: str | None = Cookie(default=None)):

    return {
        "consent": cookie_consent
    }

