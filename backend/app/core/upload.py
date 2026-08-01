import uuid

from fastapi import UploadFile

from app.core.storage import supabase


async def upload_product_image(file: UploadFile):

    extension = file.filename.split(".")[-1]

    filename = f"{uuid.uuid4()}.{extension}"

    data = await file.read()

    supabase.storage.from_("products").upload(
        filename,
        data,
        {"content-type": file.content_type},
    )

    url = supabase.storage.from_("products").get_public_url(filename)

    return url