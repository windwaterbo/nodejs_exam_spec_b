# NodeJS Exam Spec B - Service Management Backend

## Overview

A minimal service management backend using:
- **TypeScript** + **Node.js**
- **Koa** web framework
- **Sequelize** ORM (migrations-only)
- **PostgreSQL** database
- **JWT** authentication
- **Joi** validation
- **Jest** testing framework

## Quick Start

### 1. Clone & Install

```bash
git clone <repo>
cd nodejs_exam_spec_b
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env
# Edit .env with your PostgreSQL credentials
```

Environment variables
```env
JWT_SECRET=your-secret-key
DB_HOST=localhost
DB_PORT=5432
DB_NAME=exam_db
DB_USER=postgres
DB_PASSWORD=postgres
```

### 3. Database Migration

```bash
npm run migrate
```

### 4. Run Server

```bash
npm run dev
```

Server starts on `http://localhost:3000`

### 5. Run Test

```bash
# Run all tests
npm test

# Output example:
# PASS src/test/integration.test.ts
# PASS src/services/authService.test.ts
# PASS src/services/serviceService.test.ts
#
# Test Suites: 3 passed, 3 total
# Tests:       29 passed, 29 total
# Time:        ~3 seconds
```

## API Documentation

### 📚 Interactive API Testing & Documentation
- **Swagger UI**: `http://localhost:3000/swagger` (recommended for testing)
  - Interactive endpoint testing with JWT support
  - Full request/response examples
  - Real-time validation feedback
  
- **OpenAPI Spec JSON**: `http://localhost:3000/swagger/spec.json`
  - Machine-readable API schema
  - Can be imported into Postman, Insomnia, etc.

### User Registration Rules

**POST /auth/register** - Create new user account

#### Password Requirements
- **Length**: 6-36 characters
- **Characters**: Alphanumeric only (a-z, A-Z, 0-9)
- **No Special Symbols**: @, !, #, $, %, &, etc. are NOT allowed

#### Email Requirements  
- Must be valid email format
- Must be unique (no duplicates)

#### Request Body
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "name": "John Doe"
}
```

#### Success Response (200)
```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

#### Error Responses (400)

**Invalid Email Format:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "\"email\" must be a valid email"
  }
}
```

**Password Too Short:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Password 至少需要 6 個字元"
  }
}
```

**Password Too Long:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Password 最多支援 36 個字元"
  }
}
```

**Password Contains Special Characters:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Password 只支援大小寫英文與數字混合，不能有特殊符號"
  }
}
```

**Email Already Taken:**
```json
{
  "error": {
    "code": "EMAIL_TAKEN",
    "message": "Email already in use"
  }
}
```

---

### Authentication APIs

#### POST /auth/login - Login and Get JWT Token

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Success Response (200):**
```json
{
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1NTBlODQwMC1lMjliLTQxZDQtYTcxNi00NDY2NTU0NDAwMDAiLCJlbWFpbCI6InVzZXJAZXhhbXBsZS5jb20iLCJpYXQiOjE2NDAwMDAwMDAsImV4cCI6MTY0MDAwMzYwMH0.signature"
  }
}
```

**Error Response (400):**
```json
{
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Invalid credentials"
  }
}
```

---

### Service APIs

#### GET /services - List Services (supports query filters)

**No authentication required**

This endpoint supports optional query parameters: `isPublic`, `isRemove`, `shopId`, and `id`. When no query parameters are provided the endpoint returns all services regardless of `isPublic`/`isRemove` status. When any query parameter is provided the response is filtered accordingly.

**Success Response (200):**
```json
{
  "data": [
    {
      "id": "550e8400-1111-1111-1111-000000000001",
      "name": "Web Development",
      "description": "Professional web development services",
      "price": 5000,
      "showTime": 60,
      "order": 1,
      "isPublic": true,
      "isRemove": false,
      "createdAt": "2026-02-24T00:00:00.000Z",
      "updatedAt": "2026-02-24T00:00:00.000Z"
    }
  ]
}
```

---

#### GET /services/:id - Get Service Details

**No authentication required**

**URL Parameter:**
- `id` (UUID): Service ID

**Success Response (200):**
```json
{
  "data": {
    "id": "550e8400-1111-1111-1111-000000000001",
    "name": "Web Development",
    "description": "Professional web development services",
    "price": 5000,
    "showTime": 60,
    "order": 1,
    "isPublic": true,
    "isRemove": false,
    "createdAt": "2026-02-24T00:00:00.000Z",
    "updatedAt": "2026-02-24T00:00:00.000Z"
  }
}
```

---

#### POST /services - Create Service

**Requires JWT Authentication**

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Request Body:**
```json
{
  "name": "Consulting",
  "description": "Technical consultation services",
  "price": 1500,
  "showTime": 30,
  "isPublic": true
}
```

