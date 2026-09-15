# Test Report

Verification performed against a locally running backend (`http://localhost:4000`) with MongoDB
seeded via `backend/src/seed/seed.js`, the React web app (`npm run dev`), and the Flutter app run
via `flutter run -d web-server` (see the Flutter/mobile note below).

## Section 11 Checks (Master Prompt)

| # | Check | Result | Notes |
|---|---|---|---|
| 1 | Seed script runs cleanly, populates all collections | **PASS** | `npm run seed` produced 6 items, 4 markets, 1 admin, 2 traders, 18 approved / 2 pending / 1 rejected entries, no errors. Re-run multiple times during testing with consistent results. |
| 2 | Visitor can browse Category -> Item -> current prices -> price history without auth, never sees pending/rejected | **PASS** | Verified in browser (React) and via `curl`: `GET /api/prices` and `/api/prices/history` only ever return `status: "approved"` documents. Confirmed a rejected entry (Cattle @ Baidoa, price 900) never appears in either endpoint. |
| 3 | Trader can sign up, log in, submit a price, see it as "pending", confirm absent from public view | **PASS** | Signed up a new trader in the browser, submitted a Camel @ Baidoa entry, confirmed it appeared as "pending" in My Submissions and was absent from `GET /api/prices?item=<camel>` until approved. |
| 4 | Admin can log in, see the pending entry, approve it, confirm public visibility + Trader sees "approved" | **PASS** | Approved the entry from check 3 via the Admin Pending Queue UI; it immediately appeared in the public current-prices table and as "approved" in the trader's My Submissions. |
| 5 | Admin can reject an entry, confirm never public + Trader sees "rejected" | **PASS** | Rejected a Maize @ Kismayo entry; confirmed absent from `/api/prices` and shown as "rejected" via `GET /api/price-entries/mine` for that trader. |
| 6 | Admin can add a new Item and Market, confirm they appear in Trader's submission form | **PASS** | Added "Donkey" (Livestock) via Admin -> Manage Items & Markets; confirmed it appeared immediately in `GET /api/items` and in the Trader's item dropdown (web and Flutter). Deleted it afterward and confirmed removal + cascade delete of dependent price entries. |
| 7 | No JWT on Trader route -> 401; Trader JWT on Admin route -> 403 | **PASS** | `GET /api/price-entries/mine` with no `Authorization` header returned 401. `GET /api/admin/price-entries` with a trader's JWT returned 403. Admin JWT on the same admin route returned 200. |
| 8 | Negative price / missing item or market -> validation error, not a crash | **PASS** | Negative price -> 400 `{"error":"price must be a non-negative number"}`. Missing market -> 400. Nonexistent item id -> 400. Malformed entry id on admin PATCH -> 400. Server stayed up throughout (confirmed via `/api/health` after each). |
| 9 | Flutter app completes full Visitor and Trader flows against the same local backend | **PASS (web target)** | See "Flutter / Mobile Verification" below. |
| 10 | No marketplace/buying/selling/payments/SMS/image-upload code anywhere | **PASS** | See "Out-of-Scope Compliance" below. |

## Additional Security Checks

| Check | Result |
|---|---|
| Invalid/garbage JWT rejected | 401 |
| Client-supplied `role: "admin"` on signup forced to `"trader"` server-side | Confirmed |
| Client-supplied `status: "approved"` and spoofed `submittedBy` on price entry submission ignored; server sets `status: "pending"` and the real authenticated user id | Confirmed |
| Duplicate email on signup | 409 |
| Wrong password on login | 401 |
| Passwords never returned in any API response (checked signup/login/admin list responses) | Confirmed — only `passwordHash` field name exists on the model and it is never serialized in route responses |

## Out-of-Scope Compliance

Searched `backend/src`, `web/src`, and `mobile/lib` (excluding `node_modules`/build output) for:
`cloudinary`, `marketplace`, `payment`, `stripe`, `paypal`, `sms`, `twilio`, `multer`,
`image upload`, and any public admin-signup route.

**Result: no matches** except a single legitimate reference in `web/src/pages/Login.jsx`
(`role !== 'admin'`), which is the guard that *hides* the trader sign-up link on the Admin
login screen — i.e., code that actively prevents an out-of-scope feature, not an instance of one.
Dependency manifests (`backend/package.json`, `web/package.json`, `mobile/pubspec.yaml`) contain
no payment, SMS, or image-upload libraries.

## Flutter / Mobile Verification

No Android/iOS emulator and no Visual Studio (required for Windows desktop Flutter builds) were
available in this environment (`flutter doctor` confirms `Android toolchain` is otherwise fine,
but no AVD images are configured, and `flutter emulators` returns no results). This is a local
environment limitation, not a code limitation.

The strongest available verification method was used: `flutter run -d web-server`, which compiles
and runs the actual Flutter application (not a mock), served over HTTP and driven through the same
in-app browser automation used for the React app. `flutter analyze` also reports **no issues found**.

Verified interactively:
- Home screen renders both categories
- Category -> Item List filtering (Livestock items only)
- Item -> current approved prices table, sourced live from the backend
- Tapping a market renders the price-history line chart (`fl_chart`) with real seeded trend data
- Trader login (existing seeded account) redirects to the Submit screen on success
- Item/Market dropdowns on the Submit screen are populated live from `GET /api/items` and
  `GET /api/markets`
- Submitting a new price entry succeeds and shows the "pending admin approval" confirmation
- My Submissions screen lists the new entry as "pending" alongside prior approved/rejected
  entries with correctly colored status chips

**Limitation to disclose**: this confirms the Flutter code path against the backend on the web
target; a native Android/iOS device/emulator run was not performed in this environment. The
`10.0.2.2` emulator-vs-localhost handling in `lib/api/api_config.dart` is implemented per Flutter's
documented Android-emulator networking behavior but was not exercised on an actual emulator.

## Cross-Platform Consistency

Both React and Flutter call the identical backend REST API (`/api/items`, `/api/markets`,
`/api/prices`, `/api/prices/history`, `/api/auth/*`, `/api/price-entries*`) with no duplicated
business logic in either client. Verified the same seeded data (current prices, price history
points, pending/approved/rejected submissions) renders consistently across both.

## Final Fresh Verification (Section 18)

Performed after all phases were complete, as a final pass distinct from per-phase testing:

- Backend restarted from a clean process, connected to MongoDB, listened on port 4000 — **PASS**
- `npm run seed` re-run cleanly — **PASS**
- Full endpoint + security/validation test suite re-run against the fresh seed (health, public
  browsing, signup/login, role/ownership checks, validation errors, admin item CRUD with cascade
  delete) — **PASS**, all expected status codes
- `npm run build` (web) succeeds — **PASS**
- `flutter analyze` (mobile) — **PASS**, no issues found
- `.env` files confirmed untracked in git (`git status` shows none staged) — **PASS**
- No `node_modules`, `dist`, or Flutter `build/`/`.dart_tool/` directories tracked — **PASS**
- Documentation present: README.md, DECISIONS.md, TEST_REPORT.md, SEED_CREDENTIALS.md — **PASS**

Database was re-seeded to a clean state as the final step so the repository's documented seed
credentials and data volumes match what a fresh clone + seed will produce.
