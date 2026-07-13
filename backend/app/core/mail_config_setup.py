from fastapi_mail import ConnectionConfig

conf = ConnectionConfig(
    MAIL_USERNAME="your mail username",
    MAIL_PASSWORD="app password",
    MAIL_FROM="from",
    MAIL_PORT=587,
    MAIL_SERVER="smtp.gmail.com",
    MAIL_FROM_NAME="app name",
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True
)