**Success Response (200):**
```json
{
  "data": {
    "id": "550e8400-2222-2222-2222-000000000002",
    "name": "Consulting",
    "description": "Technical consultation services",
    "price": 1500,
    "showTime": 30,
    "order": 0,
    "isPublic": true,
    "isRemove": false,
    "createdAt": "2026-02-24T00:00:00.000Z",
    "updatedAt": "2026-02-24T00:00:00.000Z"
  }
}
```

**Error Response (401):**
```json
{
  "error": {
    "code": "NO_AUTH_HEADER",
    "message": "Authorization header missing"
  }
}
```

---

#### PUT /services/:id - Update Service

**Requires JWT Authentication**

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**URL Parameter:**
- `id` (UUID): Service ID

**Request Body:**
```json
{
  "name": "Updated Consulting",
  "price": 2000,
  "isPublic": true
}
```

**Success Response (200):**
```json
{
  "data": {
    "id": "550e8400-2222-2222-2222-000000000002",
    "name": "Updated Consulting",
    "price": 2000,
    "isPublic": true,
    ...
  }
}
```

---

#### DELETE /services/:id - Delete Service (Soft Delete)

**Requires JWT Authentication**

This endpoint performs a **soft delete** - the service record is marked as deleted (`isRemove: true`) but remains in the database and can be retrieved using the `?isRemove=true` query filter.

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**URL Parameter:**
- `id` (UUID): Service ID to delete

**Success Response (200):**
```json
{
  "data": {
    "id": "550e8400-2222-2222-2222-000000000002"
  }
}
```

**Soft Delete Behavior:**
- Service is marked with `isRemove: true`
- Record remains in database for audit/recovery purposes
- Can be retrieved with: `GET /services?isRemove=true`
- Use `GET /services` (no params) to see all statuses
- Use `GET /services?isRemove=false` to see only active services

**Example:**
```bash
# Delete a service
curl -X DELETE http://localhost:3000/services/550e8400-2222-2222-2222-000000000002 \
  -H "Authorization: Bearer <JWT_TOKEN>"

# Retrieve the soft-deleted service
curl "http://localhost:3000/services?isRemove=true"
# Returns: [{ id: "550e8400-2222-...", isRemove: true, ... }]

# Verify it's hidden from active services list
curl "http://localhost:3000/services?isRemove=false"
# Returns: [] (or other active services)
```

---

### Error Codes Reference

All errors follow standard format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message"
  }
}
```

| Code | Description | HTTP Status |
|------|-------------|-------------|
| `VALIDATION_ERROR` | Request validation failed | 400 |
| `EMAIL_TAKEN` | Email already registered | 400 |
| `INVALID_CREDENTIALS` | Wrong email or password | 400 |
| `NO_AUTH_HEADER` | Missing Authorization header | 401 |
| `INVALID_TOKEN` | JWT verification failed | 401 |
| `INVALID_AUTH_FORMAT` | Invalid Authorization format | 401 |

---



## 🧪 Complete Testing Workflow

### Scenario: Full User Journey

**Step 1: Register a new account**
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane.doe@company.com",
    "password": "MyPassword123",
    "name": "Jane Doe"
  }'
```

**Expected Response (200):**
```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "jane.doe@company.com",
    "name": "Jane Doe"
  }
}
```

---

**Step 2: Login to get JWT token**
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane.doe@company.com",
    "password": "MyPassword123"
  }'
```

**Expected Response (200):**
```json
{
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Save token for next steps:**
```bash
TOKEN="<paste_token_from_response>"
```

---

**Step 3: View all public services**
```bash
curl -X GET http://localhost:3000/services \
  -H "Content-Type: application/json"
```

---

**Step 4: Create a new service (requires JWT)**
```bash
curl -X POST http://localhost:3000/services \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Mobile App Development",
    "description": "iOS and Android native app development",
    "price": 8000,
    "showTime": 120,
    "isPublic": true
  }'
```

---

**Step 5: Update your service (requires JWT)**
```bash
curl -X PUT http://localhost:3000/services/<service_id> \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "price": 9000,
    "showTime": 90
  }'
```

---

**Step 6: Delete service (soft delete, requires JWT)**
```bash
curl -X DELETE http://localhost:3000/services/<service_id> \
  -H "Authorization: Bearer $TOKEN"
```

---

## ✅ Common Validation Errors

### Invalid Email Format
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "\"email\" must be a valid email"
  }
}
```

### Password Too Short (< 6 chars)
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Password 至少需要 6 個字元"
  }
}
```

### Password Contains Special Characters
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Password 只支援大小寫英文與數字混合，不能有特殊符號"
  }
}
```

### Missing JWT Token
```json
{
  "error": {
    "code": "NO_AUTH_HEADER",
    "message": "Authorization header missing"
  }
}
```

### Invalid JWT Token
```json
{
  "error": {
    "code": "INVALID_TOKEN",
    "message": "jwt malformed"
  }
}
```

---
