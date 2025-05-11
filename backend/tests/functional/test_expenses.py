# test_expenses.py

def get_token(client):
    res = client.post("/auth/login", json={
        "username": "testuser",
        "password": "testpass"
    })
    return res.get_json()["access_token"]

def test_add_expense(client):
    token = get_token(client)
    response = client.post("/api/expenses", 
        json={
            "amount": 50.0,
            "category": "Food",
            "description": "Lunch"
        },
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 201
    assert response.get_json()["msg"] == "Expense created!"
