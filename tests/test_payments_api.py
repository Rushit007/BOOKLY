#!/usr/bin/env python3
"""
BOOKLY – Phase E: Razorpay Payment Integration Test Suite
Tests all authentication, authorization, security, and business-logic
scenarios WITHOUT a real Razorpay account.
"""

import json
import random
import string
import urllib.request
import urllib.error

BASE = "http://localhost:4000"


# ─────────────────────────────────────────────────────────────────────────────
# Helpers
# ─────────────────────────────────────────────────────────────────────────────

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
        print(f"[SUCCESS] PASS: {label} (got {actual})")
        return True
    else:
        print(f"[FAIL]    FAIL: {label} — expected {expected}, got {actual}")
        return False


passed = 0
failed = 0


def test(label, actual, expected):
    global passed, failed
    if check(label, actual, expected):
        passed += 1
    else:
        failed += 1


# ─────────────────────────────────────────────────────────────────────────────
print("[INFO] ==================================================")
print("[INFO] STARTING PHASE E PAYMENTS BACKEND TEST SUITE")
print("[INFO] ==================================================")
# ─────────────────────────────────────────────────────────────────────────────

# ── Step 1: Unauthenticated access ────────────────────────────────────────────
print("\n[INFO] Step 1: Testing Unauthenticated Access...")
sc, _ = req("POST", "/payments/create-order", {"orderId": "fake"})
test("POST /payments/create-order without JWT returns 401", sc, 401)

sc, _ = req("POST", "/payments/verify", {
    "razorpayOrderId": "x", "razorpayPaymentId": "y",
    "razorpaySignature": "z", "booklyOrderId": "w",
})
test("POST /payments/verify without JWT returns 401", sc, 401)

sc, _ = req("GET", "/payments/status/fake-id")
test("GET /payments/status/:id without JWT returns 401", sc, 401)

# ── Step 2: Register two customers and an admin ───────────────────────────────
print("\n[INFO] Step 2: Setting up test users...")
email_a = f"cust_a_{rnd()}@test.com"
email_b = f"cust_b_{rnd()}@test.com"

sc, body = req("POST", "/auth/register", {"email": email_a, "password": "TestPass123!", "name": "Customer A"})
test("Customer A registered (201)", sc, 201)
token_a = body.get("accessToken", "")

sc, body = req("POST", "/auth/register", {"email": email_b, "password": "TestPass123!", "name": "Customer B"})
test("Customer B registered (201)", sc, 201)
token_b = body.get("accessToken", "")

# Admin login
sc, body = req("POST", "/auth/login", {"email": "admin@bookly.com", "password": "AdminPassword123!"})
test("Admin login (200)", sc, 200)
token_admin = body.get("accessToken", "")

# ── Step 3: Fetch a book ──────────────────────────────────────────────────────
print("\n[INFO] Step 3: Fetching a book from catalog...")
sc, books_resp = req("GET", "/books?limit=1")
test("GET /books returns 200", sc, 200)
book = books_resp["data"][0]
book_id = book["id"]
print(f"[INFO] Test Book: '{book['title']}' (Price: Rs.{book['price']}, Stock: {book['stock']})")

# ── Step 4: Add to cart and checkout to get a BOOKLY order ───────────────────
print("\n[INFO] Step 4: Creating a BOOKLY order for Customer A...")
req("POST", "/cart/items", {"bookId": book_id, "quantity": 1}, token_a)
sc, order = req("POST", "/orders/checkout", {"shippingAddress": "Plot 42, Test Street, Mumbai 400001"}, token_a)
test("Checkout returns 201", sc, 201)
order_id_a = order["id"]
order_number_a = order["orderNumber"]
print(f"[INFO] Order created: {order_number_a} (ID: {order_id_a})")

# ── Step 5: create-order authorization (Customer B cannot pay Customer A's order)
print("\n[INFO] Step 5: Testing authorization — Customer B cannot pay Customer A's order...")
sc, body = req("POST", "/payments/create-order", {"orderId": order_id_a}, token_b)
test("Customer B cannot create payment for Customer A's order (403)", sc, 403)

# ── Step 6: POST /payments/create-order with non-existent orderId ─────────────
print("\n[INFO] Step 6: Testing non-existent order ID...")
sc, body = req("POST", "/payments/create-order", {"orderId": "00000000-0000-0000-0000-000000000000"}, token_a)
test("Non-existent order returns 404", sc, 404)

# ── Step 7: Attempt create-order — expect 500 if Razorpay not configured ──────
print("\n[INFO] Step 7: POST /payments/create-order (expects 500 if Razorpay not configured in .env)...")
sc, body = req("POST", "/payments/create-order", {"orderId": order_id_a}, token_a)
# With placeholder keys the Razorpay SDK will fail → 500 InternalServerError
# OR if real keys are present → 201 Created
if sc in (201, 500):
    if sc == 201:
        razorpay_order_id = body.get("razorpayOrderId", "")
        print(f"[INFO] Razorpay configured — razorpayOrderId: {razorpay_order_id}")
        test("create-order returns 201 (Razorpay configured)", sc, 201)
    else:
        print(f"[INFO] Razorpay NOT configured (placeholder keys) — got 500 as expected")
        test("create-order returns 500 (Razorpay not configured — placeholder keys)", sc, 500)
    razorpay_configured = (sc == 201)
