from pydantic import BaseModel, ConfigDict
from typing import Union
from datetime import datetime


class UserPermissionBase(BaseModel):
    model_config= ConfigDict(from_attributes=True)
    user: int
    resource: int
    Read: bool=False
    Write: bool=False
    Update: bool=False
    Delete: bool=False
    created_at: Union[None, datetime] = None
    updated_at: Union[None, datetime] = None


class CreateUserPermissionSchema(UserPermissionBase):
    model_config= ConfigDict(from_attributes=True)

class UpdateUserPermissionSchema(BaseModel):
    model_config= ConfigDict(from_attributes=True)
    id:int
    user: int
    resource: int
    Read: bool=False
    Write: bool=False
    Update: bool=False
    Delete: bool=False

    
class UserPermissionSchema(UserPermissionBase):
    id: int
    model_config= ConfigDict(from_attributes=True)
