import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Sentinel — Read the world, navigate reality",
  description:
    "A world-analysis model that turns global signals — legislation, weather, oil, gold, rates — into plain-language guidance for founders and personal finance.",
  other: {
    // Hint for AI agents: machine-readable entry points.
    "ai-plugin": "/llms.txt",
  },
};

// Structured data so agents and crawlers can parse what this app offers.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Sentinel",
  applicationCategory: "BusinessApplication",
  description:
    "Turns global signals (legislation, weather, oil, gold, interest rates, markets) into plain-language guidance for founders and personal finance.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  potentialAction: {
    "@type": "SearchAction",
    target: "/api/insights?lens={lens}",
    "query-input": "required name=lens",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen font-sans">
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex min-w-0 flex-1 flex-col">
            {/* Mobile brand bar (sidebar is hidden below md) */}
            <div className="flex items-center gap-2 border-b border-border bg-white/80 px-4 py-3 backdrop-blur md:hidden">
              <Link href="/" className="flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-md bg-ink text-xs text-white">
                  S
                </span>
                <span className="text-sm font-semibold uppercase tracking-[0.18em]">
                  Sentinel
                </span>
              </Link>
            </div>
            <main className="min-w-0 flex-1">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
