import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { logoutAction } from "@/lib/actions/auth";

const navItems = [
  { href: "/admin", label: "Обзор" },
  { href: "/admin/courses", label: "Курсы" },
  { href: "/admin/students", label: "Ученики" },
  { href: "/admin/payments", label: "Платежи" },
  { href: "/admin/reviews", label: "Отзывы" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") redirect("/admin/login");

  return (
    <div className="flex min-h-screen bg-[var(--color-bg)]">
      <aside className="hidden w-64 shrink-0 border-r-2 border-[var(--color-ink)] bg-white p-5 sm:block">
        <div className="mb-8 flex items-center gap-2 font-display text-base font-bold">
          <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[var(--color-ink)] bg-[var(--color-accent)] text-xs text-[var(--color-ink)]">
            АП
          </span>
          Админ-панель
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-[var(--color-ink-soft)] transition-colors hover:bg-[var(--color-accent-tint)] hover:text-[var(--color-ink)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <form action={logoutAction} className="mt-8">
          <button
            type="submit"
            className="w-full rounded-lg border-2 border-[var(--color-ink)] px-3 py-1.5 text-sm font-semibold text-[var(--color-ink)] transition-colors hover:bg-[#ffd6d6]"
          >
            Выйти
          </button>
        </form>
      </aside>
      <main className="flex-1 p-6 sm:p-8">{children}</main>
    </div>
  );
}
