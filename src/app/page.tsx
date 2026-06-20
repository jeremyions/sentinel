import { getSignals } from "@/domain/signals";
import { analyze } from "@/domain/engine/analyze";
import { Dashboard } from "@/components/Dashboard";

// Re-evaluate on each request so signals/insights reflect the latest data.
// Once real sources land, switch to time-based revalidation for caching.
export const dynamic = "force-dynamic";

export default async function Home() {
  const signals = await getSignals();
  const insights = analyze(signals);

  const asOf = signals
    .map((s) => s.asOf)
    .sort()
    .at(-1);

  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <header className="mb-10">
        <div className="flex items-center gap-2">
          <span className="text-xl">🛰️</span>
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
            Sentinel
          </span>
        </div>
        <h1 className="mt-3 max-w-2xl text-3xl font-bold leading-tight text-slate-50 sm:text-4xl">
          Read the world. Navigate reality.
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
          Sentinel watches global signals — legislation, weather, oil, gold,
          interest rates, markets — and translates what&apos;s happening into
          plain-language guidance for your business and your money.
          {asOf && (
            <span className="block mt-1 text-xs text-muted/70">
              Signals as of {asOf}.
            </span>
          )}
        </p>
      </header>

      <Dashboard signals={signals} insights={insights} />

      <footer className="mt-16 border-t border-edge pt-6 text-xs text-muted">
        Sentinel surfaces general tendencies to orient your thinking — not
        financial advice or forecasts. Always pair it with your own judgment.
      </footer>
    </main>
  );
}
