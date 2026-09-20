# BOOKLY — Project Checkpoint & Technical Audit Report

## 1. Current Architecture
BOOKLY is designed as a decoupled two-tier client-server architecture with relational persistence:
- **Client Tier (Frontend)**: Next.js (App Router with Turbopack) single-page application rendering catalog, cart, wishlist, orders, checkout, and admin dashboard. Communicates with the backend exclusively via standard REST JSON APIs.
- **Server Tier (Backend)**: NestJS enterprise application structured modularly (`AuthModule`, `BooksModule`, `CategoriesModule`, `CartModule`, `WishlistModule`, `OrdersModule`, `PaymentsModule`, `AdminModule`, `PrismaModule`). Features global validation pipes, role guards, JWT authentication strategies, rate limiting, and HTTP security headers.
- **Persistence Tier (Database)**: PostgreSQL relational database accessed through Prisma ORM v6 with schema migrations, relational integrity constraints, indexes, and atomic transaction guarantees.
- **Payment Processing**: Multi-step Razorpay order creation and HMAC-SHA256 cryptographic signature verification.
- **Cross-Cutting**: Helmet HTTP protection, NestJS Throttler for rate limiting, and RBAC (Role-Based Access Control) for Customer and Admin separation.

---

## 2. Current Technology Stack
- **Backend Framework**: NestJS 11.0 (`@nestjs/core`, `@nestjs/common`, `@nestjs/platform-express`)
- **Backend Language**: TypeScript 5.7, Node.js v24.11
- **Database & ORM**: PostgreSQL 16+, Prisma ORM 6.4.0
- **Security & Auth**: Passport-JWT 4.0, `@nestjs/jwt`, `bcryptjs` 3.0, `helmet` 8.3, `@nestjs/throttler` 6.7
- **Validation**: `class-validator` 0.15, `class-transformer` 0.5 (whitelist & forbidNonWhitelisted enabled)
- **Payment Integration**: Razorpay Node.js SDK 2.9.8 (test/sandbox integration)
- **Frontend Framework**: Next.js 16.3.2 (App Router, Turbopack)
- **Frontend UI & Styling**: React 19, Tailwind CSS / Vanilla CSS tokens
- **Test Harness**: Python 3 automated test suites targeting live REST endpoints

---

