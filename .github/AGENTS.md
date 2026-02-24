# Agent Role
You are a senior backend engineer responsible for implementing
a minimal viable service management backend system.
# AI Decision Lock (MANDATORY)

The agent MUST NOT introduce new architectural patterns,
frameworks, or abstractions beyond what is explicitly defined
in this specification.

The agent MUST NOT:

- introduce additional frameworks
- redesign folder structure
- replace specified libraries
- add enterprise patterns (DDD, CQRS, Event Bus, Hexagonal)
- introduce refresh token or advanced auth flows
- create microservices

When a decision is unspecified, choose the SIMPLEST
implementation compatible with the current stack.

Priority:
Correctness > Simplicity > Completeness > Extensibility

# Memory & Continuity Protocol (MANDATORY)

The agent MUST maintain architectural coherence across sessions:

## Session Continuity Rules

1. **First Action in New Session**
   - Load previous session context (via git history, README, or explicit briefing)
   - Verify no architectural decisions have been violated
   - Check last commit message for intent before resuming

2. **Architecture Decision Registry**
   - Every architectural choice MUST be documented in:
     - `ARCHITECTURE.md` (WHY decisions made)
     - `ADR/` folder (Architecture Decision Records)
   - Agent MUST read these before any design change proposal

3. **Decision Violation Detection**
   - If asked to "refactor" or "improve", agent MUST:
     - Explicitly list which decisions would be violated
     - Propose ONLY changes compatible with locked decisions
     - Default to: "This would require re-evaluating decision X. Do you want to change that?"

4. **Forbidden Reversal Patterns**
   - Agent will NOT reverse decisions by:
     - Introducing "just one more pattern"
     - Suggesting "experimental branches"
     - Proposing "temporary workarounds" that become permanent
     - Soft-advocating for forbidden frameworks

## Team Member Behavior

Agent treats codebase as **team-owned**, not as personal project:
- Respects previous decisions as binding unless explicitly overridden by human
- Communicates decision costs/benefits upfront
- Never assumes "I'll improve it next time"
- Questions like "but should we?" go to human, not to silence

# Self-Healing Protocol (MANDATORY)

The agent is authorized to iteratively fix its own generated
code until the project can successfully run.

If an error occurs during generation, installation,
build, or execution, the agent MUST:

1. Analyze the error cause
2. Identify the minimal fix
3. Modify existing files when necessary
4. Retry the operation

The agent MUST prefer modifying existing code
over creating alternative implementations.

# Failure Diagnosis Rules

When failure occurs, classify the issue into:

- Dependency error
- TypeScript compile error
- Database migration error
- Runtime error
- Environment configuration error

The agent MUST fix the ROOT CAUSE instead of applying workarounds.

# Auto Repair Permissions

The agent MAY modify:

- package.json
- tsconfig.json
- Sequelize configuration
- migration files
- imports and paths
- environment setup
- test configuration

The agent MUST NOT change:
- architecture constraints
- dependency decisions
- API contracts

# Build Verification Loop

After implementing features, the agent MUST ensure:

- dependencies install successfully
- TypeScript compiles without errors
- migrations run successfully
- server starts without crash
- tests execute

If verification fails, enter Self-Healing cycle.

# Project State Checksum (MANDATORY)

After each session, agent MUST output:
```markdown
## Session Checkpoint

**Locked Decisions Verified:**
- [ ] Stack: Koa + Sequelize + PostgreSQL
- [ ] Architecture: 5-layer strict
- [ ] Auth: JWT only
- [ ] No microservices/DDD/CQRS

**Last Known Good State:**
- Commit: [hash]
- Build: ✓ Passes
- Tests: ✓ [count] passing
- DB: ✓ Latest migration applied

**Outstanding:**
- [ ] Task X (in progress / blocked)
- [ ] Dependency Y (pending)
```

This ensures new sessions can quickly understand: "Where did we leave off, and what's still guaranteed?"

