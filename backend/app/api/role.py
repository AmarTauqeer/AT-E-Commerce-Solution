from typing import List

from sqlmodel import select

from core.config import get_settings
from fastapi import APIRouter, Depends, Response, HTTPException, Cookie
from core.security import get_current_user
from schemas.role_schema import RoleSchema, CreateRoleSchema, UpdateRoleSchema
from starlette import status

from sqlalchemy.orm import Session
from core.db import get_db
from api.models.models import Role

settings = get_settings()

router = APIRouter(tags=["User Role"],
                   dependencies=[Depends(get_current_user)])


@router.get('/', response_model=List[RoleSchema])
async def get_roles(db: Session = Depends(get_db)):
    list_of_roles = db.exec(select(Role)).all()
    return  list_of_roles

@router.post('/', status_code=status.HTTP_201_CREATED, response_model=List[RoleSchema])
async def role_sent(post_role:CreateRoleSchema, db:Session = Depends(get_db)):
    new_role = Role(**post_role.dict())
    db.add(new_role)
    db.commit()
    db.refresh(new_role)
    return [new_role]


@router.get('/{id}', response_model=Role, status_code=status.HTTP_200_OK)
async def get_one_role(id:int ,db:Session = Depends(get_db)):
    role = db.get(Role, id)
    if role is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"The id: {id} you requested for does not exist")
    return role

@router.delete('/{id}')
async def delete_one_role(id:int, db:Session = Depends(get_db)):

    deleted_role = db.get(Role, id)

    if not deleted_role:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"The id: {id} you requested for does not exist")
    db.delete(deleted_role)
    db.commit()
    return {
        'status_code':204,
        'message': "successfully deleted"
    }


@router.patch('/{id}', response_model=CreateRoleSchema)
async def update_role(role:UpdateRoleSchema, id:int, db:Session = Depends(get_db)):
    updated_role =  db.get(Role,id)

    if not updated_role:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"The id:{id} does not exist")

    for field, value in role.model_dump().items():
        setattr(updated_role, field, value)

    db.commit()
    db.refresh(updated_role)
    return  updated_role