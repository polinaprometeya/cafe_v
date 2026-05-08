---
name: Revised last-week plan (realistic scope)
overview: "Finish a reduced-scope café system in the final week. Prioritize: 1 Sanctum-protected endpoint + 1 automated test, complete the Reservation flow (not full CRUD), add a manual reservation endpoint for staff, add logging, and map existing code to the original 6-week learning plan. Skip MongoDB."
todos:
  - id: sanctum-protected-endpoint
    content: "Make exactly 1 API endpoint Sanctum-protected (and prove it)."
    status: pending
  - id: automated-test
    content: "Add 1 Laravel Feature test that asserts the endpoint is protected + works when authenticated."
    status: pending
  - id: reservation-complete
    content: "Complete Reservation flow end-to-end (hold → create), plus add staff 'manual reservation' endpoint. No full CRUD."
    status: pending
  - id: logging
    content: "Add a small, visible API log for manual reservations + auth events (file log, no MongoDB)."
    status: pending
  - id: token-expiry-check
    content: "Verify whether Sanctum bearer tokens expire in this setup; document result + decision."
    status: pending
  - id: plan-mapping
    content: "Go through code and annotate which parts fulfill which 6-week-plan items (partial CRUD is OK)."
    status: pending
isProject: false
---

## Reality check (what exists today)

### Backend (Laravel) — already present
- **Auth (Sanctum-style tokens)**: `AuthController@login` issues a token via `$user->createToken(...)->plainTextToken` and returns it.
- **Protected endpoints already exist** (partial):
  - `GET /api/user` is protected via `auth:sanctum`.
  - `POST /api/logout` is protected via `auth:sanctum`.
  - `ReservationController` protects `index/show/update/destroy` via `auth:sanctum` (but `show/update/destroy` are currently not implemented).
- **Reservation “hold” system**:
  - `POST /api/reservation-holds` calls stored procedure `sp_create_hold(...)` and returns `hold_id` + expiry.
  - `DELETE /api/reservation-holds/{hold}` releases a hold.
- **Reservation create**:
  - `POST /api/reservation` creates a reservation via `ReservationService::create()` with overlap checking.
- **Menu read-only**:
  - `GET /api/category` returns categories and menu items via `CategoryResource`.
- **Tests exist**, but they are mostly template/auth scaffolding; no reservation/auth API feature tests yet.
- **Logging**: Laravel logging is configured, but there’s no dedicated “reservation/manual booking” log event yet.

### Web (React SPA) — already present
- Reservation UI uses **availability → hold → create** calls in `WEB/web_cafe_v/src/service/routes.js`.
- Token header support exists in `WEB/web_cafe_v/src/service/api.js`.

### Mobile (Expo) — already present
- Login screen exists and stores a token (via `AuthProvider` + token storage).
- Menu loading exists; reservation UI is still minimal.

---

## “Last week” priorities (do these in order)

### 1) One Sanctum-protected endpoint (required)
**Goal:** A clear, demo-able proof of Sanctum protection.

- Choose **exactly one** endpoint to protect as the “deliverable endpoint”.
  - Recommended: `GET /api/reservation` (staff list).
- Make it return **401** without a token and **200** with a token.

**Definition of done**
- Postman/curl proof:
  - no `Authorization` header → 401
  - `Authorization: Bearer <token>` → 200

---

### 2) One automated Laravel Feature test (required)
**Goal:** Show Softwaretest coverage even with reduced scope.

- Add `tests/Feature/Api/ReservationAuthTest.php` (or similar):
  - unauthenticated request gets 401
  - authenticated request gets 200 (or expected response shape)

**Definition of done**
- `php artisan test` passes locally.

---

### 3) Reservation “complete” (but NOT full CRUD)
**Goal:** Reservation works reliably end-to-end for your demo scope.

Keep these as the customer-facing flow:
- **availability**: `POST /api/tables/availability` (public)
- **hold**: `POST /api/reservation-holds` (public)
- **create reservation**: `POST /api/reservation` (public or protected — pick one and document it)

**Cleanups that count as “complete”**
- Ensure clear JSON error messages for overlap/unavailable tables (422).
- Confirm hold expiry and release behavior (204 on success; 404 treated as “already released” in web).

---

### 4) Manual reservation endpoint for backend (staff)
**Goal:** A staff-only endpoint that creates a reservation without using the hold flow.

- Add endpoint (example):
  - `POST /api/reservations/manual`
  - Protected with `auth:sanctum`
- It should:
  - validate payload
  - create reservation (reuse `ReservationService`)
  - log the action (next section)

**Definition of done**
- Works in Postman with Bearer token.

---

### 5) Add a log (no MongoDB)
**Goal:** Evidence of “audit trail” without building MongoDB.

- Add `Log::info('manual_reservation_created', [...context...])` in the manual endpoint:
  - reservation id
  - authenticated user id/email
  - table ids + time window

**Definition of done**
- You can show the log line in `storage/logs/laravel.log` after a manual reservation call.

---

### 6) Double-check token expiry
**What to verify**
- Tokens are created via `createToken(...)`.
- If you have no Sanctum expiration configured, **tokens generally don’t expire automatically** (they remain valid until revoked/deleted).

**Deliverable**
- A short note:
  - “Tokens expire: yes/no”
  - If “no”: what your mitigation is (logout deletes current token; optionally add pruning later)

---

## Mapping: where you already fulfill parts of the original 6-week plan

### Week 2 — Laravel REST API (Core)
- **CRUD API (partial)**:
  - `GET /api/category` exists (Menu read-only)
  - `POST /api/reservation` exists (Reservation create)
  - Holds exist as a “custom booking primitive” (`/api/reservation-holds`)
- **Sanctum auth**:
  - `POST /api/login` returns a bearer token
  - `POST /api/logout` is protected and revokes the token

### Week 4 — Security & API Hardening
- **Input validation**:
  - `ReservationRequest` exists and is used for create + hold.
- **Rate limiting**:
  - Booking endpoints are throttled.

### Week 3 — React SPA (Client-Side)
- **Reservation flow**:
  - Web calls: availability → hold → create implemented in `WEB/web_cafe_v`.

### Week 5 — Expo app
- **Auth/token storage**:
  - App login + token storage exists (foundation in place).

### Week 1 — MongoDB / 20+ entities
- Not completed; explicitly **skipped** in reduced scope.

---

## Explicit scope statement (so you can defend it)
- I am **not** implementing full CRUD across all areas.
- Each area demonstrates **a subset of CRUD** (e.g. Menu = R, Reservations = C + custom “hold” + staff manual create).
- Deliverables focus on **integration + one protected endpoint + one automated test** rather than breadth.

