# Agent Sessions Protocol

**Purpose:** Ensure architectural coherence and progress continuity across AI sessions for the Service Management Backend project.

**Governance:** Human-driven. Agent proposes, human decides on architectural changes.

---

## 1. Session Lifecycle (Daily Granularity)

### 1.1 Daily Session Pattern

```
Day 1: [Context Load] → [Work S1] → [Checkpoint] 
         ↓ saves to .session-state.json
Day 2: [Context Load] → [Verify] → [Work S2] → [Checkpoint]
         ↓ reads .session-state.json, validates, resumes
Day 3: [Context Load] → [Verify] → [Work S3] → [Checkpoint]
```

**Key:** Each day has ONE session. Session ID = date (e.g., `2025-02-23`, `2025-02-24`)

### 1.2 Session Phases

```
[START] → [CONTEXT LOAD] → [STATE VERIFY] → [WORK] → [CHECKPOINT] → [END]
```

#### Phase: Context Load (First 3 minutes of new day)

Agent's mandatory first action:

1. **Load SESSION_STATE.json** (if exists)
   ```bash
   cat .session-state.json | jq .
   ```
   
2. **Verify architectural baseline** from:
   - `agents.md` (locked decisions - immutable)
   - `ARCHITECTURE.md` (design rationale - if exists)
   - `ADR/` folder (decision records - if exists)

3. **Scan recent git history**
   ```bash
   git log --oneline -10
   git status
   ```

4. **Report to human:**
   ```markdown
   ## Daily Session Load: 2025-02-23
   
   ### Previous Session State (from .session-state.json)
   **Last Active:** 2025-02-22 17:30:00Z
   **Previous Commit:** 9e5f6g7 [test][S1] Auth tests complete
   **Previous Progress:** 
     ✓ User model + migrations
     ✓ AuthService (bcrypt + JWT)
     ✓ /auth/register, /auth/login endpoints
   
   ### Outstanding Tasks (from state file)
   - [ ] Service model + migrations
   - [ ] Service CRUD endpoints
   - [ ] Service integration tests
   - [ ] [BLOCKED] Waiting for clarification on soft-delete logic
   
   ### Health Check
   **Build:** ✓ npm install + build passing
   **Tests:** ✓ 6/6 auth tests passing
   **DB:** ✓ Latest migration applied (migration_20250223_001)
   **Git:** ✓ main branch, clean working directory
   
   ### Locked Constraints Verified
   - Stack: ✓ Koa + Sequelize + PostgreSQL (unchanged)
   - Architecture: ✓ 5-layer (controller/service/repository/model/middleware)
   - Auth: ✓ JWT only (no refresh tokens)
   - Forbidden: ✓ No microservices, DDD, CQRS
   
   ### Today's Plan
   Based on yesterday's outstanding tasks:
   1. Create AppointmentService model
   2. Implement Service repository + service layer
   3. Create CRUD endpoints
   4. Add Joi validation
   5. Write integration tests
   
   **Blockers to Address:**
   - Soft-delete logic: Should repository hide isRemove=true by default?
   
   **Ready to proceed?**
   ```

#### Phase: State Verify

Agent verifies that previous work hasn't broken the system:

1. **Check: Are locked decisions still locked?**
   ```bash
   # Verify no forbidden packages were added
   grep -E "express|prisma|typeorm|moleculer" package.json
   # Should return: nothing (empty)
   ```

2. **Check: Can project still build?**
   ```bash
   npm install
   npm run build
   # Should exit: 0
   ```

3. **Check: Do existing tests still pass?**
   ```bash
   npm test
   # Should show: all tests passing
   ```

4. **Check: Can migrations run?**
   ```bash
   npm run db:migrate
   # Should exit: 0, no rollback needed
   ```

5. **Check: Does server start?**
   ```bash
   npm run dev &
   curl http://localhost:3000/health
   # Should return: 200 OK
   ```

If any check fails → **Self-Healing Mode** (see `agents.md` Section "Self-Healing Protocol")

If all pass → Proceed to work phase

#### Phase: Work
Human specifies task. Agent:
1. States which architectural decisions apply
2. Proposes implementation approach
3. Implements in **PR-equivalent** chunks
4. Commits with clear message (see 2.3)

#### Phase: Checkpoint (End of Each Day)

Agent MUST generate/update `.session-state.json` and output human-readable summary.

**File: `.session-state.json` (machine-readable state)**

