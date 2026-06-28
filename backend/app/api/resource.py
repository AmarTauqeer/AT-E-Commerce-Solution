from typing import List

from sqlmodel import select

from core.config import get_settings
from fastapi import APIRouter, Depends, Response, HTTPException, Cookie
from core.security import get_current_user
from schemas.resource_schema import ResourceSchema, CreateResourceSchema, UpdateResourceSchema
from starlette import status

from sqlalchemy.orm import Session
from core.db import get_db
from api.models.models import Resource

router = APIRouter(tags=["Resource"],
                   dependencies=[Depends(get_current_user)])

settings = get_settings()



@router.get('/', response_model=List[ResourceSchema])
async def get_resources_all(db: Session = Depends(get_db)):
    list_of_resources = db.exec(select(Resource)).all()
    return  list_of_resources

@router.post('/', status_code=status.HTTP_201_CREATED, response_model=List[ResourceSchema])
async def test_resources_sent(post_resource:CreateResourceSchema, db:Session = Depends(get_db)):
   new_resource = Resource(**post_resource.dict())
   db.add(new_resource)
   db.commit()
   db.refresh(new_resource)
   return [new_resource]


@router.get('/{id}', response_model=ResourceSchema, status_code=status.HTTP_200_OK)
async def get_one_resource(id:int ,db:Session = Depends(get_db)):

    resource = db.get(Resource, id)

    if resource is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"The id: {id} you requested for does not exist")
    return resource

@router.delete('/{id}', status_code=status.HTTP_204_NO_CONTENT)
async def delete_test_resource(id:int, db:Session = Depends(get_db)):

    deleted_resource = db.get(Resource, id)

    if not deleted_resource:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"The id: {id} you requested for does not exist")
    db.delete(deleted_resource)
    db.commit()


@router.patch('/{id}', response_model=CreateResourceSchema)
async def update_resource(resource:UpdateResourceSchema, id:int, db:Session = Depends(get_db)):
    updated_resource =   db.get(Resource,id)
    
    if not updated_resource:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"The id:{id} does not exist")

    for field, value in resource.model_dump().items():
        setattr(updated_resource, field, value)
    db.commit()
    
    return  updated_resource