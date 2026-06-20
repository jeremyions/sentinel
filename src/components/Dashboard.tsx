"use client";

import { useMemo, useState } from "react";
import type { Insight, Lens, Signal } from "@/domain/types";
import { forLens } from "@/domain/engine/analyze";
import { SignalCard } from "@/components/SignalCard";
import { InsightCard } from "@/components/InsightCard";

const LENSES: { id: Lens; label: string; blurb: string }[] = [
  { id: "business", label: "For my business", blurb: "Founder & operator lens" },
  { id: "personal", label: "For my money", blurb: "Personal finance lens" },
];

export function Dashboard({
  signals,
  insights,
}: {
  signals: Signal[];
  insights: Insight[];
}) {
  const [lens, setLens] = useState<Lens>("business");

  const lensInsights = useMemo(() => forLens(insights, lens), [insights, lens]);

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
      {/* Insights — the product's main value */}
      <section>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-ink">
            What this means for you
          </h2>
          <div className="inline-flex rounded-lg border border-border bg-surface p-1">
            {LENSES.map((l) => (
              <button
                key={l.id}
                onClick={() => setLens(l.id)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                  lens === l.id
                    ? "bg-ink text-white shadow-card"
                    : "text-muted hover:text-ink"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        <p className="mb-4 text-xs text-muted">
          {LENSES.find((l) => l.id === lens)?.blurb} · {lensInsights.length}{" "}
          active insight{lensInsights.length === 1 ? "" : "s"}, ordered by
          urgency
        </p>

        <div className="space-y-4">
          {lensInsights.length === 0 ? (
            <p className="rounded-xl border border-border bg-white p-6 text-sm text-muted shadow-card">
              No active insights for this lens right now. The world looks quiet —
              check back as signals move.
            </p>
          ) : (
            lensInsights.map((insight) => (
              <InsightCard key={insight.id} insight={insight} />
            ))
          )}
        </div>
      </section>

      {/* Signal feed — the raw state of the world */}
      <aside>
        <h2 className="mb-4 text-lg font-semibold text-ink">World signals</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
          {signals.map((signal) => (
            <SignalCard key={signal.id} signal={signal} />
          ))}
        </div>
      </aside>
    </div>
  );
}
