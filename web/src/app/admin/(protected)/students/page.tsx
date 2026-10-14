import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/format";
import ConfirmSubmit from "@/components/admin/ConfirmSubmit";
import { grantCourseAction, revokeCourseAction } from "@/lib/actions/admin/students";

export default async function AdminStudentsPage() {
  const [users, courses] = await Promise.all([
    prisma.user.findMany({
      where: { role: { in: ["STUDENT", "PARENT"] } },
      orderBy: { createdAt: "desc" },
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
  ]);
  const lessonsInCourse = new Map(courses.map((c) => [c.id, c.modules.reduce((n, m) => n + m._count.lessons, 0)]));

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-[var(--color-ink)]">Ученики</h1>

      <div className="mt-6 space-y-4">
        {users.map((user) => {
          const enrolledCourseIds = new Set(user.enrollments.map((e) => e.courseId));
          const availableCourses = courses.filter((c) => !enrolledCourseIds.has(c.id));

          return (
            <div key={user.id} className="rounded-2xl border-2 border-[var(--color-ink)] bg-white p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-semibold text-[var(--color-ink)]">
                    {user.name}
                    <span className="ml-2 rounded-full bg-[var(--color-primary-soft)] px-2 py-0.5 text-xs font-semibold text-[var(--color-primary)]">
                      {user.role === "PARENT" ? "Родитель" : "Ученик"}
                    </span>
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
              </div>

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
