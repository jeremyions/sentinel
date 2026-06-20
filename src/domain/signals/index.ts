import type { Signal } from "@/domain/types";
import { CURATED_SIGNALS } from "@/domain/signals/curated";
import { weatherSource } from "@/domain/signals/sources/weather";
import { fredSource } from "@/domain/signals/sources/fred";

/**
 * A SignalSource is anything that can produce the current set of signals.
 * Today the only source is the curated snapshot. Real providers (FRED for
 * rates/inflation, an energy API for oil, a metals API for gold, a civic-data
 * API for legislation, a weather API) implement this same interface and get
 * merged in incrementally — see `sources/README` for the plan.
 */
export interface SignalSource {
  id: string;
  /** Returns signals this source is responsible for. May be async (network). */
  fetch(): Promise<Signal[]>;
}

const curatedSource: SignalSource = {
  id: "curated",
  async fetch() {
    return CURATED_SIGNALS;
  },
};

/**
 * The registry of active sources. As real adapters land, add them here.
 * When two sources report the same signal id, the later source wins, so a
 * live provider can transparently override the curated placeholder.
 *
 * `weatherSource` (Open-Meteo, keyless) overrides the curated `heat_event`
 * with live data. Curated stays first so any live-source outage falls back to
 * the placeholder rather than dropping the signal entirely.
 */
const SOURCES: SignalSource[] = [curatedSource, weatherSource, fredSource];

/**
 * Gather signals from every registered source and de-duplicate by id.
 * Kept async so the call site never has to change when real network sources
 * are added.
 */
export async function getSignals(): Promise<Signal[]> {
  const byId = new Map<string, Signal>();
  for (const source of SOURCES) {
    try {
      const signals = await source.fetch();
      for (const signal of signals) {
        byId.set(signal.id, signal);
      }
    } catch (err) {
      // A failing source should never blank out the whole dashboard.
      console.error(`signal source "${source.id}" failed:`, err);
    }
  }
  return [...byId.values()];
}

export function getSignalById(signals: Signal[], id: string): Signal | undefined {
  return signals.find((s) => s.id === id);
}
