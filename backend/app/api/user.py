import datetime
from typing import List

from fastapi.responses import JSONResponse
from sqlmodel import select

from api.helper.user_helper import create_user_account
from api.helper.user_response import UserResponse
from core.config import get_settings
from fastapi import APIRouter, Depends, HTTPException
from core.security import get_current_user, get_password_hash
from schemas.users_schema import ForgotPassword, UserUpdateSchema, CreateUserRequest
from starlette import status

from sqlalchemy.orm import Session
from core.db import get_db
from api.models.models import User
from api.helper.send_email import send_email_varification

router = APIRouter(tags=["User"])

settings = get_settings()


# create
@router.post('', status_code=status.HTTP_201_CREATED)
async def register(data: CreateUserRequest, db: Session = Depends(get_db)):
    user = len(db.exec(select(User).where(User.email == data.email)).all())
    # print(user != 0)

    if user != 0:
        message = 'Email is already registered with us.'
        return JSONResponse(content=message)
        # return HTTPException(status_code=401, detail='Email is already registered with us.')
    else:
        await create_user_account(data=data, db=db)
        message = 'User account is created successfully.'
        await send_email_varification(data.email)
        return JSONResponse(content=message)

# get all


@router.get('/', response_model=List[UserResponse], dependencies=[Depends(get_current_user)])
async def users_list(db: Session = Depends(get_db)):
    users = db.exec(select(User)).all()
    data_role = []
    for u in users:
        permission = u.userPermission
        user_role = {}
        if permission:
            u_permission = []
            if len(permission) > 0:
                for p in permission:
                    permissions = {
                        'id': p.id,
                        'resource': p.resource,
                        'Read': p.Read,
                        'Write': p.Write,
                        'Update': p.Update,
                        'Delete': p.Delete
                    }
                    u_permission.append(permissions)
            else:
                u_permission = {
                    'id': permission.id,
                    'resource': permission.resource,
                    'Read': permission.Read,
                    'Write': permission.Write,
                    'Update': permission.Update,
                    'Delete': permission.Delete
                }

            user_role = {
                'id': u.id,
                'first_name': u.first_name,
                'last_name': u.last_name,
                'email': u.email,
                'role': {'id': u.role.id, 'role_name': u.role.role_name},
                'userPermission': u_permission
            }
        else:
            user_role = {
                'id': u.id,
                'first_name': u.first_name,
                'last_name': u.last_name,
                'email': u.email,
                'role': {'id': u.role.id, 'role_name': u.role.role_name}
            }
        data_role.append(user_role)
    return data_role

# get by id


@router.get('/{id}', response_model=UserResponse, status_code=status.HTTP_200_OK, dependencies=[Depends(get_current_user)])
def get_user_by_id(id: int, db: Session = Depends(get_db)):

    user = db.get(User, id)
    if user is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"The id: {id} you requested for does not exist")
    permission = user.userPermission
    # print(permission)
    user_role = {}
    if permission:
        u_permission = []
        if len(permission) > 0:
            for p in permission:
                permissions = {
                    'id': p.id,
                    'resource': p.resource,
                    'Read': p.Read,
                    'Write': p.Write,
                    'Update': p.Update,
                    'Delete': p.Delete
                }
                u_permission.append(permissions)
        else:
            u_permission = {
                'id': permission.id,
                'resource': permission.resource,
                'Read': permission.Read,
                'Write': permission.Write,
                'Update': permission.Update,
                'Delete': permission.Delete
            }

        user_role = {
            'id': user.id,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'email': user.email,
            'role': {'id': user.role.id, 'role_name': user.role.role_name},
            'userPermission': u_permission
        }
    else:
        user_role = {
            'id': user.id,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'email': user.email,
            'role': {'id': user.role.id, 'role_name': user.role.role_name}
        }
    return user_role

# delete


@router.delete('/{id}', status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(get_current_user)])
def delete_user(id: int, db: Session = Depends(get_db)):

    deleted_user = db.query(User).filter(User.id == id)

    if deleted_user.first() is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"The id: {id} you requested for does not exist")
    deleted_user.delete(synchronize_session=False)
    db.commit()


# update
@router.patch('/update/{id}', response_model=UserResponse, dependencies=[Depends(get_current_user)])
def update_test_user(update_user: UserUpdateSchema, id: int, db: Session = Depends(get_db)):
    print(update_user)

    updated_user = db.query(User).filter(User.id == id)
    print(updated_user)
    # hashing password
    update_user.password = get_password_hash(update_user.password)

    if updated_user.first() is None:
        return HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"The id:{id} does not exist")
    
    updated_user.update(update_user.dict(), synchronize_session=False)
    
    db.commit()
    
    user = updated_user.first()
    permission = user.userPermission
    user_role = {}
    if permission:
        u_permission = []
        if len(permission) > 0:
            for p in permission:
                permissions = {
                    'id': p.id,
                    'resource': p.resource,
                    'Read': p.Read,
                    'Write': p.Write,
                    'Update': p.Update,
                    'Delete': p.Delete
                }
                u_permission.append(permissions)
        else:
            u_permission = {
                'id': permission.id,
                'resource': permission.resource,
                'Read': permission.Read,
                'Write': permission.Write,
                'Update': permission.Update,
                'Delete': permission.Delete
            }

        user_role = {
            'id': user.id,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'email': user.email,
            'role': {'id': user.role.id, 'role_name': user.role.role_name},
            'userPermission': u_permission
        }
    else:
        user_role = {
            'id': user.id,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'email': user.email,
            'role': {'id': user.role.id, 'role_name': user.role.role_name}
        }
    return user_role

