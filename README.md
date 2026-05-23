# 🚀 DevPulse – Internal Tech Issue & Feature Tracker

> A collaborative REST API platform for software teams to report bugs, suggest features, and coordinate resolutions.

---

## 🌐 Live URL

**Base URL:** `https://your-deployment-url.vercel.app`

> *(Replace with your actual deployment URL after deploying to Vercel / Render / Railway)*

---

## 📌 Project Overview

**DevPulse** is a backend REST API built with **Node.js**, **TypeScript**, and **PostgreSQL** (using raw SQL). It supports two user roles — `contributor` and `maintainer` — enabling teams to collaboratively manage issues with proper authentication and authorization via JWT.

---

## 🛠️ Technology Stack

| Technology     | Details                                             |
| -------------- | --------------------------------------------------- |
| Node.js        | LTS runtime (v24.x or higher)                       |
| TypeScript     | v6.x (strict mode, no `any` types)                  |
| Express.js     | v5.x – Modular router architecture                  |
| PostgreSQL     | Relational database, native `pg` driver only        |
| Raw SQL        | Direct `pool.query()` calls — no ORM, no JOIN       |
| bcryptjs       | Password hashing (salt rounds: 8–12)                |
| jsonwebtoken   | JWT generation & verification                       |
| dotenv         | Environment variable management                     |
| cors           | Cross-Origin Resource Sharing                       |
| cookie-parser  | Cookie handling middleware                          |
| tsx            | TypeScript execution for development                |

---

## 👥 User Roles & Permissions

| Role            | Allowed Actions                                                                                                                    |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **contributor** | Register & log in · Create new issues (bug or feature request) · View all issues · Update their own issue (only if status is `open`) |
| **maintainer**  | All contributor permissions · Update any issue field · Delete any issue · Change issue workflow status independently              |

---

## 🔐 Authentication & Authorization

- **JWT Flow:** Client sends credentials → Server validates & hashes/compares password → Server returns signed JWT → Client attaches token to `Authorization: <token>` header → Server verifies signature & expiry before processing.
- Passwords are **never** exposed in responses or logs.
- Protected endpoints **reject** requests without a valid JWT.
- Role verification occurs **before** privileged operations.

---

## 🗄️ Database Schema

### Table: `users`

| Column       | Type        | Constraints                              |
| ------------ | ----------- | ---------------------------------------- |
| `id`         | SERIAL      | PRIMARY KEY                              |
| `name`       | VARCHAR     | NOT NULL                                 |
| `email`      | VARCHAR     | NOT NULL, UNIQUE                         |
| `password`   | VARCHAR     | NOT NULL (hashed, never returned)        |
| `role`       | VARCHAR     | DEFAULT `'contributor'`, CHECK IN (`contributor`, `maintainer`) |
| `created_at` | TIMESTAMP   | DEFAULT NOW()                            |
| `updated_at` | TIMESTAMP   | DEFAULT NOW()                            |

### Table: `issues`

| Column        | Type      | Constraints                                            |
| ------------- | --------- | ------------------------------------------------------ |
| `id`          | SERIAL    | PRIMARY KEY                                            |
| `title`       | VARCHAR   | NOT NULL, MAX 150 characters                           |
| `description` | TEXT      | NOT NULL, MIN 20 characters                            |
| `type`        | VARCHAR   | CHECK IN (`bug`, `feature_request`)                    |
| `status`      | VARCHAR   | DEFAULT `'open'`, CHECK IN (`open`, `in_progress`, `resolved`) |
| `reporter_id` | INTEGER   | References `users.id` (validated in application logic) |
| `created_at`  | TIMESTAMP | DEFAULT NOW()                                          |
| `updated_at`  | TIMESTAMP | DEFAULT NOW()                                          |

---

## 🌐 API Endpoints

### 🔹 Authentication

| Method | Endpoint           | Access  | Description                     |
| ------ | ------------------ | ------- | ------------------------------- |
| POST   | `/api/auth/signup` | Public  | Register a new user account     |
| POST   | `/api/auth/login`  | Public  | Authenticate and receive JWT    |

---

### 🔹 Issues

| Method | Endpoint          | Access                         | Description                               |
| ------ | ----------------- | ------------------------------ | ----------------------------------------- |
| POST   | `/api/issues`     | Authenticated                  | Create a new bug report or feature request|
| GET    | `/api/issues`     | Public                         | Retrieve all issues (with filters/sorting)|
| GET    | `/api/issues/:id` | Public                         | Retrieve a single issue by ID             |
| PUT    | `/api/issues/:id` | Maintainer / Own contributor   | Update issue fields                       |
| DELETE | `/api/issues/:id` | Maintainer only                | Permanently delete an issue               |

**Query Parameters for `GET /api/issues`:**

