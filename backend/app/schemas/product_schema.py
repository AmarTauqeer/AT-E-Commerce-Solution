from pydantic import BaseModel, ConfigDict
from typing import Union
from datetime import datetime


class ProductBase(BaseModel):
    model_config= ConfigDict(from_attributes=True)
    category_id: int
    product_name: str
    product_description: str
    image_path: str | None = None
    sale_price: int
    created_at: Union[None, datetime] = None
    updated_at: Union[None, datetime] = None


class CreateProductSchema(ProductBase):
    model_config= ConfigDict(from_attributes=True)

class UpdateProductSchema(BaseModel):
    model_config= ConfigDict(from_attributes=True)
    id:int
    category_id: int
    product_name: str
    product_description: str
    image_path: str | None = None
    sale_price: int
    created_at: Union[None, datetime] = None
    updated_at: Union[None, datetime] = None

    
class ProductSchema(ProductBase):
    id: int
    model_config= ConfigDict(from_attributes=True)
