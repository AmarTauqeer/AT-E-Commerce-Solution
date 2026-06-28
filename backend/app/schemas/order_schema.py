from pydantic import BaseModel, ConfigDict
from typing import Union
from datetime import datetime


class OrderBase(BaseModel):
    model_config= ConfigDict(from_attributes=True)
    user_id: int
    order_amount: int
    order_status: str
    created_at: Union[None, datetime] = None
    updated_at: Union[None, datetime] = None


class CreateOrderSchema(OrderBase):
    model_config= ConfigDict(from_attributes=True)

class UpdateOrderSchema(BaseModel):
    model_config= ConfigDict(from_attributes=True)
    id:int
    user_id: int
    order_amount: int
    order_status: str
    created_at: Union[None, datetime] = None
    updated_at: Union[None, datetime] = None

class OrderSchema(OrderBase):
    id: int
    model_config= ConfigDict(from_attributes=True)