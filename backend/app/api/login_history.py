from typing import List

from sqlmodel import select
from datetime import datetime

from app.api.policies import require_admin
from app.core.config import get_settings
from fastapi import APIRouter, Depends, Response, HTTPException, Cookie
from app.core.security import get_current_user
from app.schemas.login_history_schema import LoginHistoryReadSchema
from starlette import status

from sqlalchemy.orm import Session
from app.core.db import get_db
from app.api.models.models import LoginHistory, User

settings = get_settings()

router = APIRouter(tags=["Login History"],
                   dependencies=[Depends(require_admin)])


@router.get(
    "/",
    response_model=List[LoginHistoryReadSchema],
)
def get_login_history(
    db: Session = Depends(get_db),
):
    statement = (
        select(LoginHistory)
        .order_by(LoginHistory.login_at.desc())
    )

    return db.exec(statement).all()

@router.get(
    "/{history_id}",
    response_model=LoginHistoryReadSchema,
)
def get_login_history_by_id(
    history_id: int,
    db: Session = Depends(get_db),
):
    history = db.get(LoginHistory, history_id)

    if not history:
        raise HTTPException(
            status_code=404,
            detail="Login history not found",
        )

    return history


@router.get(
    "/user/{user_id}",
    response_model=list[LoginHistoryReadSchema],
)
def get_user_login_history(
    user_id: int,
    db: Session = Depends(get_db),
):
    statement = (
        select(LoginHistory)
        .where(LoginHistory.user_id == user_id)
        .order_by(LoginHistory.login_at.desc())
    )

    return db.exec(statement).all()


def record_logout(
    db: Session,
    email: str,
) -> LoginHistory | None:

    statement = (
            select(User)
            .where(User.email==email)
        )
    
    result = db.exec(statement)
    for res in result:
        history_statement = (
            select(LoginHistory)
            .where(LoginHistory.user_id == res.id)
            .where(LoginHistory.login_out.is_(None))
            .order_by(LoginHistory.login_at.desc())
        )

        login_history = db.exec(history_statement).first()

        if not login_history:
            return None

        login_history.login_out = datetime.now()

        db.add(login_history)
        db.commit()
        db.refresh(login_history)

        return login_history