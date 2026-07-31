from datetime import datetime

from fastapi import HTTPException
from sqlmodel import select

from app.api.models.models import User
from app.core.security import get_password_hash


async def create_user_account(data, db):

    hashed_password = get_password_hash(data.password)

    new_user = User(
        first_name=data.first_name,
        last_name=data.last_name,
        email=data.email,
        password=hashed_password,
        is_active=False,
        is_verified=False,
        created_at=datetime.now(),
        registered_at=datetime.now(),
        updated_at=datetime.now(),
        verified_at=datetime.now(),
        role_id=1,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user
