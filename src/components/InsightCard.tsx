import type { Insight } from "@/domain/types";
import {
  confidenceLabel,
  horizonLabel,
  severityColor,
  severityDot,
} from "@/components/format";

export function InsightCard({ insight }: { insight: Insight }) {
  return (
    <div className="rounded-xl border border-edge bg-panel p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`inline-block h-2 w-2 rounded-full ${severityDot(
                insight.topSeverity,
              )}`}
              aria-hidden
            />
            <h3 className="text-base font-semibold text-slate-50">
              {insight.headline}
            </h3>
          </div>
          <p className="mt-1 text-xs text-muted">{insight.when}</p>
        </div>
        <span
          className={`whitespace-nowrap text-[11px] font-medium ${severityColor(
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
            className="rounded-md border border-edge bg-ink/60 px-2 py-0.5 text-[11px] text-slate-300"
          >
            {s.name}
          </span>
        ))}
      </div>

      {/* Consequences */}
      <ul className="mt-4 space-y-3">
        {insight.consequences.map((c, i) => (
          <li key={i} className="border-l-2 border-edge pl-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-medium text-slate-100">{c.statement}</p>
              <span className="whitespace-nowrap text-[10px] uppercase tracking-wider text-muted">
                {horizonLabel(c.horizon)}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted">{c.mechanism}</p>
            {c.actions.length > 0 && (
              <ul className="mt-2 space-y-1">
                {c.actions.map((a, j) => (
                  <li key={j} className="flex gap-2 text-xs text-slate-300">
                    <span className="text-accent">→</span>
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
          <span key={t} className="text-[10px] text-muted">
            #{t}
          </span>
        ))}
      </div>
    </div>
  );
}
