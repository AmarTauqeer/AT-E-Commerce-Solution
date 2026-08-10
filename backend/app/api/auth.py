
from app.api.helper.send_email import send_reset_email
from fastapi.security import APIKeyCookie
from pydantic import BaseModel, EmailStr
from datetime import datetime, timedelta

from app.api.login_history import record_logout
from app.api.otp import send_otp_email, verify_otp
from app.core.config import get_settings
from fastapi import APIRouter, Depends, Request, Response, HTTPException, Cookie
from app.schemas.auth_schema import LoginSchema, ResetPassword
from app.schemas.login_history_schema import CreateLoginHistoryRequest
from app.core.security import LOCKOUT_MINUTES, MAX_LOGIN_ATTEMPTS, create_access_token, get_current_user, get_password_hash, verify_password
from jose import jwt

from app.schemas.login_history_schema import CreateLoginHistoryRequest
from app.schemas.users_schema import ForgotPassword
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.api.models.models import User, LoginHistory
from app.logger import logger


settings = get_settings()

router = APIRouter(tags=["Authentication & Authorization"])


@router.post("/signin")
async def login(request: Request, data: LoginSchema, response: Response, db: Session = Depends(get_db)):

    user = db.query(User).filter(
        User.email == data.username, User.role_id == data.role).first()

    if not user:
        raise HTTPException(
            status_code=401, detail="Invalid email or password")

    check_account_lock(user)

    if not user.is_active:
        raise HTTPException(
            status_code=401, detail="user is not active")

    if not user.is_verified:
        raise HTTPException(
            status_code=401, detail="user is not verified")

    is_valid = verify_password(
        data.password,
        user.password
    )

    if not is_valid:
        ip_address = (
            request.client.host
            if request.client
            else None
        )
        record_failed_login(
            db=db,
            user=user,
            ip_address=ip_address,
            reason="Invalid password",
        )

        if user.failed_login_attempts >= MAX_LOGIN_ATTEMPTS:
            raise HTTPException(
                status_code=423,
                detail=(
                    "Too many failed login attempts. "
                    "Account temporarily locked."
                ),
            )

        remaining = (
            MAX_LOGIN_ATTEMPTS
            - user.failed_login_attempts
        )

        raise HTTPException(
            status_code=401,
            detail=(
                f"Invalid email or password. "
                f"{remaining} attempts remaining."
            ),
        )

    history = CreateLoginHistoryRequest(
        user_id=user.id,
        ip_address=(
            request.client.host
            if request.client
            else None
        ),
    )

    create_login_history(
        db=db,
        data=history,
    )
     # Successful login
    user.failed_login_attempts = 0
    user.locked_until = None

    token = create_access_token({
        "sub": data.username
    })

    # check role for admin
    if user.role_id == 2:
        # save the record
        db.add(user)
        db.commit()
        db.refresh(user)

        response.set_cookie(
            key="access_token",
            value=token,
            httponly=True,
            # secure=True,          # Required in production (HTTPS)
            # samesite="none",      # Required for cross-site requests
            secure=False,  # True in production HTTPS
            samesite="lax",  # for local
            max_age=60 * 60 * 24 * 7,
            path="/"
        )

        response.set_cookie(
            key="refresh_token",
            value=token,
            httponly=True,
            # secure=True,          # Required in production (HTTPS)
            # samesite="none",      # Required for cross-site requests
            secure=False,  # True in production HTTPS
            samesite="lax",  # for local
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
async def logout(response: Response, db: Session = Depends(get_db), user=Depends(get_current_user)):

    record_logout(
        db=db,
        email=user['sub'],
    )

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
    # logger.info("hellofrom dsdsf")
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


def create_login_history(
    db: Session,
    data: CreateLoginHistoryRequest,
) -> LoginHistory:

    history = LoginHistory(
        user_id=data.user_id,
        login_at=datetime.now(),
        ip_address=data.ip_address,
        failure_reason=data.failure_reason,
    )

    db.add(history)
    db.commit()
    db.refresh(history)

    return history


def check_account_lock(user):
    if (
        user.locked_until
        and user.locked_until > datetime.now()
    ):
        remaining = (
            user.locked_until - datetime.now()
        )

        minutes = max(
            1,
            int(remaining.total_seconds() / 60)
        )

        raise HTTPException(
            status_code=423,
            detail=(
                f"Account temporarily locked. "
                f"Try again in {minutes} minutes."
            ),
        )

    # Lockout has expired
    if user.locked_until:
        user.locked_until = None
        user.failed_login_attempts = 0


def record_failed_login(
    db: Session,
    user: User,
    ip_address: str | None,
    reason: str,
):
    user.failed_login_attempts = (
        user.failed_login_attempts or 0
    ) + 1

    if user.failed_login_attempts >= MAX_LOGIN_ATTEMPTS:
        user.locked_until = (
            datetime.now()
            + timedelta(minutes=LOCKOUT_MINUTES)
        )

    history = LoginHistory(
        user_id=user.id,
        ip_address=ip_address,
        success=False,
        failure_reason=reason,
    )

    db.add(user)
    db.add(history)
    db.commit()
    db.refresh(user)
    db.refresh(history)