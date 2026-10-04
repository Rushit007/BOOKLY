#!/usr/bin/env python3
"""Comprehensive test suite for BOOKLY Priority Features verification."""
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
    log("STARTING COMPREHENSIVE PRIORITY FEATURES VERIFICATION")
    log("==================================================")

    # 1. User Registration
    log("\n--- Feature 1: User Registration ---")
    ts = int(time.time())
    email = f"priority_user_{ts}@example.com"
    pwd = "SecurePassword123!"
    reg_res = requests.post(f"{BASE_URL}/auth/register", json={
        "name": "Priority Tester",
        "email": email,
        "password": pwd,
        "phone": "+919876500000"
    })
    assert_eq(reg_res.status_code, 201, "User registration returns 201 Created")
    user_data = reg_res.json()
    assert "accessToken" in user_data, "Token present in registration response"
    token = user_data["accessToken"]
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

    # 2. User Login
    log("\n--- Feature 2: User Login & JWT Auth ---")
    login_res = requests.post(f"{BASE_URL}/auth/login", json={
        "email": email,
        "password": pwd
    })
    assert_eq(login_res.status_code, 200, "User login returns 200 OK")
    assert "accessToken" in login_res.json(), "Token present in login response"

    # 3. User Profile
    log("\n--- Feature 3: User Profile (GET /auth/profile) ---")
    profile_res = requests.get(f"{BASE_URL}/auth/profile", headers=headers)
    assert_eq(profile_res.status_code, 200, "GET /auth/profile returns 200 OK")
    profile = profile_res.json()
    assert_eq(profile["email"], email, "Profile email matches registered user")
    assert_eq(profile["name"], "Priority Tester", "Profile name matches registered user")
    assert "password" not in profile, "Security check: password field is sanitized from profile"

    # 4. Book Catalog
    log("\n--- Feature 4: Book Catalog (GET /books) ---")
    catalog_res = requests.get(f"{BASE_URL}/books")
    assert_eq(catalog_res.status_code, 200, "GET /books returns 200 OK")
    catalog = catalog_res.json()
    assert "data" in catalog and "meta" in catalog, "Catalog includes paginated data and meta"
    assert len(catalog["data"]) > 0, "Catalog has books populated"
    first_book = catalog["data"][0]
    book_id = first_book["id"]
    book_title = first_book["title"]
    category_id = first_book["categoryId"]
    log(f"Catalog contains {catalog['meta']['totalItems']} books. Testing with '{book_title}' (ID: {book_id})")

    # 5. Book Search
    log("\n--- Feature 5: Book Search (GET /books?search=...) ---")
    search_keyword = book_title.split()[0]
    search_res = requests.get(f"{BASE_URL}/books?search={search_keyword}")
    assert_eq(search_res.status_code, 200, "GET /books?search= returns 200 OK")
    search_data = search_res.json()["data"]
    assert any(b["id"] == book_id for b in search_data), f"Search for '{search_keyword}' found expected book"

    # 6. Category Filtering
    log("\n--- Feature 6: Category Filtering (GET /books?category=...) ---")
    cat_res = requests.get(f"{BASE_URL}/books?category={category_id}")
    assert_eq(cat_res.status_code, 200, "GET /books?category= returns 200 OK")
    cat_books = cat_res.json()["data"]
    assert all(b["categoryId"] == category_id for b in cat_books), "All returned books belong to filtered category"

    # 7. Book Details
    log("\n--- Feature 7: Book Details (GET /books/:id) ---")
    detail_res = requests.get(f"{BASE_URL}/books/{book_id}")
    assert_eq(detail_res.status_code, 200, "GET /books/:id returns 200 OK")
    detail = detail_res.json()
    assert_eq(detail["id"], book_id, "Book details ID matches")
    assert "category" in detail, "Category relation included in details"

    # 8. Customer Order & Cancellation with Stock Restoration
    log("\n--- Feature 8: Customer Order & Cancellation with Stock Restoration ---")
    initial_stock = detail["stock"]
    log(f"Current stock of '{book_title}': {initial_stock}")

    # Add 1 unit to cart
    add_cart = requests.post(f"{BASE_URL}/cart/items", headers=headers, json={
        "bookId": book_id,
        "quantity": 1
    })
    assert_eq(add_cart.status_code, 200, "Item added to cart")

    # Checkout
    checkout_res = requests.post(f"{BASE_URL}/orders/checkout", headers=headers, json={
        "shippingAddress": "77 Innovation Way, Tech Park, Bangalore"
    })
    assert_eq(checkout_res.status_code, 201, "Order checkout successful (201 Created)")
    order = checkout_res.json()
    order_id = order["id"]
    assert_eq(order["orderStatus"], "PENDING", "New order status is PENDING")

    # Verify stock decremented
    stock_after_chk = requests.get(f"{BASE_URL}/books/{book_id}").json()["stock"]
    assert_eq(stock_after_chk, initial_stock - 1, f"Stock decremented by 1 (from {initial_stock} to {initial_stock - 1})")

    # Customer cancels their order via PATCH /orders/:id/cancel
    log("\nCustomer cancels pending order...")
    cancel_res = requests.patch(f"{BASE_URL}/orders/{order_id}/cancel", headers=headers)
    assert_eq(cancel_res.status_code, 200, "PATCH /orders/:id/cancel returns 200 OK")
    cancelled_order = cancel_res.json()
    assert_eq(cancelled_order["orderStatus"], "CANCELLED", "Order status updated to CANCELLED")

    # Verify stock restored
    stock_after_cancel = requests.get(f"{BASE_URL}/books/{book_id}").json()["stock"]
    assert_eq(stock_after_cancel, initial_stock, f"Stock fully restored back to original {initial_stock}")

    # Verify cannot cancel already cancelled order
    re_cancel = requests.patch(f"{BASE_URL}/orders/{order_id}/cancel", headers=headers)
    assert_eq(re_cancel.status_code, 400, "Cannot cancel already cancelled order (400 Bad Request)")

    # 9. Admin RBAC Protection
    log("\n--- Feature 9: RBAC Security & Non-Admin Protection ---")
    admin_orders_forbidden = requests.get(f"{BASE_URL}/orders/admin/all", headers=headers)
    assert_eq(admin_orders_forbidden.status_code, 403, "Customer access to /orders/admin/all returns 403 Forbidden")

    log("\n==================================================")
    log("ALL PRIORITY FEATURES VERIFIED AND WORKING 100%!", "SUCCESS")
    log("==================================================")

if __name__ == "__main__":
    try:
        run_tests()
    except Exception as e:
        log(f"Test suite failed: {e}", "ERROR")
        sys.exit(1)
