from pydantic import BaseModel, ConfigDict
from typing import Union
from datetime import datetime


class OrderItemsBase(BaseModel):
    model_config= ConfigDict(from_attributes=True)
    order_id:int
    product_id:int
    quantity: int
    purchase_price: int
    created_at: Union[None, datetime] = None
    updated_at: Union[None, datetime] = None


class CreateOrderItemsSchema(OrderItemsBase):
    model_config= ConfigDict(from_attributes=True)

class UpdateOrderItemsSchema(BaseModel):
    model_config= ConfigDict(from_attributes=True)
    id:int
    order_id:int
    product_id:int
    quantity: int
    purchase_price: int
    created_at: Union[None, datetime] = None
    updated_at: Union[None, datetime] = None

    
class OrderItemsSchema(OrderItemsBase):
    id: int
    model_config= ConfigDict(from_attributes=True)
