from typing import List

from sqlmodel import func, select

from app.core.config import get_settings
from fastapi import APIRouter, Depends, Response, HTTPException
from app.core.security import get_current_user
from app.schemas.orderitems_schema import OrderItemsSchema, CreateOrderItemsSchema, UpdateOrderItemsSchema
from starlette import status

from sqlalchemy.orm import Session
from app.core.db import get_db
from app.api.models.models import OrderItems

router = APIRouter(tags=["Lineitems"],
                   dependencies=[Depends(get_current_user)])

settings = get_settings()


@router.get('/', response_model=List[OrderItemsSchema])
async def get_orderItems_all(db: Session = Depends(get_db)):
    list_of_orderItems = db.exec(select(OrderItems)).all()
    return  list_of_orderItems

@router.post('/', status_code=status.HTTP_201_CREATED, response_model=List[OrderItemsSchema])
async def orderItems_sent(post_orderItems:CreateOrderItemsSchema, db:Session = Depends(get_db)):
    new_orderItem = OrderItems(**post_orderItems.dict())
    db.add(new_orderItem)
    db.commit()
    db.refresh(new_orderItem)
    return [new_orderItem]


@router.patch('/{id}', response_model=CreateOrderItemsSchema)
async def update_orderItems(orderItems:UpdateOrderItemsSchema, id:int, db:Session = Depends(get_db)):
    updated_orderItems =  db.get(OrderItems,id)

    if not updated_orderItems:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"The id:{id} does not exist")

    for field, value in orderItems.model_dump().items():
        setattr(updated_orderItems, field, value)

    db.commit()
    db.refresh(updated_orderItems)
    return  updated_orderItems
   

@router.get('/{id}', response_model=OrderItemsSchema, status_code=status.HTTP_200_OK)
async def get_order_items(id:int ,db:Session = Depends(get_db)):
    orderItems = db.get(OrderItems, id)
    if orderItems is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"The id: {id} you requested for does not exist")
    return orderItems


@router.get('/order/{orderId}', response_model=List[OrderItemsSchema], status_code=status.HTTP_200_OK)
async def get_order_items(orderId:int ,db:Session = Depends(get_db)):

    count_statement = select(func.count()).select_from(OrderItems).where(OrderItems.order_id == orderId)
    total = db.exec(count_statement).one()

    statement = select(OrderItems).where(OrderItems.order_id == orderId)
    results = db.exec(statement).all()

    # for item in results:
    #     print(item)

    # orderItems = db.get(models.OrderItems, id)
    if total==0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"The id: {orderId} you requested for does not exist")
    return results

@router.delete('/{id}')
async def delete_order_items(id:int, db:Session = Depends(get_db)):

    deleted_orderItems = db.get(OrderItems, id)

    if not deleted_orderItems:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"The id: {id} you requested for does not exist")
    db.delete(deleted_orderItems)
    db.commit()
    return {
        'status_code':204,
        'message': "successfully deleted"
    }