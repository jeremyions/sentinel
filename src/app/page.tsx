import { getSignals } from "@/domain/signals";
import { analyze } from "@/domain/engine/analyze";
import { isSynthesisConfigured } from "@/domain/synthesis/synthesize";
import { Dashboard } from "@/components/Dashboard";
import { PageHeader } from "@/components/PageHeader";

// Re-evaluate on each request so signals/insights reflect the latest data.
// Once real sources are fully cached, switch to time-based revalidation.
export const dynamic = "force-dynamic";

export default async function Home() {
  const signals = await getSignals();
  const insights = analyze(signals);

  const asOf = signals
    .map((s) => s.asOf)
    .sort()
    .at(-1);

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
      <PageHeader eyebrow="Dashboard" title="Read the world. Navigate reality.">
        Sentinel watches global signals — legislation, weather, oil, gold,
        interest rates, markets — and translates what&apos;s happening into
        plain-language guidance for your business and your money.
        {asOf && (
          <span className="mt-1 block text-xs text-faint">
            Signals as of {asOf}.
          </span>
        )}
      </PageHeader>

      <Dashboard
        signals={signals}
        insights={insights}
        synthesisConfigured={isSynthesisConfigured()}
      />
    </div>
  );
}
