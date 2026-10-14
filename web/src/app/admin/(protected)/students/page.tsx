import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/format";
import ConfirmSubmit from "@/components/admin/ConfirmSubmit";
import Link from "next/link";
import clsx from "clsx";
import { grantCourseAction, revokeCourseAction, setPersonalStudentAction } from "@/lib/actions/admin/students";
import { getWordsOverview } from "@/lib/words/stats";
import { ALL_CARDS } from "@/lib/words/cards";

/**
 * Ученики: курсы, тренажёр словарных слов и метка «Мой ученик».
 * Фильтр «Мои ученики» — те, кого Анна отметила сама.
 */
export default async function AdminStudentsPage(props: PageProps<"/admin/students">) {
  const { filter } = await props.searchParams;
  const onlyMine = filter === "mine";
  const [users, courses, mineCount] = await Promise.all([
    prisma.user.findMany({
      where: { role: { in: ["STUDENT", "PARENT"] }, ...(onlyMine ? { isPersonalStudent: true } : {}) },
      orderBy: [{ isPersonalStudent: "desc" }, { createdAt: "desc" }],
      include: {
        enrollments: { include: { course: true } },
        progress: { where: { completed: true }, select: { lesson: { select: { module: { select: { courseId: true } } } } } },
        _count: { select: { courseRequests: true } },
      },
    }),
    prisma.course.findMany({
      orderBy: { order: "asc" },
      include: { modules: { select: { _count: { select: { lessons: true } } } } },
    }),
    prisma.user.count({ where: { isPersonalStudent: true } }),
  ]);
  const words = await getWordsOverview(users.map((u) => u.id));
  const totalWords = ALL_CARDS.length;
  const lessonsInCourse = new Map(courses.map((c) => [c.id, c.modules.reduce((n, m) => n + m._count.lessons, 0)]));

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-[var(--color-ink)]">Ученики</h1>

      <div className="mt-4 flex gap-2 text-sm font-semibold">
        {[
          { href: "/admin/students", label: "Все", active: !onlyMine },
          { href: "/admin/students?filter=mine", label: `Мои ученики · ${mineCount}`, active: onlyMine },
        ].map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={clsx(
              "rounded-full border-2 border-[var(--color-ink)] px-4 py-1.5 transition-colors",
              tab.active ? "bg-[var(--color-ink)] text-white" : "bg-white text-[var(--color-ink)] hover:bg-[var(--color-primary-tint)]"
            )}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {users.length === 0 && (
        <p className="mt-6 text-[var(--color-ink-soft)]">
          {onlyMine
            ? "Пока никто не отмечен. Нажмите «Мой ученик» у нужного человека во вкладке «Все»."
            : "Пока никто не зарегистрировался."}
        </p>
      )}

      <div className="mt-6 space-y-4">
        {users.map((user) => {
          const enrolledCourseIds = new Set(user.enrollments.map((e) => e.courseId));
          const availableCourses = courses.filter((c) => !enrolledCourseIds.has(c.id));
          const w = words.get(user.id);

          return (
            <div key={user.id} className="rounded-2xl border-2 border-[var(--color-ink)] bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-[var(--color-ink)]">
                    {user.name}
                    <span className="ml-2 rounded-full bg-[var(--color-primary-soft)] px-2 py-0.5 text-xs font-semibold text-[var(--color-primary)]">
                      {user.role === "PARENT" ? "Родитель" : "Ученик"}
                    </span>
                    {user.isPersonalStudent && (
                      <span className="ml-1.5 rounded-full bg-[var(--color-ink)] px-2 py-0.5 text-xs font-semibold text-white">
                        мой ученик
                      </span>
                    )}
                    {user._count.courseRequests > 0 && (
                      <span className="ml-1.5 rounded-full bg-[var(--color-accent-soft)] px-2 py-0.5 text-xs font-semibold text-[var(--color-accent-dark)]">
                        заявка на платный курс
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-[var(--color-ink-soft)]">
                    {[user.role === "PARENT" ? `Ребёнок: ${user.studentName}` : null, user.studentAge ? `${user.studentAge} лет` : null]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                  <p className="text-xs text-[var(--color-ink-soft)]">
                    {[user.phone, user.email].filter(Boolean).join(" · ") || "Без контактов"} ·
                    зарегистрирован {formatDate(user.createdAt)}
                  </p>
                </div>
                <form action={setPersonalStudentAction.bind(null, user.id, !user.isPersonalStudent)}>
                  <button
                    type="submit"
                    className={clsx(
                      "rounded-full border-2 border-[var(--color-ink)] px-3 py-1 text-xs font-semibold transition-colors",
                      user.isPersonalStudent
                        ? "bg-white text-[var(--color-ink-soft)] hover:bg-[var(--color-bg)]"
                        : "bg-white text-[var(--color-ink)] hover:bg-[var(--color-primary-tint)]"
                    )}
                  >
                    {user.isPersonalStudent ? "Снять метку" : "Мой ученик"}
                  </button>
                </form>
              </div>

              <Link
                href={`/admin/students/${user.id}`}
                className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[var(--color-primary-tint)] px-3 py-2 text-xs transition-colors hover:bg-[var(--color-primary-soft)]"
              >
                <span className="text-[var(--color-ink)]">
                  <b>Словарные слова:</b>{" "}
                  {w
                    ? `выучено ${w.learned} из ${totalWords} · в работе ${w.started - w.learned} · ошибок ${w.mistakes} · был ${formatDate(w.lastActiveAt ?? user.createdAt)}`
                    : "ещё не начинал"}
                </span>
                <span className="font-semibold text-[var(--color-primary)]">Статистика →</span>
              </Link>

              <div className="mt-3 flex flex-wrap gap-2">
                {user.enrollments.map((e) => (
                  <div
                    key={e.id}
                    className="flex items-center gap-2 rounded-full bg-[var(--color-bg)] px-3 py-1.5 text-xs"
                  >
                    <span className="font-medium text-[var(--color-ink)]">{e.course.title}</span>
                    <span className="text-[var(--color-ink-soft)]">
                      пройдено {user.progress.filter((p) => p.lesson.module.courseId === e.courseId).length} из{" "}
                      {lessonsInCourse.get(e.courseId) ?? 0}
                    </span>
                    <form action={revokeCourseAction.bind(null, user.id, e.courseId)}>
                      <ConfirmSubmit
                        label="✕"
                        confirmText="Забрать доступ к курсу у этого пользователя?"
                        className="text-red-500 hover:text-red-700"
                      />
                    </form>
                  </div>
                ))}
              </div>

              {availableCourses.length > 0 && (
                <form
                  action={async (formData: FormData) => {
                    "use server";
                    const courseId = String(formData.get("courseId") ?? "");
                    if (courseId) await grantCourseAction(user.id, courseId);
                  }}
                  className="mt-3 flex items-center gap-2"
                >
                  <select
                    name="courseId"
                    className="rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-xs"
                  >
                    {availableCourses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    className="rounded-lg border border-[var(--color-border)] px-2.5 py-1.5 text-xs font-medium text-[var(--color-ink-soft)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                  >
                    Открыть доступ вручную
                  </button>
                </form>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
