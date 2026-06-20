import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import type { Insight, Lens } from "@/domain/types";
import type { Briefing, BriefingInput } from "@/domain/synthesis/types";
import { getSignals } from "@/domain/signals";
import { analyze, forLens } from "@/domain/engine/analyze";

/**
 * LLM synthesis layer.
 *
 * The deterministic engine fires playbooks and produces a list of insights, but
 * when several fire at once the user gets a pile of overlapping, sometimes
 * conflicting actions. This step asks Claude to turn that pile into a single,
 * prioritized "what to do now" briefing — deduped, conflict-resolved, and
 * tailored to the user's context.
 *
 * Crucially it is GROUNDED: Claude only synthesizes from the actions the
 * curated playbooks already produced. The system prompt forbids inventing new
 * advice, so the trustworthy knowledge base stays the source of truth and the
 * model just does the prioritization and tailoring.
 *
 * Returns `null` when ANTHROPIC_API_KEY is not set, so the app degrades
 * gracefully to the deterministic insights without this layer.
 */

const MODEL = "claude-opus-4-8";

const SYSTEM_PROMPT = `You are Sentinel's synthesis layer. You receive a set of \
already-analyzed insights about the world (each with consequences and suggested \
actions drawn from a curated knowledge base) plus the user's context. Your job is \
to turn them into ONE prioritized "what to do now" briefing.

Rules:
- GROUNDING: Only use the actions and consequences provided. Do NOT invent new \
recommendations, financial products, numbers, or claims that aren't supported by \
the input. You may merge, reword, and reprioritize — not fabricate.
- DEDUPE & RESOLVE: Collapse overlapping actions into one. If two actions conflict, \
keep the one that fits the user's context better and drop or caveat the other.
- TAILOR: Use the user's context to decide which actions are relevant and how to \
phrase them. Drop actions that clearly don't apply to this user.
- PRIORITIZE: Order by urgency × relevance. Assign each action a priority of \
"now", "soon", or "watch".
- FRAMING: These are general tendencies, not financial advice. Keep a "consider" \
tone. Never issue imperative buy/sell directives about specific securities.
- Keep titles short and imperative. Keep rationales to one sentence, grounded in \
the named signals. The summary is 2-3 sentences on the overall picture.`;

const OUTPUT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    summary: { type: "string" },
    actions: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          title: { type: "string" },
          rationale: { type: "string" },
          priority: { type: "string", enum: ["now", "soon", "watch"] },
          basis: { type: "array", items: { type: "string" } },
        },
        required: ["title", "rationale", "priority", "basis"],
      },
    },
  },
  required: ["summary", "actions"],
} as const;

/** Compact, model-friendly view of the lens-filtered insights. */
function serializeInsights(insights: Insight[], lens: Lens) {
  return insights.map((i) => ({
    headline: i.headline,
    when: i.when,
    severity: i.topSeverity,
    confidence: i.confidence,
    triggered_by: i.matchedSignals.map((s) => ({
      name: s.name,
      reading: `${s.value} ${s.unit} (${s.changePct >= 0 ? "+" : ""}${s.changePct}%)`,
      note: s.summary,
    })),
    consequences: i.consequences
      .filter((c) => c.lens === lens)
      .map((c) => ({
        statement: c.statement,
        mechanism: c.mechanism,
        horizon: c.horizon,
        confidence: c.confidence,
        severity: c.severity,
        suggested_actions: c.actions,
      })),
  }));
}

export function isSynthesisConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

export async function synthesizeBriefing(
  input: BriefingInput,
): Promise<Briefing | null> {
  if (!isSynthesisConfigured()) return null;

  const signals = await getSignals();
  const insights = forLens(analyze(signals), input.lens);

  // Nothing fired — no briefing to synthesize.
  if (insights.length === 0) {
    return {
      summary:
        "No active insights for this lens right now. The world looks quiet — check back as signals move.",
      actions: [],
    };
  }

  const client = new Anthropic();

  const userPayload = {
    lens: input.lens,
    user_context: input.profile?.trim() || "(none provided)",
    insights: serializeInsights(insights, input.lens),
  };

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 8192,
    thinking: { type: "adaptive" },
    output_config: {
      effort: "medium",
      format: { type: "json_schema", schema: OUTPUT_SCHEMA },
    },
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content:
          "Synthesize the prioritized briefing for this user and these insights:\n\n" +
          JSON.stringify(userPayload, null, 2),
      },
    ],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text content in synthesis response");
  }

  return JSON.parse(textBlock.text) as Briefing;
}
