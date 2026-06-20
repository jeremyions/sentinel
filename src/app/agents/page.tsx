import { PageHeader } from "@/components/PageHeader";

function Endpoint({
  method,
  path,
  desc,
}: {
  method: string;
  path: string;
  desc: string;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border border-border bg-white p-4 shadow-card sm:flex-row sm:items-center sm:gap-4">
      <span className="w-fit rounded-md bg-ink px-2 py-0.5 font-mono text-xs font-semibold text-white">
        {method}
      </span>
      <code className="font-mono text-sm text-ink">{path}</code>
      <span className="text-sm text-muted sm:ml-auto sm:text-right">{desc}</span>
    </div>
  );
}

function Code({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-lg border border-border bg-surfaceAlt p-4 font-mono text-xs leading-relaxed text-ink">
      {children}
    </pre>
  );
}

export default function AgentsPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-8 sm:px-8 sm:py-10">
      <PageHeader eyebrow="For Agents" title="Built for AI agents">
        Sentinel&apos;s world model is designed to be consumed programmatically.
        Every endpoint returns clean, structured data — or a Markdown briefing
        an LLM can read directly — with open CORS so agents can call it from
        anywhere.
      </PageHeader>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-faint">
          Endpoints
        </h2>
        <Endpoint
          method="GET"
          path="/api/insights"
          desc="Full JSON: signals + insights"
        />
        <Endpoint
          method="GET"
          path="/api/insights?lens=business"
          desc="Filter to one lens (business | personal)"
        />
        <Endpoint
          method="GET"
          path="/api/insights?format=md"
          desc="Markdown briefing for direct LLM consumption"
        />
        <Endpoint
          method="GET"
          path="/llms.txt"
          desc="Agent guide + live snapshot (llms.txt convention)"
        />
        <Endpoint
          method="POST"
          path="/api/briefing"
          desc="AI-synthesized 'Do now' briefing (body: lens, profile)"
        />
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-faint">
          Example: ask an agent to read the world
        </h2>
        <Code>{`# Fetch a ready-to-read briefing
curl https://your-domain/api/insights?format=md

# Or just the business-relevant insights as JSON
curl "https://your-domain/api/insights?lens=business" | jq '.insights[].headline'`}</Code>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-faint">
          Response shape (JSON)
        </h2>
        <Code>{`{
  "asOf": "2026-06-19",
  "lens": "business",
  "signals": [
    { "id": "oil_brent", "name": "Brent Crude Oil", "category": "commodity",
      "value": 94.2, "unit": "USD/bbl", "changePct": 11.4, "trend": "up",
      "asOf": "2026-06-19", "source": "curated", "summary": "..." }
  ],
  "insights": [
    { "id": "oil_spike", "headline": "Oil prices spike",
      "matchedSignals": [ ... ], "topSeverity": "high", "confidence": 0.76,
      "consequences": [
        { "lens": "business", "statement": "...", "mechanism": "...",
          "horizon": "weeks", "confidence": 0.8, "severity": "high",
          "actions": ["..."] }
      ] }
  ]
}`}</Code>
      </section>

      <p className="mt-8 text-xs text-muted">
        Pairs naturally with tool-using agents and MCP: point a model at{" "}
        <code className="font-mono">/llms.txt</code> and it can self-discover the
        rest.
      </p>
    </div>
  );
}
