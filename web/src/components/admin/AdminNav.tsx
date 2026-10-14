"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export type AdminNavItem = { href: string; label: string; badge?: number };

/**
 * Меню админки. На широком экране — колонкой слева,
 * на телефоне — строкой вверху с горизонтальной прокруткой.
 */
export default function AdminNav({ items, layout }: { items: AdminNavItem[]; layout: "column" | "row" }) {
  const pathname = usePathname();

  return (
    <nav
      className={
        layout === "column" ? "space-y-1" : "-mx-1 flex gap-1 overflow-x-auto whitespace-nowrap pb-1"
      }
    >
      {items.map((item) => {
        const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={clsx(
              "flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-[var(--color-accent)] font-semibold text-[var(--color-ink)]"
                : "text-[var(--color-ink-soft)] hover:bg-[var(--color-accent-tint)] hover:text-[var(--color-ink)]"
            )}
          >
            {item.label}
            {item.badge ? (
              <span className="rounded-full border-2 border-[var(--color-ink)] bg-white px-1.5 text-xs font-bold text-[var(--color-ink)]">
                {item.badge}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