```json
{
  "session_id": "2025-02-23",
  "session_type": "daily",
  "duration_minutes": 240,
  
  "timeline": {
    "started_at": "2025-02-23T09:00:00Z",
    "ended_at": "2025-02-23T13:00:00Z"
  },
  
  "previous_session": {
    "id": "2025-02-22",
    "final_commit": "9e5f6g7",
    "final_commit_message": "[test][2025-02-22] Auth tests complete"
  },
  
  "work_completed": {
    "commits": [
      {
        "hash": "1a2b3c4",
        "message": "[feat][2025-02-23] Service model + migrations"
      },
      {
        "hash": "2b3c4d5",
        "message": "[feat][2025-02-23] Service repository + service layer"
      },
      {
        "hash": "3c4d5e6",
        "message": "[feat][2025-02-23] Service CRUD endpoints"
      },
      {
        "hash": "4d5e6f7",
        "message": "[test][2025-02-23] Service integration tests"
      }
    ],
    "features_added": [
      "AppointmentService model",
      "ServiceRepository (CRUD + soft-delete filter)",
      "ServiceService (business logic)",
      "ServiceController (5 REST endpoints)",
      "Joi validation for service creation/update"
    ],
    "tests_added": [
      "service.repository.test.ts (6 test cases)",
      "service.service.test.ts (8 test cases)",
      "integration: service CRUD flow (4 scenarios)"
    ]
  },
  
  "build_status": {
    "npm_install": "✓ passing",
    "npm_build": "✓ passing",
    "npm_test": "✓ 18/18 passing",
    "db_migrations": "✓ latest applied",
    "server_start": "✓ starts without crash"
  },
  
  "architecture_health": {
    "locked_decisions_intact": true,
    "new_packages_added": [],
    "forbidden_patterns_detected": [],
    "layer_boundaries_violated": []
  },
  
  "outstanding_tasks": [
    {
      "id": "task_001",
      "description": "Add rate limiting middleware",
      "status": "not_started",
      "priority": "nice_to_have"
    },
    {
      "id": "task_002",
      "description": "Add comprehensive error logging",
      "status": "not_started",
      "priority": "nice_to_have"
    }
  ],
  
  "blockers": [],
  
  "next_session_plan": {
    "session_date": "2025-02-24",
    "objectives": [
      "Add rate limiting middleware",
      "Write comprehensive error handling tests",
      "Complete README + API documentation"
    ],
    "prerequisites": [
      "Latest code in main branch",
      "Local PostgreSQL running",
      "npm install fresh"
    ],
    "estimated_duration_minutes": 180
  },
  
  "decision_points": [
    {
      "question": "Should soft-deleted services (isRemove=true) be hidden from GET /services?",
      "decision": "YES - repository filters by default, admin needs special flag",
      "documented_in": "ARCHITECTURE.md"
    }
  ]
}
```

**Console Output: Human-readable checkpoint report**

```markdown
## Daily Checkpoint: 2025-02-23

**Duration:** 4 hours

**Commits Completed:**
- 1a2b3c4 [feat][2025-02-23] Service model + migrations
- 2b3c4d5 [feat][2025-02-23] Service repository + service layer
- 3c4d5e6 [feat][2025-02-23] Service CRUD endpoints
- 4d5e6f7 [test][2025-02-23] Service integration tests

**What's New:**
✓ Service CRUD fully implemented (GET list, GET single, POST, PUT, DELETE)
✓ Soft-delete logic: isRemove field hidden from public endpoints
✓ All service endpoints protected by JWT auth
✓ 18 tests passing (100% of suite)

**Build Health:**
✓ npm install: Passing
✓ npm build: Passing
✓ npm test: 18/18 passing
✓ Database: Latest migrations applied
✓ Server: Starts and responds to requests

**Architecture Integrity:**
✓ Stack unchanged: Koa + Sequelize + PostgreSQL
✓ No new packages added
✓ No forbidden patterns detected (no DDD, CQRS, microservices)
✓ Layer boundaries respected (controller → service → repository → model)

**Outstanding (for tomorrow):**
- [ ] Rate limiting middleware (nice-to-have)
- [ ] Comprehensive error logging (nice-to-have)
- [ ] Final README + Postman collection

**Tomorrow's Session (2025-02-24):**
- Goal: Polish + documentation
- Estimated time: 3 hours
- Prerequisite: Fresh `npm install` if anything changed

**State saved to:** `.session-state.json`
**Next session will load:** Previous progress, outstanding tasks, and blockers
```

---

## 2. Decision & Change Management

### 2.1 Architectural Decision Registry

All decisions stored in three places (single source of truth):

1. **`agents.md`** - Locked constraints (IMMUTABLE without human override)
2. **`ARCHITECTURE.md`** - Rationale (why we chose Koa, not Express, etc.)
3. **`ADR/`** folder - Specific decisions with trade-offs

#### When to Create an ADR

If proposing a change to:
- Tech stack choice
- Architectural pattern
- File structure
- Database schema

**Format:** `ADR/NNNN_TITLE.md`