| Param    | Values                              | Default  |
| -------- | ----------------------------------- | -------- |
| `sort`   | `newest`, `oldest`                  | `newest` |
| `type`   | `bug`, `feature_request`            | (none)   |
| `status` | `open`, `in_progress`, `resolved`   | (none)   |

---

## 📦 Request & Response Examples

### Register (`POST /api/auth/signup`)

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john.doe@devpulse.com",
  "password": "securePassword123",
  "role": "contributor"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@devpulse.com",
    "role": "contributor",
    "created_at": "2026-01-20T09:00:00Z",
    "updated_at": "2026-01-20T09:00:00Z"
  }
}
```

---

### Login (`POST /api/auth/login`)

**Request Body:**
```json
{
  "email": "john.doe@devpulse.com",
  "password": "securePassword123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@devpulse.com",
      "role": "contributor"
    }
  }
}
```

---

### Create Issue (`POST /api/issues`)

**Headers:** `Authorization: <JWT_TOKEN>`

**Request Body:**
```json
{
  "title": "Database connection timeout under load",
  "description": "Pool exhausts after 50+ concurrent queries, causing 500 errors",
  "type": "bug"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Issue created successfully",
  "data": {
    "id": 45,
    "title": "Database connection timeout under load",
    "description": "Pool exhausts after 50+ concurrent queries, causing 500 errors",
    "type": "bug",
    "status": "open",
    "reporter_id": 1,
    "created_at": "2026-01-20T10:30:00Z",
    "updated_at": "2026-01-20T10:30:00Z"
  }
}
```

---

## 🚨 HTTP Status Codes

| Code  | Meaning               | Usage                                               |
| ----- | --------------------- | --------------------------------------------------- |
| `200` | OK                    | Successful GET, PATCH, DELETE                       |
| `201` | Created               | Successful POST (resource created)                  |
| `400` | Bad Request           | Validation errors, invalid input, duplicate resource|
| `401` | Unauthorized          | Missing, expired, or invalid JWT                    |
| `403` | Forbidden             | Valid token but insufficient role/permissions       |
| `404` | Not Found             | Resource does not exist                             |
| `409` | Conflict              | Business logic conflict (e.g., editing resolved issue) |
| `500` | Internal Server Error | Unexpected server or database error                 |

---

## ⚙️ Local Setup & Installation

### Prerequisites

- Node.js v24.x or higher
- PostgreSQL database (or use NeonDB / Supabase)

### Steps

**1. Clone the repository:**
```bash
git clone https://github.com/st-shourov12/devpulse.git
cd devpulse
```

**2. Install dependencies:**
```bash
npm install
```

**3. Configure environment variables:**

Create a `.env` file in the root directory:
```env
PORT=5000
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret_key
```

**4. Set up the database:**

Run the following SQL to create the required tables:

```sql
CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(20),
    email VARCHAR(40) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role VARCHAR(15) DEFAULT 'contributor' CHECK (role IN ('contributor', 'maintainer')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
)

CREATE TABLE IF NOT EXISTS issues(
    id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL CHECK (LENGTH(description) >= 20),
    type VARCHAR(20) NOT NULL CHECK (type IN ('bug', 'feature_request')),
    status VARCHAR(20) DEFAULT 'open'
    CHECK (status IN ('open', 'in_progress', 'resolved')),
    reporter_id INT REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
)
```

**5. Start the development server:**
```bash
npm run dev
```

The server will start at `http://localhost:5000`.

---

## 📁 Project Structure

```
devpulse/
├── src/
│   ├── config/         # Database pool and environment config
│   ├── middleware/      # Auth middleware (JWT verification, role checks)
│   ├── modules/
│   │   ├── auth/       # Signup & Login routes, controllers, services
│   │   └── issues/     # Issues routes, controllers, services
│   ├── utils/          # Response formatter, error handler helpers
│   └── app.ts          # App entry point
│   └── server.ts       # Server entry point
├── .env
├── .gitignore
├── package.json
└── tsconfig.json
```

---

## 🚀 Deployment

- **Backend:** [Vercel](https://vercel.com) / [Render](https://render.com) / [Railway](https://railway.app)
- **Database:** [NeonDB](https://neon.tech) / [Supabase](https://supabase.com) / [ElephantSQL](https://www.elephantsql.com)

Ensure the following environment variables are set in your deployment platform:
- `CONNECTIONSTRING`
- `JWT_SECRET`
- `PORT` (if required)
- `JWT_REFRESH_SECRET`

---

## 👤 Author

**Shourov** — [@st-shourov12](https://github.com/st-shourov12)

---

## 📄 License

This project is for educational purposes as part of the Apollo Level-2 Web Development course — Batch 7, Assignment 2.