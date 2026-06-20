import { PLAYBOOKS } from "@/domain/playbooks";
import { PageHeader } from "@/components/PageHeader";
import { horizonLabel, severityBadge } from "@/components/format";

export default function PlaybooksPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
      <PageHeader eyebrow="Playbooks" title="The knowledge base">
        Sentinel&apos;s encoded cause-and-effect: what generally happens when a
        signal moves, and what to consider doing about it. {PLAYBOOKS.length}{" "}
        playbooks today — each fires automatically when its trigger conditions
        are met.
      </PageHeader>

      <div className="space-y-4">
        {PLAYBOOKS.map((p) => (
          <article
            key={p.id}
            className="rounded-xl border border-border bg-white p-5 shadow-card"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-base font-semibold text-ink">{p.title}</h2>
              <span className="text-xs text-muted">{p.when}</span>
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {(["business", "personal"] as const).map((lens) => {
                const cons = p.consequences.filter((c) => c.lens === lens);
                if (cons.length === 0) return null;
                return (
                  <div
                    key={lens}
                    className="rounded-lg border border-border bg-surface p-3"
                  >
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-faint">
                      {lens === "business" ? "For business" : "For your money"}
                    </p>
                    <ul className="space-y-2">
                      {cons.map((c, i) => (
                        <li key={i}>
                          <div className="flex items-center gap-2">
                            <span
                              className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${severityBadge(
                                c.severity,
                              )}`}
                            >
                              {horizonLabel(c.horizon)}
                            </span>
                            <span className="text-sm font-medium text-ink">
                              {c.statement}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {p.tags.map((t) => (
                <span key={t} className="text-[10px] text-faint">
                  #{t}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