```markdown
# ADR-0001: Use Koa Instead of Express

## Status
ACCEPTED (Session 1, 2025-02-23)

## Context
Need lightweight, async-first web framework for minimal MVP.

## Decision
Use Koa 2 + Sequelize for TypeScript backend.

## Consequences
- ✓ Lightweight, middleware-focused
- ✗ Smaller ecosystem than Express
- Locked decision: Cannot switch to Express later without explicit override

## Alternatives Considered
- Express (larger, more boilerplate)
- Fastify (overkill for MVP)

## Related Decisions
None yet.
```

### 2.2 Change Request Protocol

**If human asks for architectural change:**

Agent's response template:

```
**Current Decision:** [What we chose + why]
**Requested Change:** [What you're asking for]
**Architectural Impact:**
- Would violate: [Locked Decision X]
- Would require: [ADR proposal]

**Option A - Honor current constraint:**
[Alternative approach within bounds]

**Option B - Change the constraint:**
[Proposal for new ADR]
→ Requires explicit approval + documentation

**Recommendation:** Option [A/B]
**Rationale:** [brief]

Which would you prefer?
```

### 2.3 Commit Message Convention

```
[TYPE][SESSION] Brief description

Session: Name of session (e.g., "S1-Auth")
Why: Business/technical reason
What: The changes made
Commits: [exact file paths changed]

Architectural Notes:
- Decisions locked: [list any that apply]
- Decisions violated: [NONE if clean / list if any]

Tests:
- New tests: [count]
- Coverage: [% if available]

Example:
---
[feat][S1-Auth] Implement user registration & JWT login

Session: Session 1 - Authentication
Why: Enable member login + protected endpoint access
What:
  - User model + migrations
  - AuthService (bcrypt hashing, JWT generation)
  - /auth/register, /auth/login endpoints
  - JWT middleware

Commits: src/models/user.ts, src/services/auth.service.ts, etc.

Architectural Notes:
- Locked decisions active: Koa, Sequelize, JWT, bcrypt
- No new frameworks introduced
- Layer boundaries: Controller → Service → Repository → Model

Tests:
- auth.service.test.ts: 6 test cases
- Integration: 2 auth flow tests

---
```

---

## 3. Session Planning Template

### Before Starting a Session

**Use this to brief the AI:**

```markdown
# Session Brief: [Session Name]

**Goal:** [One clear objective]

**Context:**
- Previous session ended at: [checkpoint]
- Current blockers: [if any]
- Dependencies ready: [yes/no]

**Scope (What's IN):**
- [ ] Requirement A
- [ ] Requirement B

**Scope (What's OUT):**
- No refactoring
- No new frameworks
- [other boundaries]

**Acceptance Criteria:**
- npm test passes
- Specific endpoints work (list them)
- Database state is clean

**Time Box:** [HH:MM]
```

**Agent's Response:**

```markdown
# Session Plan: [Session Name]

**Understanding:** [restate goal in agent's own words]

**Locked Constraints Applied:**
- [Constraint A]
- [Constraint B]

**Implementation Path:**
1. Step 1 (file X)
2. Step 2 (file Y)
3. Verification (run X command)

**Architecture Decision Points:**
[Any ambiguous design choices that need human input]

**Estimated Commits:** [N]

**Ready?**
```

---

## 4. Daily Session Progression

### Example: 3-Day Build of Service Management Backend

**Day 1 (2025-02-23): Bootstrap + Auth**
- Duration: 4 hours (09:00 - 13:00)
- Goal: User model, bcrypt, JWT, auth endpoints
- Output: `npm test` passes with 6 auth tests
- Exit Commit: `9e5f6g7 [test][2025-02-23] Auth integration tests complete`
- Checkpoint: `.session-state.json` written with next plan

**Day 2 (2025-02-24): Service CRUD**
- Duration: 4 hours (09:00 - 13:00)
- Input: Loads Day 1 state from `.session-state.json`
- Goal: Service model, repository, service, controller (CRUD)
- Output: `npm test` passes with 18 total tests
- Exit Commit: `4d5e6f7 [test][2025-02-24] Service CRUD integration tests complete`
- Checkpoint: `.session-state.json` updated with new progress

**Day 3 (2025-02-25): Polish + Docs**
- Duration: 2 hours (09:00 - 11:00)
- Input: Loads Day 2 state from `.session-state.json`
- Goal: Rate limiting, error handling, README, Postman collection
- Output: Project ready for deployment
- Exit Commit: `5e6f7g8 [doc][2025-02-25] Complete documentation + API examples`
- Checkpoint: Final `.session-state.json` with "COMPLETED" status

### Migration Continuity Across Days

**Rule:** Migrations are **append-only** across all days.

