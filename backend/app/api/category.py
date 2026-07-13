from typing import List

from sqlmodel import select

from core.config import get_settings
from fastapi import APIRouter, Depends, Response, HTTPException, Cookie
from core.security import get_current_user
from schemas.category_schema import CategorySchema, CreateCategorySchema, UpdateCategorySchema
from starlette import status

from sqlalchemy.orm import Session
from core.db import get_db
from api.models.models import Category

settings = get_settings()

router = APIRouter(tags=["Category"],
                   dependencies=[Depends(get_current_user)])


@router.get('/', response_model=List[CategorySchema])
async def get_categories(db: Session = Depends(get_db)):
    categories = db.exec(select(Category)).all()
    return categories


@router.post('/', status_code=status.HTTP_201_CREATED, response_model=List[Category])
async def category_sent(post_category: CreateCategorySchema, db: Session = Depends(get_db)):
    category = Category(**post_category.dict())
    db.add(category)
    db.commit()
    db.refresh(category)
    return [category]


@router.get('/{id}', response_model=Category, status_code=status.HTTP_200_OK)
async def category_by_id(id: int, db: Session = Depends(get_db)):
    category = db.get(Category, id)
    if category is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"The id: {id} you requested for does not exist")
    return category


@router.delete('/{id}')
async def delete_category(id: int, db: Session = Depends(get_db)):

    deleted_category = db.get(Category, id)

    if not deleted_category:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"The id: {id} you requested for does not exist")
    db.delete(deleted_category)
    db.commit()
    return {
        'status_code':204,
        'message': "successfully deleted"
    }



@router.patch('/{id}', response_model=CreateCategorySchema)
async def update_category(category: UpdateCategorySchema, id: int, db: Session = Depends(get_db)):
    updated_category = db.get(Category, id)

    if not updated_category:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"The id:{id} does not exist")

    for field, value in category.model_dump().items():
        setattr(updated_category, field, value)

    db.commit()
    db.refresh(updated_category)
    return updated_category
