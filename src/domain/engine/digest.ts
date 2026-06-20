import type { Insight, Signal } from "@/domain/types";
import { signedPct } from "@/components/format";

/**
 * Render the current world analysis as plain Markdown.
 *
 * This is the agent-friendly view: an LLM or automation can read the whole
 * briefing as text without parsing the UI or the JSON schema. Used by
 * `GET /api/insights?format=md` and embedded in `/llms.txt`.
 */
export function toMarkdown(signals: Signal[], insights: Insight[]): string {
  const asOf = signals.map((s) => s.asOf).sort().at(-1) ?? "n/a";
  const lines: string[] = [];

  lines.push(`# Sentinel — World Briefing`);
  lines.push(`As of ${asOf}. General tendencies, not financial advice.`);
  lines.push("");

  lines.push(`## Active Signals`);
  for (const s of signals) {
    lines.push(
      `- **${s.name}** (${s.category}): ${s.value} ${s.unit}, ` +
        `${signedPct(s.changePct)} [${s.trend}] — ${s.summary} (${s.source})`,
    );
  }
  lines.push("");

  lines.push(`## Insights (ordered by urgency)`);
  if (insights.length === 0) {
    lines.push("_No active insights right now._");
  }
  for (const insight of insights) {
    lines.push("");
    lines.push(
      `### ${insight.headline} — ${insight.topSeverity} severity, ` +
        `${Math.round(insight.confidence * 100)}% confidence`,
    );
    lines.push(
      `Triggered by: ${insight.matchedSignals.map((s) => s.name).join(", ")}`,
    );
    for (const c of insight.consequences) {
      lines.push(
        `- [${c.lens}] ${c.statement} (${c.horizon}) — ${c.mechanism}`,
      );
      for (const a of c.actions) lines.push(`    - Action: ${a}`);
    }
  }
  lines.push("");

  return lines.join("\n");
}
