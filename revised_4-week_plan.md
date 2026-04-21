---
name: Revised 4-week plan
overview: "Finish a reduced-scope café system in 4 weeks: Menu = read-only; Reservations = full CRUD; Auth = Sanctum tokens for WEB SPA + Expo app; plus the required DB/ORM + MongoDB comparison and a concrete testing/security deliverable set."
todos:
  - id: backend-foundation
    content: Make migrations/seeders/models consistent; implement Sanctum auth + reservations CRUD API; keep menu read-only stable.
    status: pending
  - id: web-spa
    content: Add login + token handling + protected routes; implement reservations CRUD UI in `WEB/web_cafe_v`.
    status: pending
  - id: expo-app
    content: Add login + SecureStore token + reservations CRUD tab in `APP/app_cafe_v`.
    status: pending
  - id: tests-security-dbdocs
    content: Produce test plan + automated tests + load test + OWASP ZAP scan; write ORM + MongoDB comparison with benchmarks and ≥20-entity domain model doc.
    status: pending
isProject: false
---

## Week 3 — Backend API + database foundation (now)
**Subject:** Serversideprogrammering (16477) + Databaseprogrammering (16474)

### Goals
- Stabilize MySQL schema (migrations + seeders) so the system runs end-to-end.
- Build a working Laravel API for **Reservations (full CRUD)**.
- Add **login/auth for API clients** using **Laravel Sanctum**.
- Keep **Menu as read-only** (use the already-working category-based endpoint).
- Implement a **stored procedure for Reservations** (atomic booking / overlap check).

### Tasks
- Fix DB layer to a working minimum
  - Make `tables` + `reservations` schema consistent and migratable.
  - Fix `Reservation` ↔ `Table` relations to match columns (`table_id` etc.).
  - Ensure seeders/factories run cleanly.
- Reservations API (CRUD) + validation
  - Register reservations routes in `routes/api.php`.
  - Implement controller methods + FormRequest validation.
  - Return clean JSON via `ReservationResource`.
- Auth for API consumers (Sanctum)
  - Install/config Sanctum and add `POST /api/auth/login` + `POST /api/auth/logout`.
  - Protect reservation routes with `auth:sanctum` (Menu stays public).
- Menu read-only
  - Keep “read by category” working (`GET /api/category`).
  - Disable/remove unused write routes for menu if they exist, or leave them unimplemented but unused.
- Stored procedure (MySQL)
  - Create a procedure (e.g. `sp_create_reservation`) that:
    - checks table availability (time overlap),
    - runs atomically in a transaction,
    - returns the created reservation id or an error.
  - Add the supporting index for the overlap check (e.g. `(table_id, start_at, end_at)`).

### Deliverable
- Working DB: migrations + seeders run successfully.
- Postman demo: login → token → reservation CRUD → logout.
- Stored procedure SQL file + 2 example `CALL ...` examples (success + “not available”).

---

## Week 4 — Web SPA (React) reservations CRUD + login
**Subject:** Clientsideprogrammering (16476)

### Goals
- Finish `WEB/web_cafe_v` as the main web UI.
- Implement **login** and **protected routes**.
- Implement **Reservations full CRUD** through the UI.
- Keep **Menu read-only** (already implemented).

### Tasks
- Auth UI + token handling
  - Add login page.
  - Store Sanctum token and attach `Authorization: Bearer <token>` to requests.
  - Guard reservation routes/pages unless logged in.
- Reservation UI
  - Replace placeholder reservation page with:
    - list “My reservations”
    - create reservation form
    - edit reservation
    - delete/cancel reservation
  - Align API paths and payloads to the Laravel API (remove any mismatched `'/Reservation/addReservation'` style routes).
- UX basics
  - Loading and error states.
  - Simple client-side form validation + server validation messages.

### Deliverable
- Web demo script: login → create reservation → edit → delete → logout.
- Screenshots (or short notes) showing the flow works against real API data.

---

## Week 5 — Expo app reservations CRUD + login (API ↔ UI)
**Subject:** App 2 (6239 IT-kravsspecifikation)

### Goals
- Build the mobile reservation feature so the app can **send/receive data** via the API.
- Add **login** and secure token storage.
- Implement **Reservations full CRUD** on mobile.
- Keep **Menu read-only** (already implemented).

### Tasks
- Auth + token storage
  - Add login screen/flow.
  - Store token in SecureStore.
  - Add Authorization header to API calls.
- Reservation tab implementation
  - Replace the current template tab with:
    - list “My reservations”
    - create
    - edit
    - delete/cancel
- Basic UX
  - Loading/error states.
  - Confirm delete.

### Deliverable
- App demo script: login → reservations CRUD → logout.
- Short explanation of how data flows: UI → API request → JSON response → UI update.

---

## Week 6 — Testing + security + ORM documentation (finish strong)
**Subject:** Softwaretest og -sikkerhed (16484) + Databaseprogrammering (16474)

### Goals
- Produce a **test plan** and enough automated/scripted tests to justify “release ready”.
- Show security awareness: hashing, auth, OWASP risks, SQLi/XSS mitigations.
- Document ORM usage with real query examples.
- Not going to have time but maybe: add a small MongoDB component + comparison.

### Tasks
- Testing
  - Write a test plan (functional + security + performance + UX).
  - Add backend feature tests for: auth + reservations CRUD.
  - Add 2–3 web UI tests (React Testing Library) for key flows.
  - Write 1 scripted manual test (web or app) with expected results.
- Security
  - Document hashing (bcrypt vs MD5), SSL/HTTPS notes, SQL injection + XSS protections.
  - Run a security scan (OWASP ZAP) and summarize findings + fixes/mitigations.
  - Add rate limiting on login and basic authorization checks on reservations.
- Performance
  - Run 1 load test (k6 or JMeter) on key endpoints (login + reservations list).
  - Record latency/throughput and note any bottlenecks.
- ORM (Eloquent)
  - Provide ORM query examples: eager loading, aggregations, constraints/validation.
- Not going to have time but maybe: MongoDB
  - Add a tiny MongoDB use-case (e.g. `activity_logs`) and write a short pros/cons comparison with one simple benchmark.

### Deliverable
- Test plan + test results summary.
- Security scan report summary (before/after if possible).
- Load test summary (numbers + short bottleneck notes).
- ORM documentation section (query examples + what they prove).

