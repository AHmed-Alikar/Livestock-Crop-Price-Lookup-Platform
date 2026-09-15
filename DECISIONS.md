# Engineering Decisions

Record of ambiguous points in the master spec and the simplest sensible choice made.

## Backend

- **`GET /api/prices` de-duplication**: the spec says "current approved prices across all
  markets for one item" without specifying how to handle multiple approved entries for the
  same item+market pair. Decision: return the single most-recent (`dateSubmitted` descending)
  approved entry per market.
- **Item/Market deletion**: the spec doesn't say what happens to `PriceEntry` documents when
  their referenced Item or Market is deleted by an Admin. Decision: cascade-delete dependent
  `PriceEntry` documents so the platform never serves orphaned price rows pointing at a
  nonexistent item/market. This is the simplest way to preserve data integrity without adding
  a "deleted but referenced" state to the UI.
- **JWT expiry**: not specified. Decision: 7 days, configurable via `JWT_EXPIRES_IN`.
- **Password minimum length**: not specified. Decision: 6 characters minimum on signup,
  enforced server-side.
- **Seed data volume**: the spec asks for 15-20 approved entries; the seed script generates
  entries per item/market pair (24 combinations) with 2-3 historical points each, then takes
  the first 18 to land inside the requested range while still giving every item+market pair
  at least one history point.

## Web / Mobile

- Decisions for the React and Flutter clients are appended here as those phases are built.
