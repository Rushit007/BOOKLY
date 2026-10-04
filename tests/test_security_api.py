import requests
import uuid
import sys

BASE_URL = "http://localhost:4000"

def test_security_hardening():
    print("=" * 60)
    print("RUNNING SECURITY HARDENING & AUTHORIZATION TEST SUITE")
    print("=" * 60)

    # 1. Verify Helmet Security Headers & Throttler Headers
    print("\n--- Testing Helmet & Throttler HTTP Headers ---")
    resp = requests.get(f"{BASE_URL}/")
    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
    headers = resp.headers
    
    assert "X-Content-Type-Options" in headers, "Missing X-Content-Type-Options header"
    assert headers["X-Content-Type-Options"] == "nosniff"
    assert "X-Frame-Options" in headers, "Missing X-Frame-Options header"
    assert "Content-Security-Policy" in headers, "Missing Content-Security-Policy header"
    assert "Strict-Transport-Security" in headers, "Missing Strict-Transport-Security header"
    assert "X-RateLimit-Limit" in headers, "Missing X-RateLimit-Limit header"
    assert "X-RateLimit-Remaining" in headers, "Missing X-RateLimit-Remaining header"
    print(" [OK] Helmet security headers & Throttler headers verified successfully!")

    # 2. Register two separate users: User A and User B
    print("\n--- Setting up two isolated users for cross-tenant checks ---")
    uid_a = str(uuid.uuid4())[:8]
    user_a_email = f"usera_{uid_a}@example.com"
    resp_a = requests.post(f"{BASE_URL}/auth/register", json={
        "email": user_a_email,
        "password": "Password123!",
        "name": f"User A {uid_a}",
        "phone": "9876543210"
    })
    assert resp_a.status_code in (200, 201), "User A registration failed"
    token_a = resp_a.json()["accessToken"]
    headers_a = {"Authorization": f"Bearer {token_a}"}

    uid_b = str(uuid.uuid4())[:8]
    user_b_email = f"userb_{uid_b}@example.com"
    resp_b = requests.post(f"{BASE_URL}/auth/register", json={
        "email": user_b_email,
        "password": "Password123!",
        "name": f"User B {uid_b}",
        "phone": "9876543211"
    })
    assert resp_b.status_code in (200, 201), "User B registration failed"
    token_b = resp_b.json()["accessToken"]
    headers_b = {"Authorization": f"Bearer {token_b}"}
    print(" [OK] User A and User B registered.")

    # 3. Verify Password Sanitization (Never leaked in response or profile)
    print("\n--- Verifying Credential Sanitization ---")
    assert "password" not in resp_a.json()["user"], "Password hash leaked in register response"
    
    login_resp = requests.post(f"{BASE_URL}/auth/login", json={
        "email": user_a_email,
        "password": "Password123!"
    })
    assert "password" not in login_resp.json()["user"], "Password hash leaked in login response"

    profile_resp = requests.get(f"{BASE_URL}/auth/profile", headers=headers_a)
    assert "password" not in profile_resp.json(), "Password hash leaked in profile response"
    print(" [OK] Password field is strictly excluded from all auth endpoints.")

    # 4. Create an order for User A
    print("\n--- Creating Order for User A ---")
    books_resp = requests.get(f"{BASE_URL}/books")
    books = books_resp.json().get("data", [])
    assert len(books) > 0, "No books available to test orders"
    test_book = books[0]

    # Add to User A cart and checkout
    requests.post(f"{BASE_URL}/cart/items", json={"bookId": test_book["id"], "quantity": 1}, headers=headers_a)
    checkout_resp = requests.post(f"{BASE_URL}/orders/checkout", json={
        "shippingAddress": "123 Alpha Street, Mumbai, 400001"
    }, headers=headers_a)
    assert checkout_resp.status_code in (200, 201), f"Checkout failed: {checkout_resp.text}"
    order_a_id = checkout_resp.json()["id"]
    print(f" [OK] Order created for User A: {order_a_id}")

    # 5. User Isolation Security Test: User B attempts to access User A's data
    print("\n--- Testing Data Isolation (User B accessing User A's Order) ---")
    # Attempt 1: GET /orders/:id
    view_attempt = requests.get(f"{BASE_URL}/orders/{order_a_id}", headers=headers_b)
    assert view_attempt.status_code == 403, f"Expected 403 Forbidden for cross-tenant order view, got {view_attempt.status_code}"
    print(" [OK] Cross-user order view strictly forbidden (403).")

    # Attempt 2: PATCH /orders/:id/cancel
    cancel_attempt = requests.patch(f"{BASE_URL}/orders/{order_a_id}/cancel", headers=headers_b)
    assert cancel_attempt.status_code == 403, f"Expected 403 Forbidden for cross-tenant cancel, got {cancel_attempt.status_code}"
    print(" [OK] Cross-user order cancellation strictly forbidden (403).")

    # Attempt 3: POST /payments/create-order for User A's order
    pay_create_attempt = requests.post(f"{BASE_URL}/payments/create-order", json={"orderId": order_a_id}, headers=headers_b)
    assert pay_create_attempt.status_code == 403, f"Expected 403 Forbidden for cross-tenant payment create, got {pay_create_attempt.status_code}"
    print(" [OK] Cross-user payment creation strictly forbidden (403).")

    # Attempt 4: POST /payments/verify for User A's order
    pay_verify_attempt = requests.post(f"{BASE_URL}/payments/verify", json={
        "booklyOrderId": order_a_id,
        "razorpayOrderId": "order_fake123",
        "razorpayPaymentId": "pay_fake123",
        "razorpaySignature": "fake_signature"
    }, headers=headers_b)
    assert pay_verify_attempt.status_code == 403, f"Expected 403 Forbidden for cross-tenant payment verify, got {pay_verify_attempt.status_code}"
    print(" [OK] Cross-user payment verification strictly forbidden (403).")

    # Attempt 5: GET /payments/status/:orderId
    pay_status_attempt = requests.get(f"{BASE_URL}/payments/status/{order_a_id}", headers=headers_b)
    assert pay_status_attempt.status_code == 403, f"Expected 403 Forbidden for cross-tenant payment status, got {pay_status_attempt.status_code}"
    print(" [OK] Cross-user payment status access strictly forbidden (403).")

    # 6. RBAC Admin Protection: Regular User attempting Admin Routes
    print("\n--- Testing RBAC & Admin Endpoint Protection ---")
    admin_stats_attempt = requests.get(f"{BASE_URL}/admin/stats", headers=headers_a)
    assert admin_stats_attempt.status_code == 403, f"Customer accessing admin stats should be 403, got {admin_stats_attempt.status_code}"
    
    admin_users_attempt = requests.get(f"{BASE_URL}/admin/users", headers=headers_a)
    assert admin_users_attempt.status_code == 403, f"Customer accessing admin users should be 403, got {admin_users_attempt.status_code}"

    admin_orders_attempt = requests.get(f"{BASE_URL}/orders/admin/all", headers=headers_a)
    assert admin_orders_attempt.status_code == 403, f"Customer accessing admin orders should be 403, got {admin_orders_attempt.status_code}"

    book_create_attempt = requests.post(f"{BASE_URL}/books", json={"title": "Hacker Book"}, headers=headers_a)
    assert book_create_attempt.status_code == 403, f"Customer creating book should be 403, got {book_create_attempt.status_code}"

    cat_create_attempt = requests.post(f"{BASE_URL}/categories", json={"name": "Hacker Cat", "slug": "hacker-cat"}, headers=headers_a)
    assert cat_create_attempt.status_code == 403, f"Customer creating category should be 403, got {cat_create_attempt.status_code}"
    print(" [OK] All administrative mutation and data endpoints are strictly protected (403).")

    # 7. Verified Admin access
    admin_login_resp = requests.post(f"{BASE_URL}/auth/login", json={
        "email": "admin@bookly.com",
        "password": "AdminPassword123!"
    })
    if admin_login_resp.status_code == 200:
        admin_token = admin_login_resp.json()["accessToken"]
        admin_headers = {"Authorization": f"Bearer {admin_token}"}
        
        adm_stats = requests.get(f"{BASE_URL}/admin/stats", headers=admin_headers)
        assert adm_stats.status_code == 200, f"Admin should access stats, got {adm_stats.status_code}"
        
        adm_orders = requests.get(f"{BASE_URL}/orders/admin/all", headers=admin_headers)
        assert adm_orders.status_code == 200, f"Admin should access all orders, got {adm_orders.status_code}"
        print(" [OK] Verified Admin user has legitimate authorized access to administrative portals.")

    print("\n" + "=" * 60)
    print("ALL SECURITY HARDENING & AUTHORIZATION ASSERTIONS PASSED (100%)")
    print("=" * 60)

if __name__ == "__main__":
    test_security_hardening()
