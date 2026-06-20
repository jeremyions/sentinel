import type { Signal } from "@/domain/types";

/**
 * Curated snapshot of world signals.
 *
 * This is deliberately hand-maintained today so the full product — UI and
 * analysis engine — works end to end without depending on any external API
 * or key. Each entry mirrors the exact shape a real source adapter will
 * return, so swapping in live data later is a drop-in replacement (see
 * `src/domain/signals/sources/`). Values are representative, not live.
 */
export const CURATED_SIGNALS: Signal[] = [
  {
    id: "oil_brent",
    name: "Brent Crude Oil",
    category: "commodity",
    value: 94.2,
    unit: "USD/bbl",
    changePct: 11.4,
    trend: "up",
    asOf: "2026-06-19",
    source: "curated",
    summary: "Up sharply on supply disruption fears; fastest weekly rise this year.",
  },
  {
    id: "gold",
    name: "Gold",
    category: "commodity",
    value: 2480,
    unit: "USD/oz",
    changePct: 4.8,
    trend: "up",
    asOf: "2026-06-19",
    source: "curated",
    summary: "Climbing as investors seek safe havens amid geopolitical stress.",
  },
  {
    id: "fed_funds_rate",
    name: "Policy Interest Rate",
    category: "rates",
    value: 4.25,
    unit: "%",
    changePct: -5.6,
    trend: "down",
    asOf: "2026-06-18",
    source: "curated",
    summary: "Central bank cut 25bps; signaled further easing if inflation cools.",
  },
  {
    id: "cpi_inflation",
    name: "Inflation (CPI, YoY)",
    category: "macro",
    value: 3.1,
    unit: "%",
    changePct: -8.8,
    trend: "down",
    asOf: "2026-06-12",
    source: "curated",
    summary: "Cooling toward target; shelter costs still the stubborn component.",
  },
  {
    id: "usd_index",
    name: "US Dollar Index",
    category: "markets",
    value: 99.1,
    unit: "index",
    changePct: -2.3,
    trend: "down",
    asOf: "2026-06-19",
    source: "curated",
    summary: "Softening as rate-cut expectations build.",
  },
  {
    id: "equity_index",
    name: "Broad Equity Index",
    category: "markets",
    value: 5380,
    unit: "index",
    changePct: -3.4,
    trend: "down",
    asOf: "2026-06-19",
    source: "curated",
    summary: "Pulled back on energy-driven inflation worries despite the rate cut.",
  },
  {
    id: "tariff_bill",
    name: "Import Tariff Legislation",
    category: "legislation",
    value: 72,
    unit: "intensity",
    changePct: 0,
    trend: "up",
    asOf: "2026-06-17",
    source: "curated",
    summary: "New tariffs on imported components advancing through committee.",
  },
  {
    id: "heat_event",
    name: "Regional Heatwave",
    category: "weather",
    value: 80,
    unit: "intensity",
    changePct: 0,
    trend: "up",
    asOf: "2026-06-19",
    source: "curated",
    summary: "Prolonged heat across major agricultural and logistics corridors.",
  },
];