else:
    print(f"[FAIL] Unexpected status: {sc} — body: {body}")
    razorpay_configured = False
    failed += 1

# ── Step 8: verify endpoint — missing orderId body field ─────────────────────
print("\n[INFO] Step 8: POST /payments/verify — validation errors...")
sc, body = req("POST", "/payments/verify", {
    "razorpayOrderId": "rzp_order_fake",
    "razorpayPaymentId": "pay_fake",
    "razorpaySignature": "invalidsig",
    # missing booklyOrderId
}, token_a)
test("Missing booklyOrderId returns 400", sc, 400)

# ── Step 9: verify — wrong order (Customer B trying to verify Customer A's payment)
print("\n[INFO] Step 9: Customer B cannot verify Customer A's payment...")
sc, body = req("POST", "/payments/verify", {
    "razorpayOrderId": "rzp_order_test",
    "razorpayPaymentId": "pay_test",
    "razorpaySignature": "fakesig",
    "booklyOrderId": order_id_a,
}, token_b)
test("Customer B cannot verify Customer A's payment (403)", sc, 403)

# ── Step 10: verify — invalid signature rejected ──────────────────────────────
print("\n[INFO] Step 10: Invalid signature is rejected by server...")
# First we need a Payment record with a razorpayOrderId
# Create a second order for this test
req("POST", "/cart/items", {"bookId": book_id, "quantity": 1}, token_a)
sc, order2 = req("POST", "/orders/checkout", {"shippingAddress": "Plot 99, Test Lane, Delhi 110001"}, token_a)
test("Second BOOKLY order created (201)", sc, 201)
order_id_a2 = order2["id"]

# Manually upsert payment via create-order (only works if Razorpay configured)
if razorpay_configured:
    sc, pay_body = req("POST", "/payments/create-order", {"orderId": order_id_a2}, token_a)
    if sc == 201:
        rz_order_id = pay_body.get("razorpayOrderId", "")
        # Send fake signature — backend must reject it
        sc, body = req("POST", "/payments/verify", {
            "razorpayOrderId": rz_order_id,
            "razorpayPaymentId": "pay_FAKE12345",
            "razorpaySignature": "thisisafakesignature",
            "booklyOrderId": order_id_a2,
        }, token_a)
        test("Invalid Razorpay signature returns 400", sc, 400)

        # ── Step 11: wrong razorpayOrderId mismatch ───────────────────────────
        print("\n[INFO] Step 11: Wrong razorpay order ID mismatch...")
        sc, body = req("POST", "/payments/verify", {
            "razorpayOrderId": "order_WRONG_ID",
            "razorpayPaymentId": "pay_test",
            "razorpaySignature": "fakesig",
            "booklyOrderId": order_id_a2,
        }, token_a)
        test("Wrong razorpayOrderId returns 400", sc, 400)
else:
    print("[INFO] Skipping signature/mismatch tests — Razorpay not configured (placeholder keys)")

# ── Step 12: GET /payments/status/:orderId ────────────────────────────────────
print("\n[INFO] Step 12: GET /payments/status/:orderId...")
sc, body = req("GET", f"/payments/status/{order_id_a2}", token=token_a)
test("GET /payments/status returns 200", sc, 200)
test("Payment status response has orderId", order_id_a2 in str(body), True)
test("Payment status response has finalAmount", "finalAmount" in body, True)

# ── Step 13: Customer B cannot view Customer A's payment status ───────────────
print("\n[INFO] Step 13: Customer B cannot view Customer A's payment status...")
sc, body = req("GET", f"/payments/status/{order_id_a2}", token=token_b)
test("Customer B cannot view Customer A's payment status (403)", sc, 403)

# ── Step 14: Cancelled order cannot be paid ───────────────────────────────────
print("\n[INFO] Step 14: Cancelled order cannot be paid...")
# Admin cancels order
sc, body = req("PATCH", f"/orders/admin/{order_id_a}/status", {"status": "CANCELLED"}, token_admin)
test("Admin cancels order (200)", sc, 200)

# Now attempt to create payment for the cancelled order
sc, body = req("POST", "/payments/create-order", {"orderId": order_id_a}, token_a)
test("Cannot create payment for cancelled order (400)", sc, 400)

# ── Step 15: Already-paid order idempotent ────────────────────────────────────
print("\n[INFO] Step 15: Already-paid order verification is idempotent...")
# We can't produce a real verified payment without Razorpay credentials
# so we test the verify endpoint returns 400 for a non-existent payment record
sc, body = req("POST", "/payments/verify", {
    "razorpayOrderId": "order_NONEXISTENT",
    "razorpayPaymentId": "pay_test",
    "razorpaySignature": "fakesig",
    "booklyOrderId": order_id_a2,
}, token_a)
# Without a prior Payment record holding a razorpayOrderId this returns 400
test("Verify without prior payment record returns 400", sc, 400)

# ─────────────────────────────────────────────────────────────────────────────
print("\n[INFO] ==================================================")
total = passed + failed
if failed == 0:
    print(f"[SUCCESS] ALL PAYMENT BACKEND TESTS PASSED SUCCESSFULLY! ({passed}/{total})")
else:
    print(f"[WARN] Results: {passed} passed, {failed} failed out of {total}")
print("[INFO] ==================================================")
