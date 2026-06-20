# Real signal sources (incremental plan)

Today every signal comes from `../curated.ts`. Each real source below
implements the `SignalSource` interface from `../index.ts`:

```ts
export interface SignalSource {
  id: string;
  fetch(): Promise<Signal[]>;
}
```

Adding a source is a drop-in: implement `fetch()` to return `Signal[]` with the
same ids the curated snapshot uses, then register it in `../index.ts`. Because
later sources override earlier ones by id, a live source transparently replaces
its curated placeholder — no UI or engine changes required.

## Status & rollout order (all have free tiers)

| Signal(s)                     | Source                          | Status                                  |
| ----------------------------- | ------------------------------- | --------------------------------------- |
| Weather / extreme heat        | Open-Meteo (`weather.ts`)       | ✅ Live, keyless — drives `heat_event`. |
| Policy rate, inflation (CPI)  | FRED API (`fred.ts`)            | 🔑 Ready — set `FRED_API_KEY` to activate. |
| Oil (Brent/WTI), gold         | EIA / metals API                | ⬜ Planned. Free tiers; watch limits.    |
| Equity & dollar indices       | Alpha Vantage / Stooq           | ⬜ Planned. Delayed quotes are fine.     |
| Legislation                   | Congress.gov / GovTrack         | ⬜ Planned. Map bill status → intensity. |

To activate FRED: get a free key at
<https://fredaccount.stlouisfed.org/apikeys>, then add `FRED_API_KEY=...` to
`.env` (git-ignored). Live rate/inflation values replace the curated ones
automatically; without the key the curated placeholders stay.

## Implementation notes

- Keep `fetch()` resilient: on error, throw — `getSignals()` already isolates a
  failing source so one outage never blanks the dashboard.
- Normalize `changePct` to the lookback the UI implies (daily for markets,
  monthly for macro) so the engine's spike/drop thresholds stay meaningful.
- Cache responses (e.g. revalidate hourly) to stay inside free rate limits.
- Put API keys in `.env` (already git-ignored) and read them server-side only.
