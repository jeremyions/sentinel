import type { Signal, Trend } from "@/domain/types";
import type { SignalSource } from "@/domain/signals";

/**
 * Live weather source backed by Open-Meteo (free, no API key).
 *
 * It samples daily max temperature across major agricultural and logistics
 * regions, then condenses them into a single 0-100 "heat intensity" score for
 * the `heat_event` signal — the same id the curated snapshot used, so this
 * transparently replaces the placeholder when registered. The score drives the
 * "Severe heatwave" playbook with real data.
 */

interface Region {
  name: string;
  lat: number;
  lon: number;
}

// Heat in these regions stresses crops, grids, and outbound logistics — the
// channels the heatwave playbook reasons about.
const REGIONS: Region[] = [
  { name: "US Plains", lat: 39.0, lon: -98.0 },
  { name: "California Central Valley", lat: 36.7, lon: -119.8 },
  { name: "Northern India", lat: 28.6, lon: 77.2 },
  { name: "Southern Europe", lat: 37.4, lon: -6.0 },
  { name: "Southeast Brazil", lat: -23.5, lon: -46.6 },
];

const PAST_DAYS = 7;
const FORECAST_DAYS = 7;

/** Map a max temperature (°C) to a 0-100 heat-stress intensity. */
function intensityFromTempC(tempC: number): number {
  // 30°C ≈ benign, 45°C ≈ extreme. Clamp outside that band.
  const score = ((tempC - 30) / (45 - 30)) * 100;
  return Math.max(0, Math.min(100, Math.round(score)));
}

interface OpenMeteoLocation {
  latitude: number;
  longitude: number;
  daily: { time: string[]; temperature_2m_max: number[] };
}

export const weatherSource: SignalSource = {
  id: "open-meteo",
  async fetch(): Promise<Signal[]> {
    const lat = REGIONS.map((r) => r.lat).join(",");
    const lon = REGIONS.map((r) => r.lon).join(",");
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
      `&daily=temperature_2m_max&past_days=${PAST_DAYS}&forecast_days=${FORECAST_DAYS}` +
      `&temperature_unit=celsius`;

    // Cache for an hour to stay well inside Open-Meteo's free limits.
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`Open-Meteo ${res.status}`);

    const body = (await res.json()) as OpenMeteoLocation | OpenMeteoLocation[];
    const locations = Array.isArray(body) ? body : [body];

    // Current intensity = worst region over the recent + near-term window.
    // Prior intensity = worst region across the past week, for trend/change.
    let currentMaxTemp = -Infinity;
    let priorMaxTemp = -Infinity;
    let hottestRegion = "";

    locations.forEach((loc, i) => {
      const temps = loc.daily.temperature_2m_max;
      const recent = Math.max(...temps.slice(PAST_DAYS - 1)); // last reading onward
      const prior = Math.max(...temps.slice(0, PAST_DAYS)); // the past week
      if (recent > currentMaxTemp) {
        currentMaxTemp = recent;
        hottestRegion = REGIONS[i]?.name ?? "a key region";
      }
      if (prior > priorMaxTemp) priorMaxTemp = prior;
    });

    const value = intensityFromTempC(currentMaxTemp);
    const priorValue = intensityFromTempC(priorMaxTemp);

    const delta = value - priorValue;
    const trend: Trend = delta > 3 ? "up" : delta < -3 ? "down" : "flat";
    const changePct =
      priorValue > 0 ? Math.round(((value - priorValue) / priorValue) * 1000) / 10 : 0;

    return [
      {
        id: "heat_event",
        name: "Regional Heat Stress",
        category: "weather",
        value,
        unit: "intensity",
        changePct,
        trend,
        asOf: new Date().toISOString().slice(0, 10),
        source: "open-meteo (live)",
        summary: `Peak ${Math.round(currentMaxTemp)}°C around ${hottestRegion}; ` +
          `heat-stress intensity ${value}/100 across key agricultural and logistics regions.`,
      },
    ];
  },
};
