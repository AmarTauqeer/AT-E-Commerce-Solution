# api/policies.py

from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlmodel import select

from app.api.models.models import User
from app.core.db import get_db
from app.core.security import get_current_user



def require_admin(
    current_user=Depends(get_current_user),
     db: Session = Depends(get_db)
):

    
    email = current_user['sub']
    statement = (
            select(User)
            .where(User.email==email)
        )
    
    result = db.exec(statement)
    for user in result:
        if not user.role_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Admin access required",
            )

        if user.role_id != 2:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Admin access required",
            )

    return current_user