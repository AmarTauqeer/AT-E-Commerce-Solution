from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_invalid_password():
    response = client.post(
        "/auth/signin",
        json={
            "username": "admin@test.com",
            "password": "wrong",
            "role":2
        }
    )

    responseJson = response.json()
    assert responseJson['status_code'] == 401
    assert "access_token" not in response.cookies