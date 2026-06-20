"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type NavItem = {
  href: string;
  label: string;
  icon: ReactNode;
};

function Icon({ path }: { path: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-[18px] w-[18px]"
      aria-hidden
    >
      <path d={path} />
    </svg>
  );
}

const NAV: NavItem[] = [
  {
    href: "/",
    label: "Dashboard",
    icon: <Icon path="M3 12l9-9 9 9M5 10v10h14V10" />,
  },
  {
    href: "/signals",
    label: "World Signals",
    icon: <Icon path="M3 17l6-6 4 4 7-7M21 8V3h-5" />,
  },
  {
    href: "/playbooks",
    label: "Playbooks",
    icon: <Icon path="M4 5a2 2 0 012-2h12v18H6a2 2 0 01-2-2zM8 7h8M8 11h8" />,
  },
  {
    href: "/agents",
    label: "For Agents",
    icon: <Icon path="M12 3v3M5 8h14v9a2 2 0 01-2 2H7a2 2 0 01-2-2zM9 13h0M15 13h0" />,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-border bg-gradient-to-b from-white to-surfaceAlt px-3 py-5 shadow-sidebar md:flex">
      <Link href="/" className="mb-8 flex items-center gap-2 px-2">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-ink text-sm text-white">
          S
        </span>
        <span className="text-sm font-semibold uppercase tracking-[0.18em] text-ink">
          Sentinel
        </span>
      </Link>

      <nav className="flex flex-col gap-1">
        {NAV.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                active
                  ? "bg-ink text-white shadow-card"
                  : "text-muted hover:bg-surfaceAlt hover:text-ink"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-lg border border-border bg-white/70 p-3">
        <p className="text-[11px] leading-relaxed text-muted">
          General tendencies to orient decisions — not financial advice.
        </p>
      </div>
    </aside>
  );
}
