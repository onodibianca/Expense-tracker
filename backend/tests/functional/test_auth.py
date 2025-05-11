# test_auth.py

def test_register_new_user(client):
    response = client.post("/auth/register", json={
        "username": "newuser",
        "password": "newpassword"
    })
    assert response.status_code == 200
    data = response.get_json()
    assert "access_token" in data
    assert data["msg"] == "Registered succesfully!"

def test_login_success(client):
    response = client.post("/auth/login", json={
        "username": "testuser",
        "password": "testpass"
    })
    assert response.status_code == 200
    data = response.get_json()
    assert "access_token" in data
    assert data["msg"] == "Logged in!"
