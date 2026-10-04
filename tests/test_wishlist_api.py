#!/usr/bin/env python3
"""Comprehensive test suite for Phase C - BOOKLY Wishlist Backend."""
import requests
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
    log("STARTING PHASE C WISHLIST BACKEND TEST SUITE")
    log("==================================================")

    # 1-4. Unauthenticated Access
    log("Step 1: Testing Unauthenticated Access...")
    res1 = requests.get(f"{BASE_URL}/wishlist")
    assert_eq(res1.status_code, 401, "GET /wishlist without token returns 401")

    res2 = requests.post(f"{BASE_URL}/wishlist/some-id/toggle")
    assert_eq(res2.status_code, 401, "POST /wishlist/:id/toggle without token returns 401")

    res3 = requests.delete(f"{BASE_URL}/wishlist/some-id")
    assert_eq(res3.status_code, 401, "DELETE /wishlist/:id without token returns 401")

    res4 = requests.delete(f"{BASE_URL}/wishlist")
    assert_eq(res4.status_code, 401, "DELETE /wishlist without token returns 401")

    # 5. Authenticate Customer A
    log("\nStep 2: Authenticating Customer A...")
    email_a = f"wishlist_a_{int(time.time())}@example.com"
    reg_a = requests.post(f"{BASE_URL}/auth/register", json={
        "name": "Wishlist User A",
        "email": email_a,
        "password": "Password123!"
    })
    assert_eq(reg_a.status_code, 201, "Customer A registered")
    token_a = reg_a.json()["accessToken"]
    headers_a = {"Authorization": f"Bearer {token_a}", "Content-Type": "application/json"}

    # 5. Retrieve empty wishlist
    log("\nStep 3: Customer A Empty Wishlist...")
    wish_res = requests.get(f"{BASE_URL}/wishlist", headers=headers_a)
    assert_eq(wish_res.status_code, 200, "GET /wishlist returns 200")
    wish_data = wish_res.json()
    assert_eq(len(wish_data["items"]), 0, "Wishlist is initially empty")
    assert_eq(wish_data["itemCount"], 0, "itemCount is 0")

    # 6. Fetch books
    log("\nStep 4: Fetching Books from Catalog...")
    books_res = requests.get(f"{BASE_URL}/books?limit=5")
    books = books_res.json().get("data", [])
    if len(books) < 2:
        raise RuntimeError("Need at least 2 books to test wishlist")

    book1 = books[0]
    book2 = books[1]
    log(f"Test Book 1: '{book1['title']}' ({book1['id']})")
    log(f"Test Book 2: '{book2['title']}' ({book2['id']})")

    # 7. Invalid book ID
    log("\nStep 5: Testing Invalid Book ID...")
    inv_res = requests.post(f"{BASE_URL}/wishlist/00000000-0000-0000-0000-000000000000/toggle", headers=headers_a)
    assert_eq(inv_res.status_code, 404, "Toggle with non-existent book returns 404 Not Found")

    # 8. Add valid book 1 via toggle
    log("\nStep 6: Adding Book 1 to Wishlist via Toggle...")
    tog1_res = requests.post(f"{BASE_URL}/wishlist/{book1['id']}/toggle", headers=headers_a)
    assert_eq(tog1_res.status_code, 200, "POST /wishlist/:id/toggle returns 200")
    tog1_data = tog1_res.json()
    assert_eq(tog1_data["inWishlist"], True, "inWishlist is true after adding")
    assert_eq(len(tog1_data["wishlist"]["items"]), 1, "Wishlist has 1 item")
    assert_eq(tog1_data["wishlist"]["items"][0]["bookId"], book1["id"], "Wishlist item has correct bookId")
    assert_eq(tog1_data["wishlist"]["items"][0]["book"]["title"], book1["title"], "Wishlist item has populated book title")

    # 9. Verify GET /wishlist returns the item
    log("\nStep 7: Verifying Wishlist via GET...")
    get_res = requests.get(f"{BASE_URL}/wishlist", headers=headers_a)
    assert_eq(get_res.status_code, 200, "GET /wishlist returns 200")
    get_data = get_res.json()
    assert_eq(get_data["itemCount"], 1, "itemCount is 1")
    assert_eq(get_data["items"][0]["book"]["id"], book1["id"], "Book matches")

    # 10. Toggle same book removes it
    log("\nStep 8: Toggling Same Book (Removal)...")
    tog2_res = requests.post(f"{BASE_URL}/wishlist/{book1['id']}/toggle", headers=headers_a)
    assert_eq(tog2_res.status_code, 200, "Toggle again returns 200")
    tog2_data = tog2_res.json()
    assert_eq(tog2_data["inWishlist"], False, "inWishlist is now false")
    assert_eq(len(tog2_data["wishlist"]["items"]), 0, "Wishlist items is now empty")

    # 11. Add both books
    log("\nStep 9: Adding Multiple Books...")
    requests.post(f"{BASE_URL}/wishlist/{book1['id']}/toggle", headers=headers_a)
    requests.post(f"{BASE_URL}/wishlist/{book2['id']}/toggle", headers=headers_a)
    get_res2 = requests.get(f"{BASE_URL}/wishlist", headers=headers_a)
    assert_eq(get_res2.json()["itemCount"], 2, "Wishlist now has 2 books")

    # 12. Delete single book
    log("\nStep 10: Deleting Single Book via DELETE /wishlist/:bookId...")
    del_res = requests.delete(f"{BASE_URL}/wishlist/{book1['id']}", headers=headers_a)
    assert_eq(del_res.status_code, 200, "DELETE /wishlist/:id returns 200")
    del_data = del_res.json()
    assert_eq(del_data["wishlist"]["itemCount"], 1, "1 book remains in wishlist")
    assert_eq(del_data["wishlist"]["items"][0]["bookId"], book2["id"], "Book 2 remains")

    # 13. Clear wishlist
    log("\nStep 11: Clearing Wishlist via DELETE /wishlist...")
    clr_res = requests.delete(f"{BASE_URL}/wishlist", headers=headers_a)
    assert_eq(clr_res.status_code, 200, "DELETE /wishlist returns 200")
    assert_eq(clr_res.json()["wishlist"]["itemCount"], 0, "Wishlist is cleared")

    # 14. Customer Isolation Test
    log("\nStep 12: Testing Customer Data Isolation...")
    # Add book to Customer A wishlist
    requests.post(f"{BASE_URL}/wishlist/{book1['id']}/toggle", headers=headers_a)
    
    # Create Customer B
    email_b = f"wishlist_b_{int(time.time())}@example.com"
    reg_b = requests.post(f"{BASE_URL}/auth/register", json={
        "name": "Wishlist User B",
        "email": email_b,
        "password": "Password123!"
    })
    token_b = reg_b.json()["accessToken"]
    headers_b = {"Authorization": f"Bearer {token_b}", "Content-Type": "application/json"}

    # Customer B should see empty wishlist
    wish_b = requests.get(f"{BASE_URL}/wishlist", headers=headers_b).json()
    assert_eq(wish_b["itemCount"], 0, "Customer B's wishlist is empty and isolated from Customer A")

    log("\n==================================================")
    log("ALL WISHLIST BACKEND TESTS PASSED SUCCESSFULLY! (13/13)", "SUCCESS")
    log("==================================================")

if __name__ == "__main__":
    try:
        run_tests()
    except Exception as e:
        log(f"Test suite failed: {e}", "ERROR")
        sys.exit(1)
