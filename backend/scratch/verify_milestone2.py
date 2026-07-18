import requests
import json
import time

BASE_URL = "http://127.0.0.1:5000"

print("Starting Milestone 2 Verification...")

# 1. Health check
print("\n=== Testing Health Check Endpoint ===")
try:
    r = requests.get(f"{BASE_URL}/api/v1/health")
    print(f"Status Code: {r.status_code}")
    print(f"X-Request-ID Header: {r.headers.get('X-Request-ID')}")
    print(json.dumps(r.json(), indent=2))
except Exception as e:
    print(f"Health check failed: {e}")

# 2. Register user
print("\n=== Testing Register user ===")
reg_payload = {
    "name": "Milestone2 Tester",
    "email": "tester_m2@example.com",
    "password": "password123"
}
try:
    r = requests.post(f"{BASE_URL}/api/v1/auth/register", json=reg_payload)
    print(f"Status Code: {r.status_code}")
    print(json.dumps(r.json(), indent=2))
except Exception as e:
    print(f"Register failed: {e}")

# 3. Login
print("\n=== Testing Login ===")
login_payload = {
    "email": "tester_m2@example.com",
    "password": "password123"
}
tokens = None
try:
    r = requests.post(f"{BASE_URL}/api/v1/auth/login", json=login_payload)
    print(f"Status Code: {r.status_code}")
    print(f"X-Request-ID: {r.headers.get('X-Request-ID')}")
    res = r.json()
    print(json.dumps(res, indent=2))
    if res.get("success"):
        tokens = res.get("data")
except Exception as e:
    print(f"Login failed: {e}")

if tokens:
    headers = {"Authorization": f"Bearer {tokens['access_token']}"}
    
    # 4. Get profile (secure version)
    print("\n=== Testing Secure Profile ===")
    try:
        r = requests.get(f"{BASE_URL}/api/v1/auth/profile", headers=headers)
        print(f"Status Code: {r.status_code}")
        print(f"X-Request-ID: {r.headers.get('X-Request-ID')}")
        print(json.dumps(r.json(), indent=2))
    except Exception as e:
        print(f"Secure Profile check failed: {e}")
        
    # 5. Get profile (legacy wrapper version)
    print("\n=== Testing Legacy Profile Wrapper ===")
    try:
        r = requests.get(f"{BASE_URL}/auth/profile/tester_m2@example.com", headers=headers)
        print(f"Status Code: {r.status_code}")
        print(f"X-Request-ID: {r.headers.get('X-Request-ID')}")
        print(json.dumps(r.json(), indent=2))
    except Exception as e:
        print(f"Legacy Profile check failed: {e}")
        
    # 6. Fetch stats (secure version)
    print("\n=== Testing Secure Stats ===")
    try:
        r = requests.get(f"{BASE_URL}/api/v1/dashboard/stats", headers=headers)
        print(f"Status Code: {r.status_code}")
        print(json.dumps(r.json(), indent=2))
    except Exception as e:
        print(f"Secure Stats check failed: {e}")

    # 7. Fetch stats (legacy version)
    print("\n=== Testing Legacy Stats Wrapper ===")
    try:
        r = requests.get(f"{BASE_URL}/dashboard/stats/tester_m2@example.com", headers=headers)
        print(f"Status Code: {r.status_code}")
        print(json.dumps(r.json(), indent=2))
    except Exception as e:
        print(f"Legacy Stats check failed: {e}")

    # 8. Fetch daily summary (secure version)
    print("\n=== Testing Secure Summary ===")
    try:
        r = requests.get(f"{BASE_URL}/api/v1/summary", headers=headers)
        print(f"Status Code: {r.status_code}")
        print(json.dumps(r.json(), indent=2))
    except Exception as e:
        print(f"Secure Summary check failed: {e}")

    # 9. Fetch daily summary (legacy version)
    print("\n=== Testing Legacy Summary Wrapper ===")
    try:
        r = requests.get(f"{BASE_URL}/summary/tester_m2@example.com", headers=headers)
        print(f"Status Code: {r.status_code}")
        print(json.dumps(r.json(), indent=2))
    except Exception as e:
        print(f"Legacy Summary check failed: {e}")

else:
    print("Tokens not generated, skipping authenticated endpoints test.")