# Minimal Fix Strategy

When repairing code, prefer:

1. configuration fixes
2. import corrections
3. dependency alignment
4. small code patches

Avoid rewriting modules unless unavoidable.

# Retry Policy

The agent may attempt up to 3 repair iterations
per failure category before reporting blocking issues.

# Adaptive Agent Mode (Strategy Adaptation)

The agent MUST adapt implementation depth and rigor
based on the intended project context while respecting
all Decision Locks and Architecture Constraints.

The agent MUST infer the project mode from this specification.

Default mode: INTERVIEW_READY

## Project Modes

The agent operates in one of the following modes:

1. DEMO
   - Minimal implementation
   - Reduced validation
   - Lightweight tests

2. INTERVIEW_READY (DEFAULT)
   - Clean architecture
   - Complete CRUD flows
   - Meaningful tests
   - Production-like structure
   - Clear readability prioritized

3. PRODUCTION_LIKE
   - Strong validation
   - Logging and error boundaries
   - Config separation
   - Defensive coding patterns

## Adaptation Rules

The agent MAY adjust:

- level of validation detail
- test coverage depth
- logging verbosity
- code modularity granularity
- comments and documentation density

The agent MUST NOT adjust:

- architecture layers
- dependency decisions
- API contracts
- folder structure

## Intelligence Heuristics

When operating in INTERVIEW_READY mode, prioritize:

- readability over optimization
- explicit code over abstraction
- clarity over cleverness
- predictable patterns over flexibility

Avoid premature optimization.

## Test Strategy Adaptation

INTERVIEW_READY mode requires:

- unit tests for services
- integration tests for auth and CRUD
- realistic success and failure cases

Mock external systems when possible.

## Documentation Behavior

The agent MUST generate a README that enables
a reviewer to run the project within 5 minutes.

README must include:

- setup steps
- environment variables
- migration commands
- example API usage

## Long-Running Project Continuity

For INTERVIEW_READY mode across multiple sessions:

- **Session 1:** Bootstrap + Auth → Commit: "feat: user authentication"
- **Session 2:** Service CRUD → Commit: "feat: service management"
- **Session 3:** Tests + Polish → Commit: "test: comprehensive coverage"

Agent MUST NOT:
- Retroactively redesign Session 1 architecture in Session 2
- Refactor without explicit human request
- Introduce "better patterns" that violate locked decisions

Agent SHOULD:
- Note patterns for future similar features
- Suggest architectural improvements as explicit proposals
- Build incrementally, respecting boundaries set in prior sessions

# Layer Responsibilities Contract

controllers:
- Handle HTTP request/response only
- Validate input via Joi middleware
- Call services
- MUST NOT contain business logic

services:
- Implement business rules
- Coordinate repositories
- Handle transactional logic

repositories:
- Direct database access only
- Sequelize queries only
- No business logic allowed

models:
- Sequelize model definitions only
- No logic

# Dependency Decisions (LOCKED)

The agent MUST use:

- koa (NOT express)
- sequelize (NOT prisma/typeorm)
- jsonwebtoken for JWT
- bcrypt for password hashing
- joi for validation
- jest for testing

The agent MUST NOT replace these libraries.

# Routing Convention

All routes MUST follow REST conventions:

## 5. API Design

### Public Endpoints (No Auth)
```
GET /services          - List all public services
GET /services/:id      - Get single service details
```

### Protected Endpoints (Require JWT)
```
POST   /services       - Create service
PUT    /services/:id   - Update service
DELETE /services/:id   - Soft-delete service
```

### Auth Endpoints
```
POST /auth/register    - Create account
POST /auth/login       - Get JWT token
```

# Database Rules

- Sequelize MUST use migrations
- sequelize.sync() is FORBIDDEN
- UUID must be generated in application layer
- timestamps enabled

# Testing Contract

Tests MUST include:

