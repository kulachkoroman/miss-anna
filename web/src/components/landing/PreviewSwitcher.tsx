"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

/** Только для черновиков /v/a, /v/b, /v/c: переключатель вариантов. Уйдёт вместе с ними. */
const items = [
  { href: "/v/a", label: "A · Плеер" },
  { href: "/v/b", label: "B · Маршрут" },
  { href: "/v/c", label: "C · Минимум" },
];

export default function PreviewSwitcher() {
  const pathname = usePathname();
  return (
    <div className="fixed bottom-4 right-4 z-50 hidden items-center gap-1 rounded-full border-2 border-[var(--color-ink)] bg-white p-1 shadow-hard md:flex">
      {items.map((i) => (
        <Link
          key={i.href}
          href={i.href}
          className={clsx(
            "rounded-full px-3 py-1.5 text-[0.8125rem] font-bold",
            pathname === i.href ? "bg-[var(--color-ink)] text-white" : "text-[var(--color-ink-soft)] hover:bg-black/5"
          )}
        >
          {i.label}
        </Link>
      ))}
    </div>
  );
}
