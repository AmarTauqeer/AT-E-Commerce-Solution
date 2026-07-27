from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_login_success():
    response = client.post(
        "/auth/signin",
        json={
            "username": "username",
            "password": "password",
            "role": 2
        }
    )

    assert response.status_code == 200

    assert "access_token" in response.cookies

