#!/usr/bin/env python3
"""Comprehensive test suite for Phase B - BOOKLY Cart Backend."""
import requests
import json
import sys

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
    log("STARTING PHASE B CART BACKEND TEST SUITE")
    log("==================================================")

    # 1. Test Unauthenticated Access
    log("Step 1: Testing Unauthenticated Access...")
    res = requests.get(f"{BASE_URL}/cart")
    assert_eq(res.status_code, 401, "GET /cart without token returns 401")

    res = requests.post(f"{BASE_URL}/cart/items", json={"bookId": "some-id", "quantity": 1})
    assert_eq(res.status_code, 401, "POST /cart/items without token returns 401")

    res = requests.patch(f"{BASE_URL}/cart/items/some-id", json={"quantity": 2})
    assert_eq(res.status_code, 401, "PATCH /cart/items/:id without token returns 401")

    res = requests.delete(f"{BASE_URL}/cart/items/some-id")
    assert_eq(res.status_code, 401, "DELETE /cart/items/:id without token returns 401")

    res = requests.delete(f"{BASE_URL}/cart")
    assert_eq(res.status_code, 401, "DELETE /cart without token returns 401")

    # 2. Register/Login test customer
    log("\nStep 2: Authenticating Test Customer...")
    email = f"cart_test_{int(__import__('time').time())}@example.com"
    pwd = "TestPassword123!"
    reg_res = requests.post(f"{BASE_URL}/auth/register", json={
        "name": "Cart Test User",
        "email": email,
        "password": pwd
    })
    assert_eq(reg_res.status_code, 201, "Customer registered successfully")
    token = reg_res.json().get("accessToken")
    assert token is not None, "Access token received"

    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }

    # 3. Test initial empty cart
    log("\nStep 3: Testing Initial Empty Cart...")
    cart_res = requests.get(f"{BASE_URL}/cart", headers=headers)
    assert_eq(cart_res.status_code, 200, "GET /cart returns 200")
    cart_data = cart_res.json()
    assert_eq(len(cart_data["items"]), 0, "Cart is initially empty")
    assert_eq(cart_data["itemCount"], 0, "Initial itemCount is 0")
    assert_eq(cart_data["subtotal"], 0, "Initial subtotal is 0")
    assert_eq(cart_data["totalAmount"], 0, "Initial totalAmount is 0")

    # 4. Fetch real books to use in tests
    log("\nStep 4: Fetching Books from Catalog...")
    books_res = requests.get(f"{BASE_URL}/books?limit=5")
    assert_eq(books_res.status_code, 200, "GET /books returns 200")
    books = books_res.json().get("data", [])
    if not books:
        log("No books found in database, creating a test category and book...", "WARN")
        # Login admin to create category and book if needed
        # (Assuming books already exist from Phase 6)
        raise RuntimeError("No books found in database to test cart")

    book1 = books[0]
    book2 = books[1] if len(books) > 1 else books[0]
    log(f"Test Book 1: '{book1['title']}' (Price: Rs.{book1['price']}, Discount: {book1['discount']}%, Stock: {book1['stock']})")
    log(f"Test Book 2: '{book2['title']}' (Price: Rs.{book2['price']}, Discount: {book2['discount']}%, Stock: {book2['stock']})")

    # 5. Test invalid book ID
    log("\nStep 5: Testing Add With Invalid Book ID...")
    inv_res = requests.post(f"{BASE_URL}/cart/items", headers=headers, json={
        "bookId": "00000000-0000-0000-0000-000000000000",
        "quantity": 1
    })
    assert_eq(inv_res.status_code, 404, "Invalid book ID returns 404 Not Found")

    # 6. Test adding book 1 to cart
    log("\nStep 6: Adding Book 1 to Cart (Qty: 2)...")
    add_res = requests.post(f"{BASE_URL}/cart/items", headers=headers, json={
        "bookId": book1["id"],
        "quantity": 2
    })
    assert_eq(add_res.status_code, 200, "POST /cart/items returns 200")
    cart = add_res.json()
    assert_eq(len(cart["items"]), 1, "Cart has 1 item")
    assert_eq(cart["items"][0]["quantity"], 2, "Cart item quantity is 2")
    assert_eq(cart["itemCount"], 2, "Cart total itemCount is 2")
    
    expected_unit = round(book1["price"] * (1 - book1["discount"] / 100)) if book1["discount"] > 0 else book1["price"]
    expected_subtotal = book1["price"] * 2
    expected_total = expected_unit * 2
    assert_eq(cart["subtotal"], expected_subtotal, f"Subtotal is {expected_subtotal}")
    assert_eq(cart["totalAmount"], expected_total, f"TotalAmount is {expected_total}")

    # 7. Test adding more of the same book
    log("\nStep 7: Incrementing Book 1 Quantity (Add Qty: 1)...")
    add2_res = requests.post(f"{BASE_URL}/cart/items", headers=headers, json={
        "bookId": book1["id"],
        "quantity": 1
    })
    assert_eq(add2_res.status_code, 200, "Adding existing book succeeds")
    cart = add2_res.json()
    assert_eq(len(cart["items"]), 1, "Still 1 unique item in cart")
    assert_eq(cart["items"][0]["quantity"], 3, "Cart item quantity updated to 3")
    assert_eq(cart["itemCount"], 3, "Total itemCount is 3")

    # 8. Test Stock Validation (Exceeding Stock)
    log("\nStep 8: Testing Stock Validation...")
    stock_res = requests.post(f"{BASE_URL}/cart/items", headers=headers, json={
        "bookId": book1["id"],
        "quantity": book1["stock"] + 100
    })
    assert_eq(stock_res.status_code, 400, "Exceeding stock returns 400 Bad Request")

    # 9. Test adding Book 2
    if book2["id"] != book1["id"]:
        log("\nStep 9: Adding Book 2 to Cart...")
        add3_res = requests.post(f"{BASE_URL}/cart/items", headers=headers, json={
            "bookId": book2["id"],
            "quantity": 1
        })
        assert_eq(add3_res.status_code, 200, "Added second book to cart")
        cart = add3_res.json()
        assert_eq(len(cart["items"]), 2, "Cart now has 2 distinct items")
        assert_eq(cart["itemCount"], 4, "Total itemCount is 4 (3 + 1)")

    # 10. Test Update Quantity (PATCH)
    log("\nStep 10: Updating Item Quantity via PATCH...")
    patch_res = requests.patch(f"{BASE_URL}/cart/items/{book1['id']}", headers=headers, json={
        "quantity": 5
    })
    assert_eq(patch_res.status_code, 200, "PATCH /cart/items/:id returns 200")
    cart = patch_res.json()
    item1 = next(it for it in cart["items"] if it["bookId"] == book1["id"])
    assert_eq(item1["quantity"], 5, "Item quantity updated to 5")

    # 11. Test PATCH with stock limit
    log("\nStep 11: Testing PATCH Quantity Exceeding Stock...")
    patch_stock_res = requests.patch(f"{BASE_URL}/cart/items/{book1['id']}", headers=headers, json={
        "quantity": book1["stock"] + 500
    })
    assert_eq(patch_stock_res.status_code, 400, "PATCH exceeding stock returns 400")

    # 12. Test Remove Item (DELETE /cart/items/:bookId)
    log("\nStep 12: Removing Single Item...")
    del_item_res = requests.delete(f"{BASE_URL}/cart/items/{book1['id']}", headers=headers)
    assert_eq(del_item_res.status_code, 200, "DELETE item returns 200")
    cart = del_item_res.json()
    assert not any(it["bookId"] == book1["id"] for it in cart["items"]), "Book 1 removed from cart"

    # 13. Test Clear Cart (DELETE /cart)
    log("\nStep 13: Clearing Entire Cart...")
    clear_res = requests.delete(f"{BASE_URL}/cart", headers=headers)
    assert_eq(clear_res.status_code, 200, "DELETE /cart returns 200")
    cart = clear_res.json()
    assert_eq(len(cart["items"]), 0, "Cart items is empty")
    assert_eq(cart["itemCount"], 0, "itemCount is 0")
    assert_eq(cart["totalAmount"], 0, "totalAmount is 0")

    log("\n==================================================")
    log("ALL CART BACKEND TESTS PASSED SUCCESSFULLY! (13/13)", "SUCCESS")
    log("==================================================")

if __name__ == "__main__":
    try:
        run_tests()
    except Exception as e:
        log(f"Test suite failed: {e}", "ERROR")
        sys.exit(1)
