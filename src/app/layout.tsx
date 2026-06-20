import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sentinel — Read the world, navigate reality",
  description:
    "A world-analysis model that turns global signals — legislation, weather, oil, gold, rates — into plain-language guidance for founders and personal finance.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
