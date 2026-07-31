from datetime import datetime, timedelta
from app.core.mail_config_setup import conf
import random


otp_store = {}

from fastapi_mail import FastMail, MessageSchema
import random


async def send_otp_email(email: str):
    otp = generate_otp(email)

    html = f"""
    <html>
        <body>
            <h2>Your OTP Code</h2>
            <p>Your OTP is:</p>
            <h1>{otp}</h1>
            <p>This code expires in 5 minutes.</p>
        </body>
    </html>
    """

    message = MessageSchema(
        subject="Your OTP Code",
        recipients=[email],
        body=html,
        subtype="html"
    )

    fm = FastMail(conf)
    await fm.send_message(message)

    return otp


def generate_otp(email: str):
    otp = str(random.randint(100000, 999999))
    otp_store[email] = {
        "otp": otp,
        "exp": datetime.utcnow() + timedelta(minutes=5)
    }
    return otp

def verify_otp(email: str, otp: str):
    record = otp_store.get(email)
    if not record:
        return False
    if datetime.utcnow() > record["exp"]:
        return False
    return record["otp"] == otp

