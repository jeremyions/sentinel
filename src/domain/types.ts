/**
 * Core domain model for Sentinel — a "world model" that turns raw global
 * signals into plain-language guidance.
 *
 * The model has three layers:
 *   1. Signals   — the measured state of a world indicator (oil, rates, ...).
 *   2. Playbooks — encoded knowledge of "what generally happens when X".
 *   3. Insights  — the engine's output: matched playbooks applied to the
 *                  current signals, framed for a business and a personal lens.
 */

/** Who an insight is being framed for. The UI lets users toggle between them. */
export type Lens = "business" | "personal";

export type SignalCategory =
  | "commodity"
  | "rates"
  | "macro"
  | "markets"
  | "legislation"
  | "weather";

/** Direction of the most recent meaningful move in a signal. */
export type Trend = "up" | "down" | "flat";

/** How far out a consequence typically plays out. */
export type TimeHorizon = "now" | "weeks" | "months" | "quarters";

/** Rough magnitude of a consequence, used for sorting and color. */
export type Severity = "low" | "medium" | "high";

/**
 * A single measured world indicator at a point in time.
 *
 * `changePct` is the percentage change over the lookback window the source
 * reports (e.g. day-over-day for markets, month-over-month for macro). Keeping
 * it normalized lets the engine reason about "spikes" and "drops" uniformly.
 */
export interface Signal {
  id: string;
  name: string;
  category: SignalCategory;
  /** Current value. For legislation/weather this can be a 0-100 intensity score. */
  value: number;
  /** Display unit, e.g. "USD/bbl", "%", "index". */
  unit: string;
  changePct: number;
  trend: Trend;
  /** ISO date the reading is "as of". */
  asOf: string;
  /** Where the number came from — "curated" today, a real provider later. */
  source: string;
  /** One-line human context for the current reading. */
  summary: string;
}

/**
 * A condition evaluated against a single signal. Triggers are intentionally
 * simple and composable so playbooks stay readable and testable.
 */
export interface Trigger {
  signalId: string;
  condition:
    | "spikes" // large positive move
    | "drops" // large negative move
    | "rises" // any positive move past threshold
    | "falls" // any negative move past threshold
    | "above" // absolute value above threshold
    | "below"; // absolute value below threshold
  /**
   * Threshold. For spikes/drops/rises/falls it is a percentage move
   * (e.g. 8 means an 8% move). For above/below it is an absolute value.
   */
  threshold: number;
}

/** One downstream effect of a playbook, written for a specific lens. */
export interface Consequence {
  lens: Lens;
  /** What tends to happen, in plain language. */
  statement: string;
  /** Why it happens — the causal mechanism, kept short. */
  mechanism: string;
  horizon: TimeHorizon;
  /** 0..1 — how reliably this consequence follows the trigger historically. */
  confidence: number;
  severity: Severity;
  /** Concrete things the reader could consider doing. */
  actions: string[];
}

/**
 * Encoded cause-and-effect knowledge. A playbook fires when ANY of its
 * triggers match the current signals (OR semantics keeps them focused —
 * compose multiple narrow playbooks rather than one broad one).
 */
export interface Playbook {
  id: string;
  title: string;
  /** Human-readable description of the firing condition. */
  when: string;
  triggers: Trigger[];
  consequences: Consequence[];
  tags: string[];
}

/** The engine's output for one fired playbook. */
export interface Insight {
  id: string;
  headline: string;
  when: string;
  /** Signals that caused this playbook to fire. */
  matchedSignals: Signal[];
  consequences: Consequence[];
  tags: string[];
  /** Aggregate confidence across the consequences, 0..1. */
  confidence: number;
  /** Highest severity among consequences — drives ordering and color. */
  topSeverity: Severity;
}
