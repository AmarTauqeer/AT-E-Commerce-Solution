from pydantic import BaseModel, ConfigDict
from typing import Union
from datetime import date, datetime


class CategoryBase(BaseModel):
    model_config= ConfigDict(from_attributes=True)
    category_name: str
    created_at: Union[None, datetime] = None
    updated_at: Union[None, datetime] = None


class CreateCategorySchema(CategoryBase):
    model_config= ConfigDict(from_attributes=True)

class UpdateCategorySchema(BaseModel):
    model_config= ConfigDict(from_attributes=True)
    id:int
    category_name: str
    created_at: Union[None, datetime] = None
    updated_at: Union[None, datetime] = None

class CategorySchema(CategoryBase):
    id: int
    model_config= ConfigDict(from_attributes=True)

    