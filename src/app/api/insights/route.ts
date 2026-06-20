import { NextResponse } from "next/server";
import { getSignals } from "@/domain/signals";
import { analyze, forLens } from "@/domain/engine/analyze";
import { toMarkdown } from "@/domain/engine/digest";
import type { Lens } from "@/domain/types";

export const dynamic = "force-dynamic";

/**
 * GET /api/insights[?lens=business|personal][&format=md]
 *
 * Returns the current world signals and the insights the engine derives from
 * them. Built to be trivially consumable by AI agents:
 *   - default: JSON ({ asOf, lens, signals, insights })
 *   - format=md: a Markdown briefing an LLM can read directly
 *   - lens=business|personal: filter consequences to one audience
 *
 * CORS is open so browser-based agents can call it cross-origin.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lensParam = searchParams.get("lens");
  const format = searchParams.get("format");
  const lens: Lens | null =
    lensParam === "business" || lensParam === "personal" ? lensParam : null;

  const signals = await getSignals();
  const all = analyze(signals);
  const insights = lens ? forLens(all, lens) : all;

  if (format === "md" || format === "markdown") {
    return new NextResponse(toMarkdown(signals, insights), {
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  return NextResponse.json(
    {
      asOf: signals.map((s) => s.asOf).sort().at(-1) ?? null,
      lens,
      signals,
      insights,
    },
    { headers: { "Access-Control-Allow-Origin": "*" } },
  );
}
