# BOOKLY – Modern Online Bookstore & E-Commerce Platform

---

## 🎓 Student Information
* **Name:** Gondaliya Rushit R.
* **Enrollment No:** 240841102020
* **Project Title:** BOOKLY – Modern Online Bookstore & E-Commerce Platform

---

## 🛠️ Official Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | Next.js (App Router), React, TypeScript, Tailwind CSS |
| **Backend** | Node.js, NestJS, TypeScript |
| **Database** | PostgreSQL |
| **ORM** | Prisma ORM |
| **Caching** | Redis |
| **Payments** | Razorpay (Test Mode) |
| **Storage** | Cloud Object Storage |
| **Tooling** | Git, GitHub, Docker & Docker Compose |

---

## 📂 Project Architecture & Directory Layout

The application uses a modular monolith architecture. All project source files, dependencies, build artifacts, and local database storage are maintained on **`D:\BOOKLY`**.

```text
D:\BOOKLY\
├── frontend/               # Next.js 14+ Frontend Application
├── backend/                # NestJS REST API Backend Service
├── .env.example            # Environment variables template
├── .gitignore              # Version control ignore definitions
├── docker-compose.yml      # Local container orchestration (PostgreSQL & Redis)
└── README.md               # Project documentation
```

---

## 🚦 Development Phases Roadmap

- [x] **Phase 0:** Environment Inspection & System Diagnostic Report
- [x] **Phase 1:** Workspace Creation (`D:\BOOKLY`) & Git Repository Setup
- [ ] **Phase 2:** Next.js Frontend Scaffolding
- [ ] **Phase 3:** NestJS Backend Scaffolding
- [ ] **Phase 4:** PostgreSQL Database & Prisma ORM Integration
- [ ] **Phase 5:** User Authentication & Authorization (JWT + RBAC)
- [ ] **Phase 6:** Book Catalog, Search & Filtering System
- [ ] **Phase 7:** Shopping Cart & Wishlist System
- [ ] **Phase 8:** Order Management & Safe Inventory Processing
- [ ] **Phase 9:** Razorpay Payment Gateway Integration
- [x] **Phase 10:** Admin Dashboard & Management Interface
- [ ] **Phase 11:** Redis Caching System
- [ ] **Phase 12:** Cloud Object Storage (Cover Images)
- [ ] **Phase 13:** Testing, Security & Performance Optimization
- [ ] **Phase 14:** Containerization (Docker & Docker Compose)

---

## 🚀 Getting Started

1. **Clone / Open Workspace:**
   Open directory `D:\BOOKLY` in Antigravity IDE / VS Code.

2. **Environment Setup:**
   Copy `.env.example` to `.env` in root, `frontend`, and `backend` directories.

3. **Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

4. **Backend:**
   ```bash
   cd backend
   npm run start:dev
   ```
