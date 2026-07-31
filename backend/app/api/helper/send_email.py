from fastapi_mail import FastMail, MessageSchema
from app.core.mail_config_setup import conf
from app.core.security import create_access_token


async def send_email_varification(email: str):

    token = create_access_token({
        "sub": email
    })

    verification_url = (
    f"http://localhost:3000"
    f"/verify-email?token={token}"
)

    html = f"""
    <html>
        <body>
            <h2>Email Verification</h2>
            <p>Click below to verify your account:</p>
            <a href={verification_url} target='_blank'>Verify Your Account</a>
            <p>This link will expire in 5 minutes.</p>
        </body>
    </html>
    """

    message = MessageSchema(
        subject="Account Verification Email",
        recipients=[email],
        body=html,
        subtype="html"
    )

    fm = FastMail(conf)
    await fm.send_message(message)

async def send_reset_email(email: str):

    token = create_access_token({
        "sub": email
    })

    reset_password_url = (
    f"http://localhost:3000"
    f"/reset-password?token={token}"
)

    html = f"""
    <html>
        <body>
            <h2>Password Rest URL</h2>
            <p>Click below to reset your account password:</p>
            <a href={reset_password_url} target='_blank'>Rest Your Account Password</a>
            <p>This link will expire in 5 minutes.</p>
        </body>
    </html>
    """

    message = MessageSchema(
        subject="Account Password Reset Email",
        recipients=[email],
        body=html,
        subtype="html"
    )

    fm = FastMail(conf)
    await fm.send_message(message)