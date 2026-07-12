# TransitOps API Tracker

Update the **Status** column as you build/test each one. Suggested values:
`⬜ Not started` · `🟨 In progress` · `✅ Working` · `🔴 Broken`

Test everything through `/admin/` first to seed data, then hit these with
Postman/curl. Auth endpoints must work before anything else can be tested
(every other route needs a Bearer token).

---

## Auth

| Method | Endpoint | Purpose | Owner | Status |
|---|---|---|---|---|
| POST | `/api/auth/login/` | Login, returns JWT with `role` claim | | ⬜ |
| POST | `/api/auth/refresh/` | Refresh access token | | ⬜ |
| POST | `/api/auth/google/` | Google Sign-In (verifies id_token, issues our JWT) | | ⬜ |

**Test:** wrong password 5x in a row → should return `"account locked after 5 failed attempts"` on the 6th try even with the *correct* password.

---

## Fleet (`fleet`)

| Method | Endpoint | Purpose | Owner | Status |
|---|---|---|---|---|
| GET | `/api/fleet/vehicles/` | List vehicles (filter: `?status=&vehicle_type=&region=`) | | ⬜ |
| POST | `/api/fleet/vehicles/` | Create vehicle | | ⬜ |
| GET | `/api/fleet/vehicles/{id}/` | Vehicle detail | | ⬜ |
| PATCH | `/api/fleet/vehicles/{id}/` | Update vehicle | | ⬜ |
| DELETE | `/api/fleet/vehicles/{id}/` | Soft delete | | ⬜ |

**Test:** duplicate `registration_number` → must reject. Vehicle with status `In Shop`/`Retired` must **not** appear when Trips module fetches dispatchable vehicles.

---

## Drivers (`drivers`)

| Method | Endpoint | Purpose | Owner | Status |
|---|---|---|---|---|
| GET | `/api/drivers/` | List drivers (filter: `?status=`) | | ⬜ |
| POST | `/api/drivers/` | Create driver | | ⬜ |
| GET | `/api/drivers/{id}/` | Driver detail | | ⬜ |
| PATCH | `/api/drivers/{id}/` | Update driver | | ⬜ |
| DELETE | `/api/drivers/{id}/` | Soft delete | | ⬜ |

**Test:** driver with `license_expiry_date` in the past, or `status=Suspended` → must be rejected by Trip creation.

---

## Trips (`trips`) — highest priority, test thoroughly

| Method | Endpoint | Purpose | Owner | Status |
|---|---|---|---|---|
| GET | `/api/trips/` | List trips (filter: `?status=`) | | ⬜ |
| POST | `/api/trips/` | Create trip (Draft) | | ⬜ |
| GET | `/api/trips/{id}/` | Trip detail | | ⬜ |
| POST | `/api/trips/{id}/dispatch/` | Draft → Dispatched, locks vehicle+driver | | ⬜ |
| POST | `/api/trips/{id}/complete/` | → Completed, frees vehicle+driver | | ⬜ |
| POST | `/api/trips/{id}/cancel/` | Dispatched/In-Transit → Cancelled, frees both | | ⬜ |

**Test checklist:**
- [ ] Cargo weight > vehicle capacity → exact 3-line error array
- [ ] Assign a vehicle already `On Trip` → rejected
- [ ] Assign a suspended driver → rejected
- [ ] Dispatch → vehicle & driver flip to `On Trip`
- [ ] Complete → vehicle & driver flip back to `Available`, odometer updates
- [ ] Cancel a dispatched trip → both flip back to `Available`
- [ ] Try to jump Draft → Completed directly → must fail (FSM blocks it)

---

## Maintenance (`maintenance`)

| Method | Endpoint | Purpose | Owner | Status |
|---|---|---|---|---|
| GET | `/api/maintenance/` | List records (filter: `?status=&vehicle=`) | | ⬜ |
| POST | `/api/maintenance/` | Create record | | ⬜ |
| PATCH | `/api/maintenance/{id}/` | Update / close record | | ⬜ |

**Test:** create record with `status=Active` → vehicle flips to `In Shop` automatically. `status=Closed` → vehicle flips back to `Available` (unless Retired).

---

## Finance (`finance`)

| Method | Endpoint | Purpose | Owner | Status |
|---|---|---|---|---|
| GET | `/api/finance/fuel-logs/` | List fuel logs (filter: `?vehicle=`) | | ⬜ |
| POST | `/api/finance/fuel-logs/` | Log fuel | | ⬜ |
| GET | `/api/finance/expenses/` | List expenses (filter: `?vehicle=&trip=&status=`) | | ⬜ |
| POST | `/api/finance/expenses/` | Log expense | | ⬜ |

**Test:** expense linked to a `Cancelled` trip → must reject.

---

## Analytics / Dashboard (`analytics`)

| Method | Endpoint | Purpose | Owner | Status |
|---|---|---|---|---|
| GET | `/api/analytics/dashboard/` | 7 KPI cards, cached 60s | | ⬜ |
| GET | `/api/analytics/recent-trips/` | Last 4 trips w/ ETA | | ⬜ |
| GET | `/api/analytics/reports/` | Fuel efficiency, utilization %, cost, redundancy | | ⬜ |

**Test:** dispatch a trip, then immediately GET `/dashboard/` — numbers should update within 60s (cache TTL). Reduce `CACHE_TTL_SECONDS` to 5 during dev if this is annoying to test.

---

## RBAC cross-check (run once per role)

Log in as each of the 4 roles and confirm access matches the matrix:

| Role | Fleet | Drivers | Trips | Fuel/Exp | Analytics |
|---|---|---|---|---|---|
| Fleet Manager | Full | Full | None | None | Full |
| Dispatcher | Read | None | Full | None | None |
| Safety Officer | None | Full | Read | None | None |
| Financial Analyst | Read | None | None | Full | Full |

A "None" module hit with any method should return `403`. A "Read" module hit with POST/PATCH/DELETE should also return `403`.
