import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import {
  isSynthesisConfigured,
  synthesizeBriefing,
} from "@/domain/synthesis/synthesize";
import type { Lens } from "@/domain/types";

export const dynamic = "force-dynamic";

/**
 * POST /api/briefing
 * Body: { lens: "business" | "personal", profile?: string }
 *
 * Returns the LLM-synthesized "what to do now" briefing. Triggered explicitly
 * from the UI (it costs a model call), and gated on ANTHROPIC_API_KEY.
 */
export async function GET() {
  return NextResponse.json({ configured: isSynthesisConfigured() });
}

export async function POST(request: Request) {
  if (!isSynthesisConfigured()) {
    return NextResponse.json(
      {
        error:
          "Synthesis is not configured. Set ANTHROPIC_API_KEY to enable the 'Do now' briefing.",
      },
      { status: 503 },
    );
  }

  let body: { lens?: string; profile?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const lens: Lens =
    body.lens === "personal" || body.lens === "business"
      ? body.lens
      : "business";

  try {
    const briefing = await synthesizeBriefing({ lens, profile: body.profile });
    return NextResponse.json({ briefing });
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) {
      return NextResponse.json(
        { error: "Rate limited — try again in a moment." },
        { status: 429 },
      );
    }
    if (err instanceof Anthropic.APIError) {
      console.error("Anthropic API error:", err.status, err.message);
      return NextResponse.json(
        { error: "The synthesis model is unavailable right now." },
        { status: 502 },
      );
    }
    console.error("Briefing synthesis failed:", err);
    return NextResponse.json(
      { error: "Failed to generate briefing." },
      { status: 500 },
    );
  }
}
