from pydantic import BaseModel, ConfigDict
from typing import Union
from datetime import datetime


class ResourceBase(BaseModel):
    model_config= ConfigDict(from_attributes=True)
    resource_name: str
    created_at: Union[None, datetime] = None
    updated_at: Union[None, datetime] = None


class CreateResourceSchema(ResourceBase):
    model_config= ConfigDict(from_attributes=True)

class UpdateResourceSchema(ResourceBase):
    model_config= ConfigDict(from_attributes=True)
    id: int
    resource_name: str
    created_at: Union[None, datetime] = None
    updated_at: Union[None, datetime] = None

class ResourceSchema(ResourceBase):
    id: int
    model_config= ConfigDict(from_attributes=True)