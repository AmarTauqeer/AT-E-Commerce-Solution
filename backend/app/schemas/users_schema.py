from pydantic import EmailStr, BaseModel, ConfigDict
from typing import Union

class CreateUserRequest(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    first_name: str
    last_name: str
    email: EmailStr
    password: str
    role_id: int

class UserUpdateSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    first_name: Union[None, str] = ""
    last_name: Union[None, str] = ""
    email: EmailStr
    password: str
    role_id: int

class SignInRequestSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    username: str
    password: str
    role_id: int