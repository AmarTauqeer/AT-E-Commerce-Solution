from fastapi_mail import FastMail, MessageSchema
from core.mail_config_setup import conf
from core.security import create_access_token


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