# Livestock & Crop Price Lookup Platform

A price-transparency lookup tool for farmers and livestock traders to compare prices across
markets before selling. **Not** a marketplace — no buying, selling, or payments.

## Architecture

- **Backend**: Node.js + Express REST API, MongoDB + Mongoose
- **Web**: React (Vite) + React Router + recharts, consuming the backend REST API
- **Mobile**: Flutter (Android/iOS/web), consuming the same backend REST API
- **Auth**: JWT (JSON Web Tokens) + bcrypt password hashing, shared login endpoint for
  Trader and Admin roles

Both clients talk to the same backend — no duplicated business logic.

## Folder Structure

```
backend/    Express API, Mongoose models, seed script
web/        React web app (visitor, trader, admin screens)
mobile/     Flutter app (visitor, trader screens only — no admin)
```

## Prerequisites

- Node.js 18+
- MongoDB running locally (default: `mongodb://127.0.0.1:27017`)
- Flutter SDK (stable channel) for the mobile app

## Environment Setup

Each app has its own `.env.example`. Copy it to `.env` and adjust if needed.

```bash
cp backend/.env.example backend/.env
cp web/.env.example web/.env
```

`backend/.env`:
```
PORT=4000
MONGO_URI=mongodb://127.0.0.1:27017/livestock_crop_prices
JWT_SECRET=<a long random string>
JWT_EXPIRES_IN=7d
```

`web/.env`:
```
VITE_API_URL=http://localhost:4000/api
```

The Flutter app auto-detects its API base URL (`mobile/lib/api/api_config.dart`) — no `.env`
needed; it uses `localhost` for web/desktop/iOS and `10.0.2.2` for the Android emulator.

## MongoDB Setup

Make sure a local MongoDB instance is running before starting the backend or seeding data.

## Seed Data

```bash
cd backend
npm install
npm run seed
```

This populates: 6 Items, 4 Markets, 1 Admin, 2 Traders, and ~21 PriceEntries across
approved/pending/rejected statuses. See [SEED_CREDENTIALS.md](SEED_CREDENTIALS.md) for
login credentials.

## Backend Startup

```bash
cd backend
npm install
npm start        # or: npm run dev (nodemon)
```

API runs at `http://localhost:4000/api`. Health check: `GET /api/health`.

## Web Startup

```bash
cd web
npm install
npm run dev
```

Opens at `http://localhost:5173`.

## Flutter Startup

```bash
cd mobile
flutter pub get
flutter run -d chrome     # or an Android/iOS device/emulator
```

Admin screens are intentionally not implemented in Flutter — Admin is web-only, per spec.

## Testing Instructions

1. Start MongoDB, run `npm run seed` in `backend/`.
2. Start the backend (`npm start` in `backend/`).
3. Start the web app (`npm run dev` in `web/`) and/or the Flutter app (`flutter run` in `mobile/`).
4. Visitor flow: browse Category -> Item -> current prices -> price history, no login needed.
5. Trader flow: sign up or log in with a seeded trader account, submit a price, confirm it
   shows as "pending" and is not visible in the public current-prices view.
6. Admin flow (web only): log in with the seeded admin account, approve/reject entries in the
   Pending Queue, manage Items/Markets.

See [TEST_REPORT.md](TEST_REPORT.md) for the full results of the required verification checks,
and [DECISIONS.md](DECISIONS.md) for engineering decisions made where the spec was ambiguous.