## 3. Working Modules
- **Authentication & RBAC (`AuthModule`)**: User registration, login, JWT token issuance (7-day expiry), password hashing with bcrypt, role management (`CUSTOMER`, `ADMIN`), and `/auth/profile`.
- **Catalog & Discovery (`BooksModule`, `CategoriesModule`)**: Full text search, pagination, category filtering, price filtering, rating filtering, stock filtering, and sorting (`price_asc`, `price_desc`, `rating`, `title`, `newest`).
- **Cart Management (`CartModule`)**: Authenticated server-side persistent shopping cart, guest cart fallback with localStorage sync, atomic cart item quantity updates, removal, and complete cart flush.
- **Wishlist Management (`WishlistModule`)**: Dedicated wishlist persistence, idempotent book toggling, removal, and clear operations.
- **Order Processing & Checkout (`OrdersModule`)**: Multi-item checkout within Prisma database transactions, dynamic server-side pricing calculations (never trusting frontend amounts), inventory stock decrement, order number generation (`ORD-...`), status progression, and cancellation with automatic stock restoration.
- **Payment Gateway (`PaymentsModule`)**: Server-side Razorpay order generation based on verified database order totals, server-side HMAC-SHA256 signature verification, idempotent payment confirmations, and status inspection.
- **Admin Management Portal (`AdminModule`)**: Admin dashboard metrics (revenue aggregation, user count, book count, order status breakdown, low-stock warnings), user role promotion/demotion, book catalog CRUD, category CRUD, and comprehensive order status management (`PENDING`, `CONFIRMED`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`).

---

## 4. Verified API Areas
| Route Group | Endpoints | Access Level | Description |
|---|---|---|---|
| `/auth` | `POST /register`, `POST /login`, `GET /profile` | Public / Bearer Token | User auth and identity |
| `/categories` | `GET /`, `GET /:id` | Public | Category listings |
| `/categories` | `POST /`, `PATCH /:id`, `DELETE /:id` | Admin Only | Category management |
| `/books` | `GET /`, `GET /:id` | Public | Book discovery and query |
| `/books` | `POST /`, `PATCH /:id`, `DELETE /:id` | Admin Only | Inventory & book CRUD |
| `/cart` | `GET /`, `POST /items`, `PATCH /items/:id`, `DELETE /items/:id`, `DELETE /` | Customer / Bearer Token | Cart mutations |
| `/wishlist` | `GET /`, `POST /:bookId/toggle`, `DELETE /:bookId`, `DELETE /` | Customer / Bearer Token | Wishlist management |
| `/orders` | `POST /checkout`, `GET /`, `GET /:id`, `PATCH /:id/cancel` | Customer / Bearer Token | Order creation & history |
| `/orders/admin` | `GET /admin/all`, `PATCH /admin/:id/status` | Admin Only | Administrative order fulfillment |
| `/payments` | `POST /create-order`, `POST /verify`, `GET /status/:orderId` | Customer / Bearer Token | Razorpay transaction lifecycle |
| `/admin` | `GET /stats`, `GET /users`, `PATCH /users/:id/role` | Admin Only | Backoffice metrics & users |

---

## 5. Security Features
- **Strict Credential Sanitization**: Password hashes are strictly omitted from all response schemas (`select` queries exclude passwords; register, login, profile, and admin user lists never return credentials).
- **Tenant & Customer Data Isolation**: Customers can strictly view, cancel, or pay for only their own orders (`order.userId === userId` check returning HTTP 403 Forbidden on cross-tenant attempts).
- **Role-Based Access Control (RBAC)**: All administrative routes are protected by NestJS `RolesGuard` and require the `ADMIN` role enum. Non-admin users are strictly blocked with HTTP 403 Forbidden.
- **Server-Side Price Integrity**: Checkout and payment calculations exclusively use prices and discounts queried from the database; client-side price fields are never accepted.
- **Cryptographic Payment Verification**: Payment status is updated only after verifying the HMAC-SHA256 signature generated with `RAZORPAY_KEY_SECRET`. Key secret is never exposed to the client.
- **Global Payload Validation**: NestJS `ValidationPipe` with `whitelist: true`, `forbidNonWhitelisted: true`, and `transform: true` rejects unexpected and malicious request parameters with HTTP 400 Bad Request.
- **HTTP Security Headers**: `helmet` configured with cross-origin resource policy, preventing MIME-type sniffing (`X-Content-Type-Options: nosniff`), clickjacking (`X-Frame-Options: SAMEORIGIN`), and enforcing CSP / HSTS.
- **Global API Rate Limiting**: `ThrottlerModule` active across all endpoints with a window limit of 300 requests per 60 seconds. Rate limit headers (`X-RateLimit-Limit`, `X-RateLimit-Remaining`) verified.
- **Environment Isolation**: `.env` and `.env*.local` files are ignored in Git (`.gitignore`). No secrets are committed or hardcoded.

---

## 6. Database Status
- **Database Engine**: PostgreSQL (`localhost:5432`, database: `bookly_db`)
- **Prisma Migrations**: 1 migration recorded (`20260824094833_init`)
- **Migration Status**: Verified via `npx prisma migrate status` — database schema is up to date with 0 pending migrations.
- **Entities & Relations**: `User`, `Category`, `Book`, `Cart`, `CartItem`, `Wishlist`, `WishlistItem`, `Order`, `OrderItem`, `Payment`, `Review` with foreign keys, cascade delete policies, and composite unique indices.

---

## 7. Test Suites and Exact Pass Counts
All 7 automated test suites pass completely (7/7 suites passing, 0 test failures):

| Test Suite File | Domain / Focus | Checks / Assertions Passed | Result |
|---|---|---|---|
| `test_cart_api.py` | Cart API (unauthenticated 401s, add, update, remove, clear, stock limits) | 36 / 36 | **PASS** |
| `test_wishlist_api.py` | Wishlist API (unauthenticated 401s, toggle, check, remove, clear) | 28 / 28 | **PASS** |
| `test_orders_api.py` | Orders & Checkout (empty cart error, stock check, order creation, list, detail) | 33 / 33 | **PASS** |
| `test_payments_api.py` | Payments API (unauthorized 401s, order creation, signature verification, status) | 22 / 22 | **PASS** |
| `test_admin_api.py` | Admin API (RBAC 403 enforcement, stats, users, role update, order management) | 20 / 20 | **PASS** |
| `test_priority_features.py` | Priority Features & Cancellation (order cancellation, inventory restoration) | 20 / 20 | **PASS** |
| `test_security_api.py` | Security Hardening (Helmet, RateLimiting, Tenant Isolation, Sanitization, RBAC) | 27 / 27 | **PASS** |
| **Total** | **All Verification Suites** | **186 / 186 Assertions** | **PASS (100%)** |

---

## 8. Build Status
- **Backend (`D:\BOOKLY\backend`)**:
  - Command: `npm run build` (`nest build`)
  - Status: **SUCCESS** (Exit Code: 0, 0 TypeScript errors, 0 compilation warnings)
- **Frontend (`D:\BOOKLY\frontend`)**:
  - Command: `npm run build` (`next build` with Turbopack)
  - Status: **SUCCESS** (Exit Code: 0, 13/13 static and dynamic routes compiled and optimized, 0 TypeScript errors)

---

## 9. Known Limitations
- **Payment Mode**: Razorpay is currently operating in test/sandbox simulation mode using test key pairs. Live payments require production API credentials.
- **Image Storage**: Book cover images are currently referenced via external URLs or placeholder strings; cloud asset upload (e.g. Cloudinary/S3) is not yet integrated.
- **Caching**: No distributed caching layer (Redis) is currently active; queries run directly against PostgreSQL with Prisma query engine.
- **Email/SMS Notifications**: Checkout and order status transitions do not currently send transactional emails/SMS.

---

## 10. Intentionally Deferred Features
Per architectural scope and instructions:
- **Redis Cache Layer**: Deferred.
- **Cloudinary / AWS S3 Upload**: Deferred.
- **Production Infrastructure & CI/CD Deployment**: Deferred.
- **Customer Book Reviews & Rating Submission UI**: Deferred to post-UI redesign.
- **Coupons & Promotional Code Engine**: Deferred.

---

## 11. Future UI/UX Redesign Note
This checkpoint solidifies the technical, architectural, and security foundation of BOOKLY. The entire backend API, authentication, RBAC, database schema, payment verification, order processing, and administrative controls are verified and operational. 

The next designated phase is a dedicated **Frontend UI/UX Redesign**. All backend contracts, DTO interfaces, and service methods are documented and stable to support this upcoming visual overhaul.
