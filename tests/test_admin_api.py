#!/usr/bin/env python3
"""Phase 10 – Admin Backend API Test Suite."""

import json
import random
import string
import urllib.request
import urllib.error
import subprocess
import time
import sys

BASE = "http://localhost:4000"

def rnd(n=8):
    return "".join(random.choices(string.ascii_lowercase + string.digits, k=n))

def req(method, path, body=None, token=None):
    url = BASE + path
    data = json.dumps(body).encode() if body else None
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    request = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(request) as resp:
            raw = resp.read()
            return resp.status, json.loads(raw) if raw else {}
    except urllib.error.HTTPError as e:
        raw = e.read()
        try:
            return e.code, json.loads(raw)
        except Exception:
            return e.code, {}

def check(label, actual, expected):
    if actual == expected:
        print(f"[PASS] {label} (got {actual})")
        return True
    else:
        print(f"[FAIL] {label} — expected {expected}, got {actual}")
        return False

passed = 0
failed = 0

def test(label, actual, expected):
    global passed, failed
    if check(label, actual, expected):
        passed += 1
    else:
        failed += 1

print("[INFO] ==================================================")
print("[INFO] STARTING PHASE 10 ADMIN API TEST SUITE")
print("[INFO] ==================================================")

# 1. Login as Admin
status, data = req("POST", "/auth/login", {
    "email": "admin@bookly.com",
    "password": "AdminPassword123!"
})
test("Admin Login Status", status, 200)
admin_token = data.get("accessToken")
test("Admin Token Received", bool(admin_token), True)

# 2. Register normal Customer
cust_email = f"cust_{rnd()}@example.com"
status, data = req("POST", "/auth/register", {
    "email": cust_email,
    "password": "CustomerPassword123!",
    "name": "Regular Customer"
})
test("Customer Register Status", status, 201)
customer_token = data.get("accessToken")

# 3. Security: Customer attempts to access /admin/stats (Expect 403 Forbidden)
status, data = req("GET", "/admin/stats", token=customer_token)
test("Customer access to /admin/stats blocked with 403", status, 403)

# 4. Security: Customer attempts to access /admin/users (Expect 403 Forbidden)
status, data = req("GET", "/admin/users", token=customer_token)
test("Customer access to /admin/users blocked with 403", status, 403)

# 5. Admin fetches /admin/stats
status, data = req("GET", "/admin/stats", token=admin_token)
test("Admin fetches /admin/stats status", status, 200)
test("Stats contains overview", "overview" in data, True)
test("Stats contains totalRevenue", "totalRevenue" in data.get("overview", {}), True)
test("Stats contains totalBooks", "totalBooks" in data.get("overview", {}), True)

# 6. Admin fetches /admin/users
status, data = req("GET", "/admin/users", token=admin_token)
test("Admin fetches /admin/users status", status, 200)
test("Users list is returned", isinstance(data.get("data"), list), True)

# 7. Admin fetches /orders/admin/all
status, data = req("GET", "/orders/admin/all", token=admin_token)
test("Admin fetches /orders/admin/all status", status, 200)

# 8. Admin creates a Category
cat_slug = f"test-cat-{rnd()}"
status, data = req("POST", "/categories", {
    "name": f"Test Cat {rnd(4)}",
    "slug": cat_slug,
    "description": "Admin test category"
}, token=admin_token)
test("Admin creates Category", status, 201)
cat_id = data.get("id")

# 9. Admin creates a Book
book_isbn = f"978-{rnd(10)}"
status, data = req("POST", "/books", {
    "title": "Admin Test Book",
    "author": "Tester",
    "isbn": book_isbn,
    "description": "A book created by admin test",
    "price": 299.0,
    "stock": 15,
    "categoryId": cat_id
}, token=admin_token)
test("Admin creates Book", status, 201)
book_id = data.get("id")

# 10. Admin updates Book Stock
status, data = req("PATCH", f"/books/{book_id}", {
    "stock": 50
}, token=admin_token)
test("Admin updates Book stock", status, 200)
test("Book stock updated to 50", data.get("stock"), 50)

# 11. Cleanup: Admin deletes Book and Category
status, _ = req("DELETE", f"/books/{book_id}", token=admin_token)
test("Admin deletes Book", status, 200)

status, _ = req("DELETE", f"/categories/{cat_id}", token=admin_token)
test("Admin deletes Category", status, 200)

print("[INFO] ==================================================")
print(f"[INFO] RESULTS: {passed} PASSED, {failed} FAILED")
print("[INFO] ==================================================")

if failed > 0:
    sys.exit(1)
else:
    print("[SUCCESS] ALL PHASE 10 ADMIN TESTS PASSED!")
    sys.exit(0)
