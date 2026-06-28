from pydantic import BaseModel, ConfigDict
from typing import Union
from datetime import datetime


class RoleBase(BaseModel):
    model_config= ConfigDict(from_attributes=True)
    role_name: str
    created_at: Union[None, datetime] = None
    updated_at: Union[None, datetime] = None


class CreateRoleSchema(RoleBase):
    model_config= ConfigDict(from_attributes=True)

class UpdateRoleSchema(BaseModel):
    model_config= ConfigDict(from_attributes=True)
    id:int
    role_name: str
    created_at: Union[None, datetime] = None
    updated_at: Union[None, datetime] = None
    
class RoleSchema(RoleBase):
    id: int
    model_config= ConfigDict(from_attributes=True)