```
Day 1:
  ✓ migrations/20250223_001_create_users.js
  ✓ migrations/20250223_002_create_appointment_services.js

Day 2:
  ✓ migrations/20250224_003_add_soft_delete_timestamp.js

Day 3:
  ✓ migrations/20250225_004_add_audit_fields.js
```

**Never:**
- Modify past migrations (create new ones instead)
- Drop and recreate tables between days
- Use `sequelize.sync()` (violates agents.md)

**Migration State in JSON:**
```json
{
  "build_status": {
    "db_migrations": "✓ latest applied: 20250225_004_add_audit_fields"
  }
}
```

---

## 5. SESSION_STATE.json - The Source of Truth

### 5.1 Purpose

`SESSION_STATE.json` is the **single source of truth** for day-to-day continuity.

At end of each day, agent writes it. At start of next day, agent reads it.

This replaces ad-hoc notes or human memory.

### 5.2 Full Specification

**File location:** `.session-state.json` (project root)

**Read at:** Start of every new session (first 30 seconds)

**Written at:** End of every session (must complete before "END")

### 5.3 Schema Reference

```json
{
  "session_id": "YYYY-MM-DD",
  "session_type": "daily",
  "duration_minutes": 240,
  
  "timeline": {
    "started_at": "ISO 8601 timestamp",
    "ended_at": "ISO 8601 timestamp"
  },
  
  "previous_session": {
    "id": "YYYY-MM-DD",
    "final_commit": "git hash",
    "final_commit_message": "commit message"
  },
  
  "work_completed": {
    "commits": [
      {
        "hash": "git hash",
        "message": "commit message",
        "files_changed": 5,
        "lines_added": 120
      }
    ],
    "features_added": ["feature name 1", "feature name 2"],
    "tests_added": ["test file 1", "test file 2"]
  },
  
  "build_status": {
    "npm_install": "✓ passing | ✗ failed: [reason]",
    "npm_build": "✓ passing | ✗ failed: [reason]",
    "npm_test": "✓ X/Y passing | ✗ Y failed: [list]",
    "db_migrations": "✓ latest applied | ✗ failed: [reason]",
    "server_start": "✓ starts | ✗ crash: [reason]"
  },
  
  "architecture_health": {
    "locked_decisions_intact": true,
    "new_packages_added": [],
    "forbidden_patterns_detected": [],
    "layer_boundaries_violated": [],
    "schema_changes_made": []
  },
  
  "outstanding_tasks": [
    {
      "id": "task_001",
      "description": "Task description",
      "status": "not_started | in_progress | blocked",
      "priority": "must_have | nice_to_have",
      "blocker_reason": "if status=blocked, why?"
    }
  ],
  
  "blockers": [
    {
      "id": "blocker_001",
      "description": "What's blocking",
      "blocked_tasks": ["task_001", "task_002"],
      "requires_human_decision": true,
      "decision_question": "What should we do about X?"
    }
  ],
  
  "next_session_plan": {
    "session_date": "YYYY-MM-DD",
    "objectives": ["objective 1", "objective 2"],
    "prerequisites": [
      "Latest code in main branch",
      "Local environment: [what needs to be ready]"
    ],
    "estimated_duration_minutes": 180
  },
  
  "decision_points": [
    {
      "question": "The actual question",
      "decision": "The decision made",
      "documented_in": "agents.md | ARCHITECTURE.md | ADR/NNNN_filename.md"
    }
  ]
}
```

### 5.4 Rules for SESSION_STATE.json

**Writing (end of session):**
- [ ] All fields populated accurately
- [ ] No placeholder values
- [ ] JSON is valid (use `jq` to verify)
- [ ] Committed to git: `git add .session-state.json && git commit -m "[doc] Session checkpoint"`

**Reading (start of session):**
- [ ] Agent MUST read this before asking human anything
- [ ] Agent MUST validate timestamps (sanity check)
- [ ] Agent MUST display "Previous Session State" section to human
- [ ] Agent MUST flag if file is >24 hours old (might be stale)

**Updating (during session):**
- [ ] Do NOT manually edit `.session-state.json`
- [ ] Only agent writes it at end of day
- [ ] This ensures single source of truth

### 5.5 Example: How It Works Day-to-Day

**Day 1 (2025-02-23, 09:00 AM)**
Human: "Build auth module"
Agent: Creates `.session-state.json` at 13:00 with all completed work

