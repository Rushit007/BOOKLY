#!/usr/bin/env python3
"""Comprehensive test suite for Phase D - BOOKLY Orders & Checkout Backend."""
import requests
import json
import sys
import time

BASE_URL = 'http://localhost:4000'

def log(msg, status='INFO'):
    print(f"[{status}] {msg}")

def assert_eq(actual, expected, desc):
    if actual == expected:
        log(f"PASS: {desc} (got {actual})", "SUCCESS")
    else:
        log(f"FAIL: {desc} (expected {expected}, got {actual})", "ERROR")
        raise AssertionError(f"{desc}: expected {expected}, got {actual}")

def run_tests():
    log("==================================================")
    log("STARTING PHASE D ORDERS & CHECKOUT TEST SUITE")
    log("==================================================")

    # 1. Unauthenticated checks
    log("Step 1: Testing Unauthenticated Access...")
    res1 = requests.get(f"{BASE_URL}/orders")
    assert_eq(res1.status_code, 401, "GET /orders without token returns 401")

    res2 = requests.post(f"{BASE_URL}/orders/checkout", json={"shippingAddress": "123 Test St"})
    assert_eq(res2.status_code, 401, "POST /orders/checkout without token returns 401")

    # 2. Customer A Setup
    log("\nStep 2: Registering Customer A...")
    email_a = f"customer_a_{int(time.time())}@example.com"
    pwd = "Password123!"
    reg_a = requests.post(f"{BASE_URL}/auth/register", json={
        "name": "Customer Alice",
        "email": email_a,
        "password": pwd,
        "phone": "+919876543210"
    })
    assert_eq(reg_a.status_code, 201, "Customer A registered")
    token_a = reg_a.json()["accessToken"]
    headers_a = {"Authorization": f"Bearer {token_a}", "Content-Type": "application/json"}

    # 3. Empty cart checkout
    log("\nStep 3: Testing Empty Cart Checkout...")
    chk_empty = requests.post(f"{BASE_URL}/orders/checkout", headers=headers_a, json={
        "shippingAddress": "456 Main Street, Apartment 4B, Mumbai"
    })
    assert_eq(chk_empty.status_code, 400, "Empty cart checkout returns 400 Bad Request")

    # 4. Fetch books to add to cart
    log("\nStep 4: Fetching Books from Catalog...")
    books_res = requests.get(f"{BASE_URL}/books?limit=2")
    books = books_res.json().get("data", [])
    if not books:
        raise RuntimeError("No books available for orders test")
    
    book1 = books[0]
    book1_id = book1["id"]
    book1_initial_stock = book1["stock"]
    log(f"Test Book 1: '{book1['title']}' | Initial Stock: {book1_initial_stock} | Price: Rs.{book1['price']} | Discount: {book1['discount']}%")

    # 5. Add 2 units of Book 1 to Customer A Cart
    log("\nStep 5: Adding Items to Customer A Cart...")
    requests.post(f"{BASE_URL}/cart/items", headers=headers_a, json={"bookId": book1_id, "quantity": 2})
    cart_check = requests.get(f"{BASE_URL}/cart", headers=headers_a).json()
    assert_eq(cart_check["itemCount"], 2, "Cart has 2 units of Book 1")

    # 6. Perform Checkout
    log("\nStep 6: Executing Successful Checkout...")
    shipping_addr = "Plot 42, Silicon Valley Road, Bengaluru, 560100"
    chk_res = requests.post(f"{BASE_URL}/orders/checkout", headers=headers_a, json={
        "shippingAddress": shipping_addr
    })
    assert_eq(chk_res.status_code, 201, "POST /orders/checkout returns 201 Created")
    order = chk_res.json()

    # Validate Order Data
    order_id = order["id"]
    order_number = order["orderNumber"]
    assert order_number.startswith("BKLY-"), f"Order number starts with BKLY- ({order_number})"
    assert_eq(order["orderStatus"], "PENDING", "Initial order status is PENDING")
    assert_eq(order["paymentStatus"], "PENDING", "Initial payment status is PENDING")
    assert_eq(order["shippingAddress"], shipping_addr, "Shipping address preserved")
    assert_eq(len(order["items"]), 1, "Order has 1 OrderItem")
    
    # Pricing checks
    expected_unit = round(book1["price"] * (1 - book1["discount"] / 100)) if book1["discount"] > 0 else book1["price"]
    expected_total = book1["price"] * 2
    expected_final = expected_unit * 2
    expected_discount = expected_total - expected_final
    assert_eq(order["totalAmount"], expected_total, f"Order totalAmount is {expected_total}")
    assert_eq(order["finalAmount"], expected_final, f"Order finalAmount is {expected_final}")
    assert_eq(order["discountAmount"], expected_discount, f"Order discountAmount is {expected_discount}")
    assert_eq(order["items"][0]["price"], expected_unit, f"OrderItem unit price is {expected_unit}")
    assert_eq(order["items"][0]["quantity"], 2, "OrderItem quantity is 2")

    # 7. Verify Cart is Empty after checkout
    log("\nStep 7: Verifying Cart is Cleared...")
    cart_after = requests.get(f"{BASE_URL}/cart", headers=headers_a).json()
    assert_eq(cart_after["itemCount"], 0, "Cart is now empty after checkout")

    # 8. Verify Book Stock Decremented
    log("\nStep 8: Verifying Book Stock Decremented...")
    book_after = requests.get(f"{BASE_URL}/books/{book1_id}").json()
    assert_eq(book_after["stock"], book1_initial_stock - 2, f"Stock decremented by 2 (from {book1_initial_stock} to {book1_initial_stock - 2})")

    # 9. Customer A Order History
    log("\nStep 9: Verifying Customer A Order History (GET /orders)...")
    history_res = requests.get(f"{BASE_URL}/orders", headers=headers_a)
    assert_eq(history_res.status_code, 200, "GET /orders returns 200")
    orders_list = history_res.json()
    assert_eq(len(orders_list), 1, "Customer has 1 order in history")
    assert_eq(orders_list[0]["id"], order_id, "Order ID matches in history")

    # 10. Customer A Single Order View
    log("\nStep 10: Viewing Single Order Details (GET /orders/:id)...")
    single_res = requests.get(f"{BASE_URL}/orders/{order_id}", headers=headers_a)
    assert_eq(single_res.status_code, 200, "GET /orders/:id returns 200")
    assert_eq(single_res.json()["orderNumber"], order_number, "Order details match")

    # 11. Security Isolation: Customer B cannot access Customer A's Order
    log("\nStep 11: Testing Customer B Access Isolation...")
    email_b = f"customer_b_{int(time.time())}@example.com"
    reg_b = requests.post(f"{BASE_URL}/auth/register", json={
        "name": "Customer Bob",
        "email": email_b,
        "password": pwd
    })
    token_b = reg_b.json()["accessToken"]
    headers_b = {"Authorization": f"Bearer {token_b}", "Content-Type": "application/json"}

    b_access = requests.get(f"{BASE_URL}/orders/{order_id}", headers=headers_b)
    assert_eq(b_access.status_code, 403, "Customer B is forbidden from accessing Customer A's order (403 Forbidden)")

    # 12. Security: Non-Admin cannot access Admin Endpoints
    log("\nStep 12: Testing Admin Endpoint Protection...")
    adm_all_fail = requests.get(f"{BASE_URL}/orders/admin/all", headers=headers_a)
    assert_eq(adm_all_fail.status_code, 403, "Non-admin cannot GET /orders/admin/all (403)")

    adm_status_fail = requests.patch(f"{BASE_URL}/orders/admin/{order_id}/status", headers=headers_a, json={
        "status": "DELIVERED"
    })
    assert_eq(adm_status_fail.status_code, 403, "Non-admin cannot PATCH /orders/admin/:id/status (403)")

    # 13. Admin Operations
    log("\nStep 13: Testing Admin Order Operations...")
    admin_login = requests.post(f"{BASE_URL}/auth/login", json={
        "email": "admin@bookly.com",
        "password": "AdminPassword123!"
    })
    assert_eq(admin_login.status_code, 200, "Admin login successful (200)")
    admin_jwt = admin_login.json()["accessToken"]
    headers_admin = {"Authorization": f"Bearer {admin_jwt}", "Content-Type": "application/json"}

    # Admin GET all orders
    adm_all_res = requests.get(f"{BASE_URL}/orders/admin/all", headers=headers_admin)
    assert_eq(adm_all_res.status_code, 200, "Admin can GET /orders/admin/all (200)")
    assert adm_all_res.json()["meta"]["totalItems"] >= 1, "Admin sees system orders"

    # Admin Update Order Status: PENDING -> SHIPPED
    status_ship = requests.patch(f"{BASE_URL}/orders/admin/{order_id}/status", headers=headers_admin, json={
        "status": "SHIPPED"
    })
    assert_eq(status_ship.status_code, 200, "Admin updates status to SHIPPED (200)")
    assert_eq(status_ship.json()["orderStatus"], "SHIPPED", "Status updated to SHIPPED")

    # Admin Update Order Status: SHIPPED -> CANCELLED (Restores Stock!)
    log("\nStep 14: Testing Order Cancellation Stock Restoration...")
    status_cancel = requests.patch(f"{BASE_URL}/orders/admin/{order_id}/status", headers=headers_admin, json={
        "status": "CANCELLED"
    })
    assert_eq(status_cancel.status_code, 200, "Admin cancels order (200)")
    assert_eq(status_cancel.json()["orderStatus"], "CANCELLED", "Status updated to CANCELLED")

    # Check stock restored!
    book_restored = requests.get(f"{BASE_URL}/books/{book1_id}").json()
    assert_eq(book_restored["stock"], book1_initial_stock, f"Stock fully restored back to {book1_initial_stock}")

    log("\n==================================================")
    log("ALL ORDERS & CHECKOUT TESTS PASSED SUCCESSFULLY! (14/14)", "SUCCESS")
    log("==================================================")

if __name__ == "__main__":
    try:
        run_tests()
    except Exception as e:
        log(f"Test suite failed: {e}", "ERROR")
        sys.exit(1)
