---
name: Revised 3-week plan
overview: "One week is completed. Finish the reduced-scope cafe system in the remaining 3 weeks: backend hardening + auth enforcement, web SPA login/protected reservation UX, mobile reservation flow, and final testing/security/database documentation."
todos:
  - id: backend-foundation
    content: Confirm backend foundation as done and harden it (auth middleware, validation, stored-procedure usage, route cleanup).
    status: completed
  - id: web-spa
    content: Finalize login + token handling + protected routes; connect existing reservation flow to authenticated endpoints in `WEB/web_cafe_v`.
    status: in_progress
  - id: expo-app
    content: Build login + SecureStore token + reservations CRUD tab in `APP/app_cafe_v`.
    status: pending
  - id: tests-security-dbdocs
    content: Produce test plan + automated tests + load test + OWASP ZAP scan; write ORM + MongoDB comparison with benchmarks and ≥20-entity domain model doc.
    status: pending
isProject: false
---

## Completed in passed week (baseline achieved)
**Subject:** Serversideprogrammering (16477) + Databaseprogrammering (16474)

### What appears done already
- Reservations endpoints and controller exist in the API.
- Menu category endpoint is available and used as read-only data source.
- Web has a working reservation flow (including hold/create flow).
- Core DB artifacts (migrations/seeders/models) are present and runnable.

### Close-out checks (carry into Week 1 below)
- Enforce `auth:sanctum` on reservation write operations (leave menu read-only public).
- Verify reservation validation/authorization edge cases.
- Ensure DB-level overlap protection remains authoritative.

### Outcome
- Treat this week as completed progress and use it as foundation for the final 3-week push.

---

## Week 4 (remaining) — Backend hardening + web auth integration
**Subject:** Clientsideprogrammering (16476)

### Goals
- Harden backend auth + route protection.
- Finish web login/token flow and connect it to existing reservation UX.
- Ensure reservation writes are authenticated end-to-end.

### Tasks
- Backend hardening
  - Apply `auth:sanctum` to reservation create/update/delete and keep `GET /api/category` public.
  - Clean up/disable any API routes not used in current scope.
  - Add/confirm consistent API error responses for auth and validation failures.
- Web auth UI + token handling
  - Add login page.
  - Store Sanctum token and attach `Authorization: Bearer <token>` to requests.
  - Guard reservation routes/pages unless logged in.
- Web reservation integration polish
  - Reuse the existing reservation flow and ensure payloads/paths fully match the API.
  - Add edit/cancel UI where missing.
  - Loading and error states.
  - Simple client-side form validation + server validation messages.

### Deliverable
- Postman + web demo: login -> token -> create/edit/cancel reservation -> logout.
- Short verification note showing protected routes reject unauthenticated requests.

---

## Week 5 (remaining) — Expo app reservations CRUD + login (API <-> UI)
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

## Week 6 (remaining) — Testing + security + ORM documentation (finish strong)
**Subject:** Softwaretest og -sikkerhed (16484) + Databaseprogrammering (16474)

### Goals
- Produce a **test plan** and enough automated/scripted tests to justify "release ready".
- Show security awareness: hashing, auth, OWASP risks, SQLi/XSS mitigations.
- Document ORM usage with real query examples.
- If time permits: add a small MongoDB component + comparison.

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
- Optional MongoDB (only if core deliverables are done)
  - Add a tiny MongoDB use-case (e.g. `activity_logs`) and write a short pros/cons comparison with one simple benchmark.

### Deliverable
- Test plan + test results summary.
- Security scan report summary (before/after if possible).
- Load test summary (numbers + short bottleneck notes).
- ORM documentation section (query examples + what they prove).