**Day 2 (2025-02-24, 09:00 AM)**
Agent: Reads `.session-state.json` (loads yesterday's state)
Agent: Verifies no breaks (`npm test` still passes)
Agent: Displays: "Here's what we did yesterday, here's what's next"
Human: "Continue with Service CRUD"
Agent: Proceeds with CRUD implementation
Agent: Updates `.session-state.json` at end of day

**Day 3 (2025-02-25, 09:00 AM)**
Agent: Reads `.session-state.json` (loads 2 days of context)
Agent: Verifies no breaks
Agent: Knows exactly where we are, no human briefing needed

---

## 6. Conflict Resolution

### Scenario: Agent wants to refactor but it violates a decision

**Agent's response (mandatory):**

```
**Observation:** Code in [module] could be cleaner with [pattern].

**Constraint Check:** 
- Current decision: [Locked Decision X in agents.md]
- Would require: Changing to [forbidden pattern]

**Result:** Cannot proceed without override.

**Options:**
1. Accept current code structure (within bounds)
2. Request explicit ADR change for [decision]

**Recommendation:** Option 1 (maintain consistency)

**Continue with current constraints?**
```

### Scenario: Human explicitly asks to break a rule

**Allowed:**
```
Human: "I know this violates the no-microservices rule, but let's try it anyway."
Agent: "Confirmed. Creating ADR-XXXX to document this override. Proceeding..."
```

**Result:** Update `agents.md` to reflect new decision + create ADR explaining why.

---

## 7. Session Troubleshooting

### Problem: Agent forgets last session's decisions

**Prevention:**
1. Agent reads `ADR/` folder first
2. Agent reads last 5 commits
3. Agent confirms with human: "Is this the state you want me to start from?"

### Problem: Build breaks between sessions

**Recovery:**
1. Agent enters Self-Healing Mode (per `agents.md`)
2. Runs diagnostic: `npm install` → `npm run build` → `npm test`
3. Creates fix commit: `[fix] Repair broken build from Session X`
4. Reports root cause to human

### Problem: Architectural drift (decisions slowly violated)

**Detection:**
- Code review: Do new files violate layer boundaries?
- Dependency check: Any new packages? (should not be)
- ADR alignment: Are new features documented?

**Action:**
- Agent flags: "This feature introduces [pattern], which violates [decision]."
- Requests human decision: Proceed within bounds? Or request ADR override?

---

## 8. Checklist: Starting a New Day

Agent's mandatory first 3 minutes:

**ACTION 1: Read State File (30 seconds)**
```bash
if [ -f .session-state.json ]; then
  cat .session-state.json | jq .
  # Extract: previous_session, outstanding_tasks, blockers
else
  echo "First session - no prior state"
fi
```

**ACTION 2: Verify Locked Decisions (30 seconds)**
```bash
# Check agents.md exists and is unchanged
grep "MANDATORY" agents.md | head -5
# Check no forbidden packages
npm list | grep -E "express|prisma|typeorm" || echo "✓ Clean"
```

**ACTION 3: Health Check (90 seconds)**
```bash
npm install --quiet
npm run build 2>&1 | tail -5
npm test 2>&1 | tail -10
npm run db:migrate --quiet
```

**ACTION 4: Report to Human (30 seconds)**
```markdown
## 🔄 Daily Session Load Report

**Session ID:** 2025-02-24
**Loaded State From:** .session-state.json (updated 2025-02-23 13:45:00Z)

**Yesterday's Work:**
[Display work_completed section from JSON]

**Outstanding Tasks:**
[Display outstanding_tasks section from JSON]

**Blockers:**
[Display blockers section from JSON if any]

**Today's Plan:**
[Display next_session_plan.objectives from JSON]

**System Health:** ✓ All checks passing

**Ready to proceed?**
```

**Checklist:**
- [ ] Read `.session-state.json`
- [ ] Extract: previous work, outstanding tasks, blockers
- [ ] Verify locked decisions still locked
- [ ] Run: npm install + build + test
- [ ] Confirm: server starts
- [ ] Report to human with previous context + health status

---

## 9. Checklist: Ending Each Day

Agent's mandatory last 5 minutes:

**ACTION 1: Prepare Checkpoint Data (2 minutes)**
```bash
# Get commit history for today
git log --oneline $(git rev-parse HEAD~10)..HEAD | grep $(date +%Y-%m-%d)

# Get test results
npm test 2>&1 | grep -E "passed|failed"

# Get build status
npm run build 2>&1 | tail -3

# Get latest migration
ls -1 src/migrations/ | tail -1
```

**ACTION 2: Write .session-state.json (2 minutes)**
```bash
# Validate JSON
cat .session-state.json | jq . || echo "❌ Invalid JSON"

# Add to git (don't commit yet, will do with message)
git add .session-state.json
```

**ACTION 3: Generate Human-Readable Summary (1 minute)**
```markdown
## ✅ Daily Checkpoint: 2025-02-24

**Commits Completed:** [list from .session-state.json]
**Tests Passing:** [X/Y from npm test]
**Build Status:** ✓ All checks passing
**Database:** ✓ Migrations applied

**Tomorrow's Tasks:** [from .session-state.json]
**Blockers:** [if any]

**System Ready for Tomorrow:** ✓ Yes
```

**Checklist:**
- [ ] All commits have clear messages with date in them
- [ ] `.session-state.json` is valid JSON
- [ ] `npm test` passes (no red X marks)
- [ ] `npm run build` succeeds
- [ ] Migrations can be rolled back cleanly (if needed)
- [ ] Checkpoint summary generated
- [ ] Outstanding tasks listed
- [ ] Next session plan documented
- [ ] File committed: `git commit -am "[doc] Daily checkpoint 2025-02-24"`

---

## 10. Example: Full Daily Workflow

### Day 1 Morning (2025-02-23, 09:00)

**Human Input:**
```
Time to build the service backend!
Use agents.md specification.
This is a fresh project.
```

**Agent Action (First 3 minutes):**
```
[Reads agents.md - locked decisions]
[Checks: .session-state.json exists? NO (first session)]
[Runs: npm install, npm build, npm test]
[Report to human]
```

**Agent Output:**
```markdown
## 🚀 Session Start: 2025-02-23

**Status:** Fresh project, no prior state

**Locked Constraints Loaded:**
- Stack: Koa + Sequelize + PostgreSQL
- Architecture: 5-layer
- Auth: JWT only

**Today's Plan:**
1. Initialize project + dependencies
2. Setup PostgreSQL + Sequelize
3. Create User model + migrations
4. Implement AuthService (bcrypt + JWT)
5. Create /auth/register, /auth/login
6. Write auth tests

**Ready to proceed?**
```

**Human:** "Go"

**Agent:** [Implements auth module]

### Day 1 Afternoon (2025-02-23, 13:00)

**Agent Action (Last 5 minutes):**
```bash
# Gather work
git log --oneline HEAD~5..HEAD | grep "2025-02-23"
npm test
npm run build
cat > .session-state.json << EOF
{
  "session_id": "2025-02-23",
  "duration_minutes": 240,
  "timeline": {
    "started_at": "2025-02-23T09:00:00Z",
    "ended_at": "2025-02-23T13:00:00Z"
  },
  "work_completed": {
    "commits": [
      {"hash": "abc123", "message": "[feat][2025-02-23] User model + JWT"},
      {"hash": "def456", "message": "[feat][2025-02-23] Auth endpoints"},
      {"hash": "ghi789", "message": "[test][2025-02-23] Auth tests (6 passing)"}
    ],
    "features_added": ["User model", "bcrypt hashing", "JWT generation", "Auth endpoints"],
    "tests_added": ["auth.service.test.ts", "auth.integration.test.ts"]
  },
  "build_status": {
    "npm_install": "✓ passing",
    "npm_build": "✓ passing",
    "npm_test": "✓ 6/6 passing",
    "db_migrations": "✓ 20250223_001_create_users",
    "server_start": "✓ starts without crash"
  },
  "outstanding_tasks": [
    {"id": "task_001", "description": "Service CRUD", "status": "not_started", "priority": "must_have"}
  ],
  "blockers": [],
  "next_session_plan": {
    "session_date": "2025-02-24",
    "objectives": [
      "Create AppointmentService model",
      "Implement Service CRUD endpoints",
      "Write service integration tests"
    ],
    "prerequisites": ["npm install fresh", "psql running"],
    "estimated_duration_minutes": 240
  }
}
EOF

git add .session-state.json
git commit -am "[doc] Daily checkpoint 2025-02-23"
```

**Agent Output:**
```markdown
## ✅ Daily Checkpoint: 2025-02-23

**Duration:** 4 hours (09:00 - 13:00)

**Commits Completed:**
- abc123 [feat][2025-02-23] User model + JWT
- def456 [feat][2025-02-23] Auth endpoints
- ghi789 [test][2025-02-23] Auth tests (6 passing)

**What's New:**
✓ User model with bcrypt password hashing
✓ JWT authentication implemented
✓ /auth/register, /auth/login endpoints
✓ 6 integration tests passing

**Build Health:**
✓ npm install: OK
✓ npm build: OK
✓ npm test: 6/6 passing
✓ Database: User migration applied
✓ Server: Starts successfully

**Architecture Integrity:**
✓ Stack unchanged (Koa + Sequelize + PostgreSQL)
✓ Layer boundaries respected
✓ No forbidden patterns detected

**State saved to:** .session-state.json

**Tomorrow (2025-02-24):**
- Goal: Service CRUD endpoints
- Estimated: 4 hours
- Prerequisites: Fresh npm install, PostgreSQL running
```

---

### Day 2 Morning (2025-02-24, 09:00)

**Human Input:** (not needed - AI loads state)
```
Continue with Day 2 work
```

**Agent Action (First 3 minutes):**
```bash
# Read state from yesterday
cat .session-state.json | jq '.work_completed, .outstanding_tasks'

# Verify nothing broke
npm install --quiet
npm test
npm run build

# Confirm health
npm run db:migrate --quiet
```

**Agent Output:**
```markdown
## 🔄 Daily Session Load: 2025-02-24

### Previous Session State (from .session-state.json)

**Last Active:** 2025-02-23 13:00:00Z
**Last Commit:** ghi789 [test][2025-02-23] Auth tests complete

**Yesterday's Work:**
✓ User model + bcrypt
✓ JWT authentication
✓ Auth endpoints (/register, /login)
✓ 6 integration tests

### Outstanding Tasks
- [ ] Service CRUD (must_have)
- [ ] Service integration tests (must_have)

### Health Check
✓ Build: npm install + build passing
✓ Tests: 6/6 auth tests still passing
✓ DB: Latest migration applied (users table)
✓ Server: Starts without crash

### Locked Constraints Verified
✓ Stack: Koa + Sequelize + PostgreSQL unchanged
✓ Architecture: 5-layer boundaries intact
✓ Forbidden patterns: None detected

### Today's Plan (from yesterday's outstanding_tasks)
1. Create AppointmentService model
2. Build Service repository + service layer
3. Implement CRUD endpoints
4. Write integration tests

**Ready to proceed?**
```

**Human:** "Go"

**Agent:** [Implements Service CRUD]

### Day 2 Afternoon (2025-02-24, 13:00)

**Agent Action (Last 5 minutes):**
```bash
# Update .session-state.json with Day 2 progress
# Same process as Day 1, but now:
# - Previous session: 2025-02-23
# - New commits: 4d5e6f7, 5e6f7g8, etc.
# - New tests: 18/18 passing (12 new service tests)
# - Outstanding: Polish + docs
```

**Agent Output:**
```markdown
## ✅ Daily Checkpoint: 2025-02-24

**Duration:** 4 hours

**Commits Completed:**
- 1a2b3c4 [feat][2025-02-24] Service model + migrations
- 2b3c4d5 [feat][2025-02-24] Service repository
- 3c4d5e6 [feat][2025-02-24] Service CRUD endpoints
- 4d5e6f7 [test][2025-02-24] Service integration tests

**What's New:**
✓ AppointmentService model with all fields
✓ ServiceRepository with soft-delete filtering
✓ CRUD endpoints (GET /services, POST, PUT, DELETE)
✓ 12 new service tests (18/18 total passing)

**Architecture Integrity:** ✓ All checks passing

**State saved to:** .session-state.json

**Tomorrow (2025-02-25):**
- Goal: Polish + documentation
- Estimated: 2 hours
- Tasks: Rate limiting, logging, README, Postman collection
```

---

### Day 3 Morning (2025-02-25, 09:00)

**Agent automatically loads Day 2 state from .session-state.json**

**Agent Output:**
```markdown
## 🔄 Daily Session Load: 2025-02-25

### 2-Day Progress Summary

**Session 1 (2025-02-23):** Auth module complete (6 tests)
**Session 2 (2025-02-24):** Service CRUD complete (18 tests)

**Outstanding:** Polish + documentation

**Today's Objectives:**
- Rate limiting middleware
- Comprehensive error logging
- Complete README + Postman collection
```

**Result:** Project shipped with full documentation

---

## Appendix: AI Response Templates

### Template 1: Session Start (Using SESSION_STATE.json)

```markdown
## 🔄 Daily Session Load: [DATE]

### Previous Session State (from .session-state.json)

**Last Session:** [previous_date]
**Last Commit:** [hash] [message]
**Session Duration:** [X hours]

**Work Completed Yesterday:**
- Feature 1 (commit A)
- Feature 2 (commit B)
- Tests: [X/Y passing]

### Outstanding Tasks

| Task | Status | Priority | Note |
|------|--------|----------|------|
| [Task A] | [not_started/in_progress/blocked] | [must_have/nice_to_have] | [blocker note if blocked] |
| [Task B] | [status] | [priority] | |

### System Health Check

| Check | Status | Detail |
|-------|--------|--------|
| npm install | ✓ | dependencies resolved |
| npm build | ✓ | TypeScript compiled |
| npm test | ✓ | X/Y passing |
| DB Migrations | ✓ | Latest: migration_YYYYMMDD_NNN |
| Server Start | ✓ | Responds to health check |

### Locked Architecture Verified

- ✓ Stack: Koa + Sequelize + PostgreSQL
- ✓ Pattern: 5-layer (controller/service/repository/model/middleware)
- ✓ Auth: JWT only
- ✓ Forbidden: No microservices, DDD, CQRS, refresh tokens
- ✓ New packages: None added

### Today's Objectives (from next_session_plan)

1. [Objective A]
2. [Objective B]
3. [Objective C]

### Blockers to Address

[List any blockers from .session-state.json]

**Ready to proceed?**
```

### Template 2: Daily Checkpoint (Writing SESSION_STATE.json)

```markdown
## ✅ Daily Checkpoint: [DATE]

**Session Duration:** [X hours]
**Commits Count:** [N]

### Work Completed

| Commit | Message | Impact |
|--------|---------|--------|
| [hash] | [message] | [feature/test/fix] |

**Features Added:**
- Feature 1
- Feature 2

**Tests Added:**
- test file 1 (X test cases)
- test file 2 (Y test cases)

### Build & Test Status

| Check | Status | Detail |
|-------|--------|--------|
| npm install | ✓ | [timing] |
| npm build | ✓ | 0 errors, 0 warnings |
| npm test | ✓ | X/Y passing |
| DB Migrations | ✓ | Applied up to migration_YYYYMMDD_NNN |
| Server Start | ✓ | Listens on port 3000 |

### Architecture Health

- ✓ Locked decisions maintained
- ✓ No new packages introduced
- ✓ No forbidden patterns detected
- ✓ Layer boundaries respected
- ✓ Schema changes documented

### Tomorrow's Focus

**Session Date:** [NEXT_DATE]
**Estimated Duration:** [X hours]

**Planned Objectives:**
1. [Objective A]
2. [Objective B]

**Prerequisites for Tomorrow:**
- [ ] Latest code in main branch
- [ ] PostgreSQL running
- [ ] Fresh npm install if needed

### State Saved

**File:** `.session-state.json`
**Commit:** `[date] [doc] Daily checkpoint [DATE]`

**Next session will automatically load this state.**
```

### Template 3: Blocker Report (When Blocked)

```markdown
## ⚠️ Session Blocker Report: [DATE]

**Status:** Blocked

**Blocker ID:** blocker_001
**Description:** [What's blocking?]
**Affected Tasks:** [task_001, task_002]
**Requires Human Decision:** Yes

**Question:**
[The specific question needing human input]

**Options:**
A) [Option A + consequence]
B) [Option B + consequence]

**Recommendation:** Option [X]
**Rationale:** [why]

**State Saved:**
- `.session-state.json` has this blocker documented
- Checkpoint committed with status: "BLOCKED"

**Next Steps:**
Once you decide, I'll update `.session-state.json` and resume.
```

---

## Summary

**This protocol ensures (DAILY):**

1. **Continuity Across Days** - Agent loads yesterday's state from `.session-state.json`
2. **No Context Loss** - Outstanding tasks, blockers, and progress are explicit
3. **Architecture Integrity** - Locked decisions verified each morning
4. **Efficient Onboarding** - New day starts with 3-minute status report, not 30-minute briefing
5. **Audit Trail** - Every day's work is documented in `.session-state.json`

**Workflow:**

```
📅 Day 1 Morning: Agent reads agents.md (fresh project) → Work → Checkpoint (write .session-state.json)
📅 Day 2 Morning: Agent reads .session-state.json (load context) → Verify health → Work → Checkpoint
📅 Day 3 Morning: Agent reads .session-state.json (load 2 days of context) → Verify health → Work → Checkpoint
```

**Files Required:**

| File | Purpose | Created By | Read By |
|------|---------|-----------|---------|
| `agents.md` | Locked constraints (immutable) | You | Agent (session start) |
| `ARCHITECTURE.md` | Design rationale (optional) | You | Agent (reference) |
| `.session-state.json` | Daily progress + outstanding tasks | Agent (EOD) | Agent (session start) |
| `.env.example` | Environment variables | You | Agent (setup) |
| `ADR/` folder | Architecture decisions (optional) | You/Agent | Agent (reference) |

**Minimal Setup:**
- ✓ `agents.md` (required)
- ✓ `.session-state.json` (auto-generated daily)
- That's it. Optional: add ARCHITECTURE.md and ADR/ as you go.

**Use in Practice:**

1. **Day 1:** Create project. Agent writes `.session-state.json` at end of day.
2. **Day 2+:** Agent automatically loads `.session-state.json` at start. No human briefing needed.
3. **Blockers:** Agent documents in `.session-state.json`. Human decides. Agent resumes.
4. **Multi-week Projects:** .session-state.json becomes the "memory" across sessions.

**Key Insight:**

`.session-state.json` is the **single source of truth** for:
- What was done
- What's outstanding
- What's blocked
- What's next

Agent reads it first. Human doesn't need to repeat context. Team works continuously.
