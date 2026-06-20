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
  const live = signal.source.includes("live");
  return (
    <div className="rounded-xl border border-border bg-white p-4 shadow-card">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium uppercase tracking-wider text-faint">
          {CATEGORY_LABEL[signal.category]}
        </span>
        <span className={`text-sm font-semibold ${trendColor(signal.trend)}`}>
          {trendGlyph(signal.trend)} {signedPct(signal.changePct)}
        </span>
      </div>

      <div className="mt-2 flex items-baseline gap-2">
        <span className="font-mono text-2xl font-semibold text-ink">
          {signal.value.toLocaleString()}
        </span>
        <span className="text-xs text-muted">{signal.unit}</span>
      </div>

      <div className="mt-1 text-sm font-semibold text-ink">{signal.name}</div>
      <p className="mt-2 text-xs leading-relaxed text-muted">{signal.summary}</p>

      <div className="mt-3 flex items-center gap-2 text-[10px] uppercase tracking-wider text-faint">
        <span>as of {signal.asOf}</span>
        {live && (
          <span className="inline-flex items-center gap-1 rounded-full bg-low/10 px-1.5 py-0.5 font-semibold text-low">
            <span className="h-1.5 w-1.5 rounded-full bg-low" /> live
          </span>
        )}
      </div>
    </div>
  );
}
