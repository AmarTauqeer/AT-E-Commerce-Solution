from pydantic import EmailStr
from typing import List, Optional
from datetime import datetime
from sqlmodel import Relationship, SQLModel, Field


class Category(SQLModel, table=True):
    id: Optional[int] = Field(primary_key=True, index=True)
    category_name: str
    updated_at: datetime = Field(
        default_factory=datetime.now(),
    )
    created_at: datetime = Field(
        default_factory=datetime.now(),
    )
    product: list["Product"] = Relationship(back_populates="category")


class Product(SQLModel, table=True):
    id: Optional[int] = Field(primary_key=True, index=True)
    category_id: int | None = Field(default=None, foreign_key="category.id")
    product_name: str = Field(default=None, unique=True, nullable=False)
    product_description: str = Field(default=None, nullable=False)
    # purchase_price: Optional[int] = Field(default=0, nullable=True)
    sale_price: Optional[int] = Field(default=0, nullable=True)
    image_path: Optional[str] = Field(nullable=True)
    updated_at: datetime = Field(
        default_factory=lambda: (datetime.utcnow()),
    )
    created_at: datetime = Field(
        default_factory=lambda: (datetime.utcnow()),
    )
    category: Optional["Category"] = Relationship(back_populates="product")


class Role(SQLModel, table=True):
    id: Optional[int] = Field(primary_key=True, index=True)
    role_name: str
    updated_at: datetime = Field(
        default_factory=datetime.now(),
    )
    created_at: datetime = Field(
        default_factory=datetime.now(),
    )
    roles: list["User"] = Relationship(back_populates="role")


class UserPermission(SQLModel, table=True):
    # user permissions
    id: Optional[int] = Field(primary_key=True, index=True)
    user: int | None = Field(default=None, foreign_key="user.id")
    resource: int | None = Field(default=None, foreign_key="resource.id")
    Read: bool = False
    Write: bool = False
    Update: bool = False
    Delete: bool = False
    updated_at: datetime = Field(
        default_factory=datetime.now(),
    )
    created_at: datetime = Field(
        default_factory=datetime.now(),
    )
    userPermission: list["User"] = Relationship(
        back_populates="userPermission")

class LoginHistory(SQLModel, table=True):
    __tablename__ ="loginhistory"

    id:  Optional[int] = Field(primary_key=True, index=True)
    user_id: int | None = Field(default=None, foreign_key="user.id")
    login_at: datetime = Field(default_factory=lambda:datetime.now(),nullable=True)
    login_out: datetime = Field(default=None, nullable=True)
    ip_address: str | None = Field(
        default=None,
        max_length=100,
        nullable=True,
    )

    failure_reason: str | None = Field(
        default=None,
        max_length=300,
        nullable=True,
    )

    user: Optional["User"] = Relationship(
        back_populates="login_history"
    )
    success: bool = Field(
        default=True,
        nullable=False,
    )
    



class User(SQLModel, table=True):
    __tablename__="user"

    id:  Optional[int] = Field(primary_key=True, index=True)
    role_id: int | None = Field(default=None, foreign_key="role.id")
    first_name: Optional[str]
    last_name: Optional[str]
    email: EmailStr = Field(max_length=100)
    password: str
    is_active: bool = False
    is_verified: bool = False
    verified_at: datetime = Field(
        default_factory=datetime.now(),
    )
    registered_at: datetime = Field(
        default_factory=datetime.now(),
    )
    updated_at: datetime = Field(
        default_factory=datetime.now(),
    )
    created_at: datetime = Field(
        default_factory=datetime.now(),
    )
    failed_login_attempts: int = Field(
            default=0,
            nullable=True,
    )
    
    locked_until: datetime | None = Field(
            default=None,
            nullable=True,
    )

    role: Optional[Role] = Relationship(back_populates="roles")
    userPermission: Optional[List[UserPermission]] = Relationship(
        back_populates="userPermission")
    login_history: list["LoginHistory"] = Relationship(back_populates="user", cascade_delete=True,)


class Order(SQLModel, table=True):
    __tablename__ = "order"

    id: Optional[int] = Field(primary_key=True, index=True)
    user_id: int | None = Field(default=None, foreign_key="user.id")
    order_amount: int | None = Field(default=None)
    order_status: str | None = Field(default="created")
    updated_at: datetime = Field(
        default_factory=datetime.now(),
    )
    created_at: datetime = Field(
        default_factory=datetime.now(),
    )
    orderitems: list["OrderItems"] = Relationship(
        back_populates="order", cascade_delete=True)


class OrderItems(SQLModel, table=True):
    __tablename__ = "orderitems"

    id: Optional[int] = Field(primary_key=True, index=True)
    order_id: int | None = Field(default=None, foreign_key="order.id")
    product_id: int | None = Field(default=None, foreign_key="product.id")
    purchase_price: Optional[int] = Field(default=0, nullable=True)
    quantity: int | None = Field(nullable=False)
    updated_at: datetime = Field(
        default_factory=lambda: (datetime.utcnow()),
    )
    created_at: datetime = Field(
        default_factory=lambda: (datetime.utcnow()),
    )
    order: Optional["Order"] = Relationship(back_populates="orderitems")


class Resource(SQLModel, table=True):
    __tablename__ = "resource"
    # forms and reports

    id: Optional[int] = Field(primary_key=True, index=True)
    resource_name: str
    updated_at: datetime = Field(
        default_factory=datetime.now(),
    )
    created_at: datetime = Field(
        default_factory=datetime.now(),
    )
