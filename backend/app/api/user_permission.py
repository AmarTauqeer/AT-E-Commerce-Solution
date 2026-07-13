from typing import List

from sqlmodel import select

from core.config import get_settings
from fastapi import APIRouter, Depends, Response, HTTPException
from core.security import get_current_user
from schemas.user_permission_schema import UserPermissionSchema, CreateUserPermissionSchema, UpdateUserPermissionSchema
from starlette import status

from sqlalchemy.orm import Session
from core.db import get_db
from api.models.models import UserPermission

router = APIRouter(tags=["User Permission"],
                   dependencies=[Depends(get_current_user)])

settings = get_settings()



@router.get('/', response_model=List[UserPermission])
async def get_user_permissions(db: Session = Depends(get_db)):
    list_of_user_permission = db.exec(select(UserPermission)).all()
    return  list_of_user_permission

@router.post('/', status_code=status.HTTP_201_CREATED, response_model=List[UserPermission])
async def role_sent(post_user_permission:CreateUserPermissionSchema, db:Session = Depends(get_db)):
    new_user_permission = UserPermission(**post_user_permission.dict())
    db.add(new_user_permission)
    db.commit()
    db.refresh(new_user_permission)
    return [new_user_permission]


@router.get('/{id}', response_model=UserPermission, status_code=status.HTTP_200_OK)
async def get_one_user_permission(id:int ,db:Session = Depends(get_db)):
    userPermission = db.get(UserPermission, id)
    if userPermission is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"The id: {id} you requested for does not exist")
    return userPermission

@router.get('/user/{uid}', response_model=List[UserPermission], status_code=status.HTTP_200_OK)
async def get_user_permission_by_user(uid:int ,db:Session = Depends(get_db)):
    count = len(db.exec(select(UserPermission).where(UserPermission.user==uid)).all())
    if count>=1:
        data = db.exec(select(UserPermission).where(UserPermission.user==uid)).all()
        return data
    else:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"The id: {uid} you requested for does not exist")    # return row    

@router.delete('/{id}')
async def delete_test_user_permission(id:int, db:Session = Depends(get_db)):

    deleted_user_permission = db.get(UserPermission, id)

    if not deleted_user_permission:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"The id: {id} you requested for does not exist")
    db.delete(deleted_user_permission)
    db.commit()
    return {
        'status_code':204,
        'message': "successfully deleted"
    }


@router.patch('/{id}', response_model=CreateUserPermissionSchema)
async def update_user_permission(user_permission:UpdateUserPermissionSchema, id:int, db:Session = Depends(get_db)):
    updated_user_permission =  db.get(UserPermission,id)

    if not updated_user_permission:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"The id:{id} does not exist")

    for field, value in user_permission.model_dump().items():
        setattr(updated_user_permission, field, value)

    db.commit()
    db.refresh(updated_user_permission)
    return  updated_user_permission