import { NextResponse } from "next/server";
import { getSignals } from "@/domain/signals";
import { analyze, forLens } from "@/domain/engine/analyze";
import type { Lens } from "@/domain/types";

export const dynamic = "force-dynamic";

/**
 * GET /api/insights[?lens=business|personal]
 *
 * Returns the current world signals and the insights the engine derives from
 * them. Optionally filter consequences to a single lens. This gives future
 * clients (mobile, notifications, integrations) the same brain the web UI uses.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lensParam = searchParams.get("lens");
  const lens: Lens | null =
    lensParam === "business" || lensParam === "personal" ? lensParam : null;

  const signals = await getSignals();
  const all = analyze(signals);
  const insights = lens ? forLens(all, lens) : all;

  return NextResponse.json({
    asOf: signals.map((s) => s.asOf).sort().at(-1) ?? null,
    lens,
    signals,
    insights,
  });
}
