import type {
  Consequence,
  Insight,
  Lens,
  Playbook,
  Severity,
  Signal,
  Trigger,
} from "@/domain/types";
import { PLAYBOOKS } from "@/domain/playbooks";

const SEVERITY_RANK: Record<Severity, number> = { low: 1, medium: 2, high: 3 };

/** Evaluate a single trigger against the current signal set. */
function triggerMatches(trigger: Trigger, signals: Signal[]): boolean {
  const signal = signals.find((s) => s.id === trigger.signalId);
  if (!signal) return false;

  switch (trigger.condition) {
    case "spikes":
      return signal.changePct >= trigger.threshold;
    case "drops":
      return signal.changePct <= -trigger.threshold;
    case "rises":
      return signal.changePct >= trigger.threshold;
    case "falls":
      return signal.changePct <= -trigger.threshold;
    case "above":
      return signal.value >= trigger.threshold;
    case "below":
      return signal.value <= trigger.threshold;
    default:
      return false;
  }
}

/** Signals that caused a playbook to fire (any matching trigger). */
function matchedSignals(playbook: Playbook, signals: Signal[]): Signal[] {
  const ids = new Set(
    playbook.triggers
      .filter((t) => triggerMatches(t, signals))
      .map((t) => t.signalId),
  );
  return signals.filter((s) => ids.has(s.id));
}

function topSeverity(consequences: Consequence[]): Severity {
  return consequences.reduce<Severity>((worst, c) => {
    return SEVERITY_RANK[c.severity] > SEVERITY_RANK[worst] ? c.severity : worst;
  }, "low");
}

/** Severity-weighted average confidence — high-severity effects count more. */
function aggregateConfidence(consequences: Consequence[]): number {
  if (consequences.length === 0) return 0;
  let weighted = 0;
  let weight = 0;
  for (const c of consequences) {
    const w = SEVERITY_RANK[c.severity];
    weighted += c.confidence * w;
    weight += w;
  }
  return Math.round((weighted / weight) * 100) / 100;
}

/**
 * Run the world model: match every playbook against the current signals and
 * produce an ordered list of insights. A playbook fires if any trigger matches.
 *
 * Ordering puts the most decision-relevant insights first: higher severity,
 * then higher confidence.
 */
export function analyze(
  signals: Signal[],
  playbooks: Playbook[] = PLAYBOOKS,
): Insight[] {
  const insights: Insight[] = [];

  for (const playbook of playbooks) {
    const matched = matchedSignals(playbook, signals);
    if (matched.length === 0) continue;

    insights.push({
      id: playbook.id,
      headline: playbook.title,
      when: playbook.when,
      matchedSignals: matched,
      consequences: playbook.consequences,
      tags: playbook.tags,
      confidence: aggregateConfidence(playbook.consequences),
      topSeverity: topSeverity(playbook.consequences),
    });
  }

  insights.sort((a, b) => {
    const sev = SEVERITY_RANK[b.topSeverity] - SEVERITY_RANK[a.topSeverity];
    if (sev !== 0) return sev;
    return b.confidence - a.confidence;
  });

  return insights;
}

/** Filter an insight's consequences to a single lens (drops empty insights). */
export function forLens(insights: Insight[], lens: Lens): Insight[] {
  return insights
    .map((insight) => ({
      ...insight,
      consequences: insight.consequences.filter((c) => c.lens === lens),
    }))
    .filter((insight) => insight.consequences.length > 0);
}
