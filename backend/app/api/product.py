import os
from pathlib import Path
from typing import List, Optional
import uuid

from datetime import date, datetime
from sqlmodel import select
import supabase

from app.core.config import get_settings
from fastapi import APIRouter, Depends, File, Form, Response, HTTPException, Cookie, UploadFile
from app.core.security import get_current_user
from app.core.upload import upload_product_image
from app.schemas.product_schema import ProductSchema, CreateProductSchema, UpdateProductSchema
from starlette import status

from sqlalchemy.orm import Session
from app.core.db import get_db
from app.api.models.models import Product

# UPLOAD_DIR = Path() / 'static/uploads/product'
# HOST="http://127.0.0.1:8000"    #local

UPLOAD_DIR = Path() / 'static/uploads/product'  #production
HOST="https://at-backend-api.vercel.app"    #production

router = APIRouter(tags=["Product"],
                   dependencies=[Depends(get_current_user)])


@router.get('/', response_model=List[ProductSchema])
async def get_products_all(db: Session = Depends(get_db)):
    list_of_product = db.exec(select(Product)).all()
    return  list_of_product

@router.post('/', status_code=status.HTTP_201_CREATED, response_model=List[ProductSchema])
async def product_sent(product_name:str=Form(...),
                       product_description:str = Form(...),
                       category_id:int = Form(...),
                       sale_price:int = Form(...),
                       created_at:Optional[date] = Form(...), 
                       file_upload: UploadFile|None=File(None), db:Session = Depends(get_db)):
    image_path=""
    
    if file_upload:
        image_path = await upload_product_image(file_upload)

    if image_path!="":
        product = Product(
            category_id=category_id,
            product_name=product_name,
            product_description=product_description,
            image_path=image_path,
            sale_price=sale_price,
            created_at=created_at
            )

        db.add(product)
        db.commit()
        db.refresh(product)

        return [product]
    else:
        product = Product(
                category_id=category_id,
                product_name=product_name,
                product_description=product_description,
                sale_price=sale_price,
                created_at=created_at
                )
    
        db.add(product)
        db.commit()
        db.refresh(product)

        return [product]

        

    # if file_upload:
    #     data = await file_upload.read()

    #     unique_name = f"{uuid.uuid4()}_{file_upload.filename}"
    #     print(unique_name)
    #     save_to = UPLOAD_DIR / unique_name

    #     with open(save_to, 'wb') as f:
    #         f.write(data)
        

    #     image_path = f"{HOST}/static/uploads/product/{unique_name}"

    # if image_path!="":
    #     product = Product(
    #         category_id=category_id,
    #         product_name=product_name,
    #         product_description=product_description,
    #         image_path=image_path,
    #         sale_price=sale_price,
    #         created_at=created_at
    #         )

    #     db.add(product)
    #     db.commit()
    #     db.refresh(product)

    #     return [product]
    # else:
    #     product = Product(
    #         category_id=category_id,
    #         product_name=product_name,
    #         product_description=product_description,
    #         sale_price=sale_price,
    #         created_at=created_at
    #         )

    #     db.add(product)
    #     db.commit()
    #     db.refresh(product)

    #     return [product]



@router.patch('/{id}', response_model=CreateProductSchema)
async def update_product(product_name:str=Form(...),
                       product_description:str = Form(...),
                       category_id:int = Form(...),
                       sale_price:int = Form(...), 
                       created_at:Optional[date] = Form(...),
                       file_upload: UploadFile | None=File(None), 
                       id:int=1, db:Session = Depends(get_db)):
    updated_product =  db.get(Product,id)

    if not updated_product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"The id:{id} does not exist")


    image_path = db.query(Product.image_path).filter(Product.id == id).scalar()
    image_path_for_update=image_path
    # local

    # if file_upload!=None:
    #     if(image_path!=None):
    #         file_name = image_path[45:]
    #         rootDir ="static/uploads/product"
    #         for relPath,dir, files in os.walk(rootDir):
    #             fullPath = os.path.join(relPath, file_name)
    #             if(file_name in files):
    #                 os.remove(fullPath)
                    
    #         data = await file_upload.read()

    #         unique_name = f"{uuid.uuid4()}_{file_upload.filename}"
    #         print(unique_name)
    #         save_to = UPLOAD_DIR / unique_name

    #         with open(save_to, 'wb') as f:
    #             f.write(data)
    #         image_path_for_update = f"{HOST}/static/uploads/product/{unique_name}"
    #     else:
    #         data = await file_upload.read()

    #         unique_name = f"{uuid.uuid4()}_{file_upload.filename}"
    #         print(unique_name)
    #         save_to = UPLOAD_DIR / unique_name

    #         with open(save_to, 'wb') as f:
    #             f.write(data)
    #         image_path_for_update = f"{HOST}/static/uploads/product/{unique_name}"



    # production
    # new image
    
    if file_upload!=None:
        new_image_url = await upload_product_image(file_upload)
        image_path_for_update = new_image_url


    updated_product.category_id=category_id,
    updated_product.product_name=product_name,
    updated_product.product_description=product_description,
    updated_product.image_path=image_path_for_update,
    updated_product.sale_price=sale_price,
    updated_product.id=id,
    updated_product.created_at=created_at

    db.commit()
    db.refresh(updated_product)

    if image_path:
        filename = image_path.split("/")[-1]
        supabase.storage.from_("products").remove([filename])

    return  updated_product
   

@router.get('/{id}', response_model=Product, status_code=status.HTTP_200_OK)
async def get_product(id:int ,db:Session = Depends(get_db)):
    product = db.get(Product, id)
    if product is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"The id: {id} you requested for does not exist")
    return product


@router.delete('/{id}')
async def delete_product(id:int, db:Session = Depends(get_db)):

    deleted_product = db.get(Product, id)

    if not deleted_product:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"The id: {id} you requested for does not exist")
    
    # delete product image
    image_path = db.query(Product.image_path).filter(Product.id == id).scalar()
    
    if(image_path!=None):
        file_name = image_path[45:]
        # print(file_name)
        rootDir ="static/uploads/product"
        for relPath, dir, files in os.walk(rootDir):
            # print(files)
            if(file_name in files):
                fullPath = os.path.join(relPath, file_name)
                os.remove(fullPath)
    db.delete(deleted_product)
    db.commit()
    return {
        'status_code':204,
        'message': "successfully deleted"
    }
   
