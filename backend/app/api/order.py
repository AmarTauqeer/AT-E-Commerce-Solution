from typing import List

from sqlmodel import select, text

from core.config import get_settings
from fastapi import APIRouter, Depends, Response, HTTPException
from core.security import get_current_user
from schemas.order_schema import OrderSchema, CreateOrderSchema, UpdateOrderSchema
from starlette import status

from sqlalchemy.orm import Session
from core.db import get_db
from api.models.models import Order

router = APIRouter(tags=["Customer Order"],
                   dependencies=[Depends(get_current_user)])

settings = get_settings()




@router.post('/', status_code=status.HTTP_201_CREATED, response_model=List[OrderSchema])
async def order_sent(post_order:CreateOrderSchema, db:Session = Depends(get_db)):
    new_order = Order(**post_order.dict())
    db.add(new_order)
    db.commit()
    db.refresh(new_order)
    return [new_order]



@router.get('/', response_model=List[OrderSchema])
async def get_orders_all(db: Session = Depends(get_db)):
    list_of_order = db.exec(select(Order)).all()
    return  list_of_order

@router.get('/{id}', response_model=OrderSchema, status_code=status.HTTP_200_OK)
async def get_one_order(id:int ,db:Session = Depends(get_db)):
    order = db.get(Order, id)
    if order is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"The id: {id} you requested for does not exist")
    return order

@router.get('/{id}', response_model=OrderSchema, status_code=status.HTTP_200_OK)
async def get_one_order(id:int ,db:Session = Depends(get_db)):
    order = db.get(Order, id)
    if order is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"The id: {id} you requested for does not exist")
    return order

@router.delete('/{id}', status_code=status.HTTP_204_NO_CONTENT)
async def delete_order(id:int, db:Session = Depends(get_db)):

    deleted_order = db.get(Order, id)
    # print(delete_order)

    if not deleted_order:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"The id: {id} you requested for does not exist")
    db.delete(deleted_order)
    db.commit()
    return {
        'status_code':204,
        'message': "successfully deleted"
    }


@router.patch('/{id}', response_model=UpdateOrderSchema)
async def update_order(order:UpdateOrderSchema, id:int, db:Session = Depends(get_db)):
    updated_order =  db.get(Order,id)

    if not updated_order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"The id:{id} does not exist")

    for field, value in order.model_dump().items():
        setattr(updated_order, field, value)

    db.commit()
    db.refresh(updated_order)
    return  updated_order


@router.get('/view/order-detail-report/{date1}/{date2}')
async def order_detail_report(date1:str, date2:str,db: Session = Depends(get_db)):
    # print(f"date1 = {date1} and date2 ={date2}")
    result = db.execute(text("""select *from order_detail_view 
                             where TO_CHAR(created_at, 'dd-mm-yy') between :from and :to
                             """),{"from":date1, "to":date2})

    rows = result.mappings().all()
    return rows