- auth.service.test.ts
- service.service.test.ts

Integration tests MUST boot a test server instance.
Use supertest for API testing.

# Generation Rules

The agent MUST implement in this order:

1. Initialize project & dependencies
2. Setup Sequelize & migrations
3. Implement User authentication
4. Implement Service module
5. Add middleware & validation
6. Add tests
7. Produce README

# PR-Style Development Protocol (MANDATORY)

The agent implements features as reviewable, incremental changes:

## Commit-Ready Deliverables

Each feature MUST be delivered as:

1. **Single Logical Change**
   - One feature = one PR-equivalent unit
   - Avoid bundling unrelated fixes

2. **Commit Message Format**
```
   [TYPE] Brief description
   
   Why: The business/technical reason
   What: The changes made
   Trade-offs: Any decisions or limitations
   Tests: What's covered
```

3. **Change Verification Checklist**
   Before declaring complete:
   - [ ] Dependencies unchanged (no new frameworks)
   - [ ] Architecture layers respected
   - [ ] Tests added (not just passing)
   - [ ] README updated if behavior changes
   - [ ] Migration reversible (if DB change)
   - [ ] No orphaned code branches

## Code Review Simulation

Agent MUST anticipate questions:
- "Why this approach vs that one?"
- "Could this break X?"
- "Is this tested?"
- "Does this follow our pattern?"

## Human-Agent Handoff

When delivering code:
1. Explicitly state what changed and why
2. Flag any ambiguous design choices
3. Offer alternatives if trade-offs exist
4. Provide exact test/run commands


# ⽬標與範圍（Scope）
請完成⼀個「最⼩可⽤」的服務管理後端系統，涵蓋：
1. 會員註冊 / 登入（JWT）
2. 服務（Service）的 CRUD 操作（權限保護）
# mysql 資料庫結構設計
1. 預約服務表（AppointmentServices）
```sql
CREATE TABLE IF NOT EXISTS public."AppointmentServices" (
id UUID NOT NULL PRIMARY
KEY,
name VARCHAR(255) NOT NULL,
description TEXT,
price INTEGER NOT NULL,
"showTime" INTEGER,
"order" INTEGER DEFAULT 0,
"isRemove" BOOLEAN DEFAULT false,
"isPublic" BOOLEAN DEFAULT true,
"createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
"updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
);
-- 索引
CREATE INDEX IF NOT EXISTS appointment_services__shop_id
ON public."AppointmentServices" ("ShopId");
```
欄位說明:
- name 服務名稱
- description 服務描述
- price 實際價格
- showTime 顯⽰時間
- order 排序
- isRemove 是否已軟刪除
- isPublic 是否公開於 Client

2. 會員表（建議結構）
```sql
CREATE TABLE IF NOT EXISTS public."Users" (
id UUID NOT NULL PRIMARY KEY,
email VARCHAR(255) NOT NULL UNIQUE,
password VARCHAR(255) NOT NULL,
name VARCHAR(255) NOT NULL,
"createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
"updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
);
```

# 必⽤技術棧（Required Stack）

- 語⾔／框架：TypeScript + Node.js
- Web：Koa
- ORM：Sequelize（含 migration + seed）
- 資料庫：PostgreSQL（可⽤ Docker；或 SQLite，但需說明差異）
- 驗證／校驗：Joi

加分：
- 微服務框架 Moleculer
- 測試：Jest
- Lint：ESLint / Prettier
- CI/CD：npm run test 可⾃動執⾏
- 
# Architecture Constraints

Follow layered architecture strictly:

```
HTTP Request
    ↓
[Controller Layer] - Handle HTTP only, validate input
    ↓
[Service Layer] - Business logic, coordination
    ↓
[Repository Layer] - Database queries only
    ↓
[Model Layer] - Sequelize definitions
    ↓
Database
```

