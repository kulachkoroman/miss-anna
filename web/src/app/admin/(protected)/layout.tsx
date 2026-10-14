import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { logoutAction } from "@/lib/actions/auth";
import { prisma } from "@/lib/prisma";
import AdminNav, { type AdminNavItem } from "@/components/admin/AdminNav";
import { FREE_COURSE_SLUG } from "@/content/course";

/**
 * Админка под формат «лендинг бесплатного курса»: обзор, курс (сразу
 * редактор бесплатного курса), заявки на платный курс, ученики.
 * Оплата на сайте и отзывы убраны в октябре 2026: платный курс у Анны
 * на другой платформе. Вернуть — из истории git.
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") redirect("/admin/login");

  const [course, newRequests] = await Promise.all([
    prisma.course.findUnique({ where: { slug: FREE_COURSE_SLUG }, select: { id: true } }),
    prisma.paidCourseRequest.count({ where: { status: "NEW" } }),
  ]);

  const items: AdminNavItem[] = [
    { href: "/admin", label: "Обзор" },
    { href: course ? `/admin/courses/${course.id}` : "/admin", label: "Курс" },
    { href: "/admin/requests", label: "Заявки", badge: newRequests },
    { href: "/admin/students", label: "Ученики" },
  ];

  const logout = (
    <form action={logoutAction}>
      <button
        type="submit"
        className="w-full rounded-lg border-2 border-[var(--color-ink)] px-3 py-1.5 text-sm font-semibold text-[var(--color-ink)] transition-colors hover:bg-[#ffd6d6]"
      >
        Выйти
      </button>
    </form>
  );

  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-bg)] sm:flex-row">
      {/* Телефон: шапка с меню в строку */}
      <header className="border-b-2 border-[var(--color-ink)] bg-white px-4 py-3 sm:hidden">
        <div className="mb-2 flex items-center justify-between">
          <span className="font-display text-sm font-bold">Админ-панель</span>
          <div className="w-24">{logout}</div>
        </div>
        <AdminNav items={items} layout="row" />
      </header>

      <aside className="hidden w-60 shrink-0 border-r-2 border-[var(--color-ink)] bg-white p-5 sm:block">
        <div className="mb-8 flex items-center gap-2 font-display text-base font-bold">
          <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[var(--color-ink)] bg-[var(--color-accent)] text-xs text-[var(--color-ink)]">
            АП
          </span>
          Админ-панель
        </div>
        <AdminNav items={items} layout="column" />
        <div className="mt-8">{logout}</div>
      </aside>

      <main className="min-w-0 flex-1 p-4 sm:p-8">{children}</main>
    </div>
  );
}
