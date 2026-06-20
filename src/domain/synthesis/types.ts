import type { Lens } from "@/domain/types";

/** A single prioritized recommendation in the synthesized briefing. */
export interface BriefingAction {
  /** Short imperative, e.g. "Lock in freight contracts". */
  title: string;
  /** One sentence on why, grounded in the active signals. */
  rationale: string;
  /** Urgency bucket the model assigned. */
  priority: "now" | "soon" | "watch";
  /** Names of the signals this action is grounded in. */
  basis: string[];
}

/** The LLM-synthesized "what to do now" briefing for one lens + context. */
export interface Briefing {
  /** 2-3 sentence read on the overall situation. */
  summary: string;
  /** Deduped, conflict-resolved, prioritized actions. */
  actions: BriefingAction[];
}

export interface BriefingInput {
  lens: Lens;
  /** Optional free-text user context, e.g. "B2B SaaS, pre-seed" or "saving for a house". */
  profile?: string;
}
