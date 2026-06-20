import type { Signal, Trend } from "@/domain/types";
import type { SignalSource } from "@/domain/signals";

/**
 * Live macro source backed by FRED (Federal Reserve Economic Data).
 *
 * FRED is free but requires an API key. Get one at
 * https://fredaccount.stlouisfed.org/apikeys and set it in `.env`:
 *
 *   FRED_API_KEY=your_key_here
 *
 * Without a key this source returns nothing, so the curated `fed_funds_rate`
 * and `cpi_inflation` placeholders stay in place — the app never breaks for
 * lack of a key. With a key, live values transparently override them.
 */

const FRED_BASE = "https://api.stlouisfed.org/fred/series/observations";

interface FredObservation {
  date: string;
  value: string; // FRED returns "." for missing values
}

/** Fetch the most recent `limit` numeric observations (newest first). */
async function fetchSeries(seriesId: string, key: string, limit: number): Promise<FredObservation[]> {
  const url =
    `${FRED_BASE}?series_id=${seriesId}&api_key=${key}&file_type=json` +
    `&sort_order=desc&limit=${limit}`;
  const res = await fetch(url, { next: { revalidate: 21600 } }); // 6h cache
  if (!res.ok) throw new Error(`FRED ${seriesId} ${res.status}`);
  const body = (await res.json()) as { observations?: FredObservation[] };
  return (body.observations ?? []).filter((o) => o.value !== ".");
}

function trendFrom(changePct: number): Trend {
  return changePct > 0.5 ? "up" : changePct < -0.5 ? "down" : "flat";
}

function relChangePct(current: number, prior: number): number {
  if (prior === 0) return 0;
  return Math.round(((current - prior) / Math.abs(prior)) * 1000) / 10;
}

export const fredSource: SignalSource = {
  id: "fred",
  async fetch(): Promise<Signal[]> {
    const key = process.env.FRED_API_KEY;
    if (!key) return []; // not configured — leave curated placeholders in place

    const signals: Signal[] = [];

    // Policy interest rate (effective federal funds rate, monthly average).
    try {
      const obs = await fetchSeries("FEDFUNDS", key, 3);
      if (obs.length >= 2) {
        const current = Number(obs[0]!.value);
        const prior = Number(obs[1]!.value);
        const changePct = relChangePct(current, prior);
        signals.push({
          id: "fed_funds_rate",
          name: "Policy Interest Rate",
          category: "rates",
          value: current,
          unit: "%",
          changePct,
          trend: trendFrom(changePct),
          asOf: obs[0]!.date,
          source: "FRED (live)",
          summary: `Effective federal funds rate at ${current}% (${changePct >= 0 ? "+" : ""}${changePct}% vs prior month).`,
        });
      }
    } catch (err) {
      console.error("FRED FEDFUNDS failed:", err);
    }

    // Inflation: year-over-year change in CPI (CPIAUCSL). We need ~14 months
    // to compute the current YoY rate and the prior month's YoY rate.
    try {
      const obs = await fetchSeries("CPIAUCSL", key, 15);
      if (obs.length >= 14) {
        const v = obs.map((o) => Number(o.value));
        const yoyNow = ((v[0]! - v[12]!) / v[12]!) * 100;
        const yoyPrev = ((v[1]! - v[13]!) / v[13]!) * 100;
        const value = Math.round(yoyNow * 10) / 10;
        const changePct = relChangePct(yoyNow, yoyPrev);
        signals.push({
          id: "cpi_inflation",
          name: "Inflation (CPI, YoY)",
          category: "macro",
          value,
          unit: "%",
          changePct,
          trend: trendFrom(changePct),
          asOf: obs[0]!.date,
          source: "FRED (live)",
          summary: `Headline CPI running at ${value}% year-over-year (${changePct >= 0 ? "+" : ""}${changePct}% vs prior month's rate).`,
        });
      }
    } catch (err) {
      console.error("FRED CPIAUCSL failed:", err);
    }

    return signals;
  },
};