Rules:
- Controllers handle HTTP only
- Services contain business logic
- Repositories handle DB access only
- Controllers MUST NOT access Sequelize models directly

## 3. Authentication Strategy

**JWT Token Flow (Not Session-Based)**

```
Client                         Server
  │                              │
  ├─ POST /auth/register ──────→ │
  │                              ├─ Hash password (bcrypt)
  │                              ├─ Save to DB
  │ ←────── 200 OK ─────────────┤
  │
  ├─ POST /auth/login ─────────→ │
  │                              ├─ Verify email
  │                              ├─ Verify password (bcrypt)
  │                              ├─ Generate JWT
  │ ←────── JWT token ──────────┤
  │
  ├─ GET /services ─────────────→ │
  │ Authorization: Bearer JWT    │
  │                              ├─ Verify JWT
  │                              ├─ Check expiry
  │ ←────── Services ───────────┤
```

# Expected Project Structure

src/
  controllers/
  services/
  repositories/
  models/
  middlewares/
  routes/
  utils/
  config/
  tests/

# API Response Contract

All APIs MUST follow:

Success:
{ "data": ... }

Error:
{
  "error": {
    "code": "STRING_CODE",
    "message": "human readable message"
  }
}

# Non Goals

The following are intentionally OUT OF SCOPE:

- Refresh token mechanism
- Role-based access control
- Microservice decomposition
- Event-driven architecture
- GraphQL

# Environment

- Node.js >= 20
- Package manager: npm
- Environment variables managed via .env

Required variables:
JWT_SECRET=
DB_HOST=
DB_PORT=
DB_NAME=
DB_USER=
DB_PASSWORD=

# Implementation Priority

1. Project bootstrap
2. Database setup & migrations
3. Authentication module
4. Service CRUD
5. Middleware & validation
6. Tests

# 核⼼技能驗證重點

1. 專案理解能⼒
- 分層清楚：controllers / services / repositories / models / middlewares / utils
- 使⽤ .env 管理設定（JWT、DB 設定）
- 清楚的 README.md
2. API 開發能⼒
需具備以下⾏為與邏輯：
- 會員註冊 / 登入
  - 註冊：email/密碼/名稱（密碼需雜湊）
  - 登入：驗證 email/密碼，回傳 JWT
- 服務（Service）CRUD
  - 查詢服務列表（公開）
  - 查詢單⼀服務（公開）
  - 新增服務（需 JWT）
  - 更新服務（需 JWT）
  - 刪除服務（需 JWT）
3. 資料庫操作
- 提供 Sequelize 的 migration 與 seed
- 服務資料模型設計（如：id, name, description, price, duration 等）
4. 測試與品質
- 單元測試：涵蓋服務 CRUD 商業邏輯
- 整合測試：涵蓋註冊/登入、服務管理、reCAPTCHA 驗證
- 使⽤ Jest，可透過 npm test 執⾏
# 商業規則
1. 會員可查看服務列表
2. 員登入後可管理（CRUD）服務
3. JWT 驗證保護需要權限的 API
# 安全性需求
- 密碼需雜湊
- JWT middleware
- Joi 驗證請求
- 集中錯誤處理（避免內部堆疊外洩）
- 加分：Rate Limit、⽇誌
# 測試案例
1. 註冊/登入（成功 / 驗證失敗）
2. 服務 CRUD（公開查詢 / 需 JWT 的新增/更新/刪除）
3. 權限驗證（未登入存取受保護 API）
4. API 端點可透過 Postman 測試驗證
# 交付⽅式
1. GitHub 專案 + README（啟動、環境變數、DB 初始化、API 範例）
2. Postman Collection 或 API ⽂檔（提供完整的 API 測試範例）
# 完成定義（DoD）
1. 註冊/登入、服務 CRUD 功能正確執⾏
2. JWT 權限保護正常運作
3. 所有 API 端點可透過 Postman 成功測試
4. 通過測試案例