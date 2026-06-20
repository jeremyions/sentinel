# Sentinel

**Read the world. Navigate reality.**

Sentinel is a free "world-analysis model" — it watches global signals
(legislation, weather, oil, gold, interest rates, markets) and translates
what's happening into plain-language guidance, through two lenses:

- **For my business** — a founder/operator view (margins, supply chains, runway, fundraising).
- **For my money** — a personal-finance view (bills, mortgages, savings, portfolio).

It answers the question behind the headlines: _"This is happening — so what does it
mean for me, and what could I do about it?"_

---

## How it works

Three clean layers, so the "world model" is real and easy to extend:

```
Signals  ──▶  Playbooks  ──▶  Engine  ──▶  Insights (business / personal)
(state of    (encoded         (matches      (ordered, plain-language
 the world)   cause→effect)    & ranks)      guidance with actions)
```

1. **Signals** (`src/domain/signals/`) — the measured state of each world
   indicator. Curated today via `curated.ts`; a `SignalSource` interface lets
   real free APIs drop in one at a time (`sources/README.md`).
2. **Playbooks** (`src/domain/playbooks/`) — the knowledge base of _"what
   generally happens when X"_ (oil spikes, rates fall, tariffs advance...).
   Each consequence is written for a lens, with a causal mechanism, time
   horizon, confidence, severity, and concrete suggested actions.
3. **Engine** (`src/domain/engine/analyze.ts`) — matches playbooks against the
   current signals, ranks the results by urgency (severity, then confidence),
   and splits them by lens.

The web UI (`src/app`, `src/components`) renders the signal feed and the
insights, with a toggle between the business and personal lenses. The same
brain is exposed at `GET /api/insights?lens=business|personal` for future
clients (mobile, notifications, integrations).

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
```

Other scripts: `npm run build`, `npm start`, `npm run typecheck`.

## Why curated data first

The whole product — UI and analysis engine — works end to end with zero API
keys or network calls. Curated signals mirror the _exact shape_ a real source
returns, so going live is a drop-in: implement `SignalSource.fetch()`, register
the source, done. Because later sources override earlier ones by id, each live
provider transparently replaces its curated placeholder with no UI or engine
changes. See `src/domain/signals/sources/README.md` for the rollout plan
(FRED for rates/inflation, Open-Meteo for weather, etc. — all free tiers).

## Roadmap

- [x] Wire the first real free data sources (Open-Meteo weather is live; FRED rates/inflation ready behind a key).
- [x] LLM synthesis layer: Claude turns the fired playbooks + your context into one prioritized "Do now" briefing (grounded in the curated knowledge, gated on `ANTHROPIC_API_KEY`).
- [ ] Wire the remaining data sources (commodities → markets → legislation).
- [ ] Composite playbooks (combinations of signals, e.g. "oil up _and_ rates up").
- [ ] Alerts / digest when signals cross thresholds.
- [ ] Saved watchlist and history of how signals moved.

## Disclaimer

Sentinel surfaces general tendencies to orient thinking — **not financial
advice or forecasts**. Always pair it with your own judgment.
