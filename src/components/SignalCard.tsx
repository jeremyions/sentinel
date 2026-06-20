import type { Signal } from "@/domain/types";
import { signedPct, trendColor, trendGlyph } from "@/components/format";

const CATEGORY_LABEL: Record<Signal["category"], string> = {
  commodity: "Commodity",
  rates: "Rates",
  macro: "Macro",
  markets: "Markets",
  legislation: "Legislation",
  weather: "Weather",
};

export function SignalCard({ signal }: { signal: Signal }) {
  return (
    <div className="rounded-xl border border-edge bg-panel p-4">
      <div className="flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-wider text-muted">
          {CATEGORY_LABEL[signal.category]}
        </span>
        <span className={`text-sm font-medium ${trendColor(signal.trend)}`}>
          {trendGlyph(signal.trend)} {signedPct(signal.changePct)}
        </span>
      </div>

      <div className="mt-2 flex items-baseline gap-2">
        <span className="font-mono text-2xl font-semibold text-slate-50">
          {signal.value.toLocaleString()}
        </span>
        <span className="text-xs text-muted">{signal.unit}</span>
      </div>

      <div className="mt-1 text-sm font-medium text-slate-200">{signal.name}</div>
      <p className="mt-2 text-xs leading-relaxed text-muted">{signal.summary}</p>

      <div className="mt-3 text-[10px] uppercase tracking-wider text-muted/70">
        as of {signal.asOf} · {signal.source}
      </div>
    </div>
  );
}
