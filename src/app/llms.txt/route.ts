import { getSignals } from "@/domain/signals";
import { analyze } from "@/domain/engine/analyze";
import { toMarkdown } from "@/domain/engine/digest";

export const dynamic = "force-dynamic";

/**
 * GET /llms.txt
 *
 * Follows the emerging "llms.txt" convention: a single plain-text document
 * that tells an AI agent what this site is and how to consume it
 * programmatically, plus a live snapshot of the current briefing.
 */
export async function GET() {
  const signals = await getSignals();
  const insights = analyze(signals);

  const doc = `# Sentinel

> A world-analysis model that turns global signals (legislation, weather, oil,
> gold, interest rates, markets) into plain-language guidance for founders and
> for personal finance. Free to use.

## How agents should use this site

- Machine-readable JSON: GET /api/insights
  - ?lens=business|personal  filter consequences to one audience
  - ?format=md               return a Markdown briefing instead of JSON
- This document: GET /llms.txt (human + agent readable, includes a live snapshot)

The JSON response shape is:
  { asOf, lens, signals: Signal[], insights: Insight[] }
where each Insight has: headline, when, matchedSignals, consequences
(each with lens, statement, mechanism, horizon, confidence, severity, actions),
confidence, and topSeverity.

Note: Sentinel surfaces general historical tendencies to orient decisions.
It is not financial advice or a forecast.

---

## Live snapshot

${toMarkdown(signals, insights)}`;

  return new Response(doc, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
