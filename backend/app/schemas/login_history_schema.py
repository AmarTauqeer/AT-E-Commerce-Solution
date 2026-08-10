from datetime import datetime

from pydantic import BaseModel, ConfigDict


class LoginHistoryBase(BaseModel):
    user_id: int
    login_at: datetime
    login_out: datetime | None = None
    ip_address: str | None = None
    failure_reason: str | None = None


class CreateLoginHistoryRequest(BaseModel):
    user_id: int
    ip_address: str | None = None
    success: bool = True
    failure_reason: str | None = None


class LoginHistoryReadSchema(BaseModel):
    id: int
    user_id: int
    login_at: datetime
    login_out: datetime | None
    ip_address: str | None
    success: bool
    failure_reason: str | None

    model_config = ConfigDict(from_attributes=True)

