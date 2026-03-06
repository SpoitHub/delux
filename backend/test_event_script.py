import requests

def run():
    url = "http://localhost:8000/api/v1/auth/login/"
    res = requests.post(url, json={"email": "admin@example.com", "password": "admin12345"})
    if not res.ok:
        print("Login failed:", res.text)
        return
    token = res.json()["access"]

    url = "http://localhost:8000/api/v1/crm/events/"
    headers = {"Authorization": f"Bearer {token}"}
    data = {
        "title": "Test Title",
        "description": "Test Desc",
        "format": "offline",
        "start_datetime": "2026-03-07T14:30:00Z",
        "end_datetime": "2026-03-07T18:30:00Z",
        "is_free": "False",
        "status": "published",
        "location": '{"city": "Test", "address": ""}',
        "ticket_types": '[{"name": "Standard", "price": 100, "quantity_total": 50}]'
    }
    
    # Use files parameter to force multipart/form-data encoding
    res = requests.post(url, headers=headers, data=data, files={"image": ("", "")})
    print("Status:", res.status_code)
    print("Response:", res.text)

if __name__ == "__main__":
    run()
