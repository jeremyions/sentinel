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

## Suggested rollout order (all have free tiers)

| Signal(s)                     | Source                          | Notes                                   |
| ----------------------------- | ------------------------------- | --------------------------------------- |
| Policy rate, inflation (CPI)  | FRED API (St. Louis Fed)        | Free key; clean macro series.           |
| Oil (Brent/WTI), gold         | EIA / metals API / Yahoo-style  | Free tiers exist; watch rate limits.    |
| Equity & dollar indices       | Stooq / Alpha Vantage           | Free tier, delayed quotes are fine.     |
| Legislation                   | Congress.gov / GovTrack         | Map bill status → an intensity score.   |
| Weather / extreme events      | NOAA / Open-Meteo               | No key for Open-Meteo; great for MVP.   |

## Implementation notes

- Keep `fetch()` resilient: on error, throw — `getSignals()` already isolates a
  failing source so one outage never blanks the dashboard.
- Normalize `changePct` to the lookback the UI implies (daily for markets,
  monthly for macro) so the engine's spike/drop thresholds stay meaningful.
- Cache responses (e.g. revalidate hourly) to stay inside free rate limits.
- Put API keys in `.env` (already git-ignored) and read them server-side only.
