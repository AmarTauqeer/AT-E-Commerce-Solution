from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_cookie_is_httponly():
    response = client.post(
        "/auth/signin",
        json={
            "username": "your username",
            "password": "password",
            "role":2
        }
    )
    # print(response.status_code)
    # print(response.headers)

    cookie = response.headers["set-cookie"]

    assert "HttpOnly" in cookie
    assert "Path=/" in cookie
    assert "SameSite=lax" in cookie

    # In production
    # assert "Secure" in cookie