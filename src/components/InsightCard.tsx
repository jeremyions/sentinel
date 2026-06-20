import type { Insight } from "@/domain/types";
import {
  confidenceLabel,
  horizonLabel,
  severityBadge,
  severityDot,
} from "@/components/format";

export function InsightCard({ insight }: { insight: Insight }) {
  return (
    <div className="rounded-xl border border-border bg-white p-5 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`inline-block h-2 w-2 rounded-full ${severityDot(
                insight.topSeverity,
              )}`}
              aria-hidden
            />
            <h3 className="text-base font-semibold text-ink">
              {insight.headline}
            </h3>
          </div>
          <p className="mt-1 text-xs text-muted">{insight.when}</p>
        </div>
        <span
          className={`whitespace-nowrap rounded-full px-2 py-1 text-[11px] font-semibold ${severityBadge(
            insight.topSeverity,
          )}`}
        >
          {confidenceLabel(insight.confidence)}
        </span>
      </div>

      {/* What triggered this */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {insight.matchedSignals.map((s) => (
          <span
            key={s.id}
            className="rounded-md border border-border bg-surface px-2 py-0.5 text-[11px] text-muted"
          >
            {s.name}
          </span>
        ))}
      </div>

      {/* Consequences */}
      <ul className="mt-4 space-y-3">
        {insight.consequences.map((c, i) => (
          <li key={i} className="border-l-2 border-borderStrong pl-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-ink">{c.statement}</p>
              <span className="whitespace-nowrap text-[10px] uppercase tracking-wider text-faint">
                {horizonLabel(c.horizon)}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted">{c.mechanism}</p>
            {c.actions.length > 0 && (
              <ul className="mt-2 space-y-1">
                {c.actions.map((a, j) => (
                  <li key={j} className="flex gap-2 text-xs text-ink/80">
                    <span className="text-faint">→</span>
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {insight.tags.map((t) => (
          <span key={t} className="text-[10px] text-faint">
            #{t}
          </span>
        ))}
      </div>
    </div>
  );
}
