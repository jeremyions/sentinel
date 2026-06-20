import type { Severity, TimeHorizon, Trend } from "@/domain/types";

export function signedPct(pct: number): string {
  if (pct === 0) return "0%";
  return `${pct > 0 ? "+" : ""}${pct.toFixed(1)}%`;
}

export function trendGlyph(trend: Trend): string {
  return trend === "up" ? "▲" : trend === "down" ? "▼" : "▬";
}

/** Tailwind text color for a directional move (up/down isn't good/bad here). */
export function trendColor(trend: Trend): string {
  return trend === "up"
    ? "text-positive"
    : trend === "down"
      ? "text-danger"
      : "text-muted";
}

export function severityColor(severity: Severity): string {
  return severity === "high"
    ? "text-danger"
    : severity === "medium"
      ? "text-warning"
      : "text-positive";
}

export function severityDot(severity: Severity): string {
  return severity === "high"
    ? "bg-danger"
    : severity === "medium"
      ? "bg-warning"
      : "bg-positive";
}

export function horizonLabel(horizon: TimeHorizon): string {
  switch (horizon) {
    case "now":
      return "Now";
    case "weeks":
      return "Weeks";
    case "months":
      return "Months";
    case "quarters":
      return "Quarters";
  }
}

export function confidenceLabel(confidence: number): string {
  if (confidence >= 0.75) return "High confidence";
  if (confidence >= 0.55) return "Moderate confidence";
  return "Low confidence";
}
