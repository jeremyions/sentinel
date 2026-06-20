import { getSignals } from "@/domain/signals";
import { SignalCard } from "@/components/SignalCard";
import { PageHeader } from "@/components/PageHeader";

export const dynamic = "force-dynamic";

export default async function SignalsPage() {
  const signals = await getSignals();

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
      <PageHeader eyebrow="World Signals" title="The state of the world">
        Every indicator Sentinel watches, with its latest reading. Signals
        marked <span className="font-semibold text-low">live</span> stream from
        real free data sources; the rest are curated placeholders until their
        source is wired in.
      </PageHeader>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {signals.map((signal) => (
          <SignalCard key={signal.id} signal={signal} />
        ))}
      </div>
    </div>
  );
}
