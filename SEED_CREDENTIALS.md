# Seed Credentials (Local Development Only)

These accounts are created by `backend/src/seed/seed.js` and only exist in your local
MongoDB database. They are **not** real secrets — do not reuse these passwords anywhere else.

## Admin

- Email: `admin@pricelookup.test`
- Password: `Admin@12345`

## Traders

- Email: `trader1@pricelookup.test`
- Password: `Trader@12345`

- Email: `trader2@pricelookup.test`
- Password: `Trader@12345`

## Regenerating seed data

```bash
cd backend
npm run seed
```

This clears and repopulates all collections (Items, Markets, Users, PriceEntries).
