from pydantic import BaseModel


class LoginSchema(BaseModel):
    username: str
    password: str
    role:int

class ResetPassword(BaseModel):
    token: str
    password: str