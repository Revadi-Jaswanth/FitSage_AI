import requests
from database import cursor, db

cursor.execute("UPDATE users SET profile_completed = 1 WHERE email = 'usera@example.com'")
db.commit()

BASE_URL = "http://127.0.0.1:5000/api/v1"

print("Starting Coach Sessions Integration Tests...")

# 1. Login User
r_login = requests.post(f"{BASE_URL}/auth/login", json={
    "email": "usera@example.com",
    "password": "password123"
})
assert r_login.status_code == 200, "Login failed"
token = r_login.json()["data"]["access_token"]
headers = {"Authorization": f"Bearer {token}"}
print("Logged in successfully!")

# 2. Send message in session A
session_a = "test_session_aaa"
r_msg1 = requests.post(f"{BASE_URL}/coach/chat", headers=headers, json={
    "message": "Give me a 5 min quick stretching plan.",
    "session_id": session_a
})
print("r_msg1 response status:", r_msg1.status_code)
print("r_msg1 response body:", r_msg1.text)
assert r_msg1.status_code == 200, "Failed to send message in session A"
print("Sent message 1 in Session A")

# 3. Send message in session B
session_b = "test_session_bbb"
r_msg2 = requests.post(f"{BASE_URL}/coach/chat", headers=headers, json={
    "message": "Give me a high protein breakfast suggestion.",
    "session_id": session_b
})
assert r_msg2.status_code == 200, "Failed to send message in session B"
print("Sent message 2 in Session B")

# 4. Fetch list of sessions
r_sessions = requests.get(f"{BASE_URL}/coach/history", headers=headers)
assert r_sessions.status_code == 200, "Failed to list sessions"
sessions_data = r_sessions.json()["data"]
print("Sessions List:", sessions_data)
session_ids = [s["session_id"] for s in sessions_data]
assert session_a in session_ids, "Session A missing from list"
assert session_b in session_ids, "Session B missing from list"

# 5. Fetch messages inside Session A
r_messages_a = requests.get(f"{BASE_URL}/coach/history", headers=headers, params={"session_id": session_a})
assert r_messages_a.status_code == 200, "Failed to load session A messages"
messages_a = r_messages_a.json()["data"]
print("Messages in Session A:", messages_a)
assert len(messages_a) > 0, "No messages inside session A"

# 6. Delete Session A
r_delete = requests.delete(f"{BASE_URL}/coach/session/{session_a}", headers=headers)
assert r_delete.status_code == 200, "Failed to delete session A"
print("Deleted Session A successfully")

# 7. Confirm deletion
r_sessions_final = requests.get(f"{BASE_URL}/coach/history", headers=headers)
sessions_final_data = r_sessions_final.json()["data"]
print("Final Sessions List:", sessions_final_data)
session_ids_final = [s["session_id"] for s in sessions_final_data]
assert session_a not in session_ids_final, "Session A still exists after deletion"
assert session_b in session_ids_final, "Session B was incorrectly deleted"

print("All Coach Sessions Integration Tests passed successfully!")
