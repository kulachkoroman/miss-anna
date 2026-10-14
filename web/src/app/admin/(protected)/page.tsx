import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/format";
import { FREE_COURSE_SLUG } from "@/content/course";

/**
 * Обзор: сколько людей пришло на бесплатный курс и дошло до конца,
 * сколько новых заявок на платный курс и готов ли сам курс (видео).
 */
export default async function AdminDashboardPage() {
  const course = await prisma.course.findUnique({
    where: { slug: FREE_COURSE_SLUG },
    include: { modules: { include: { lessons: { select: { id: true, title: true, videoPath: true } } } } },
  });
  const lessons = course?.modules.flatMap((m) => m.lessons) ?? [];
  const lessonIds = lessons.map((l) => l.id);

  const [students, enrolled, completedByUser, newRequests, recentRequests] = await Promise.all([
    prisma.user.count({ where: { role: { in: ["STUDENT", "PARENT"] } } }),
    course ? prisma.enrollment.count({ where: { courseId: course.id } }) : 0,
    prisma.lessonProgress.groupBy({
      by: ["userId"],
      where: { completed: true, lessonId: { in: lessonIds } },
      _count: { _all: true },
    }),
    prisma.paidCourseRequest.count({ where: { status: "NEW" } }),
    prisma.paidCourseRequest.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  const finished = completedByUser.filter((row) => lessonIds.length > 0 && row._count._all >= lessonIds.length).length;
  const withVideo = lessons.filter((l) => l.videoPath).length;

  const stats = [
    { label: "Зарегистрировались", value: students },
    { label: "Записались на курс", value: enrolled },
    { label: "Прошли все уроки", value: finished },
    { label: "Новых заявок", value: newRequests, href: "/admin/requests" },
  ];

  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-extrabold text-[var(--color-ink)]">Обзор</h1>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {stats.map((s) => {
          const box = (
            <div className="h-full rounded-2xl border-2 border-[var(--color-ink)] bg-white p-4 sm:p-5">
              <p className="text-2xl font-extrabold text-[var(--color-ink)]">{s.value}</p>
              <p className="mt-1 text-sm text-[var(--color-ink-soft)]">{s.label}</p>
            </div>
          );
          return s.href ? (
            <Link key={s.label} href={s.href} className="block transition-transform hover:-translate-y-0.5">
              {box}
            </Link>
          ) : (
            <div key={s.label}>{box}</div>
          );
        })}
      </div>

      {course && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border-2 border-[var(--color-ink)] bg-[var(--color-accent-tint)] p-5">
          <div>
            <p className="font-bold text-[var(--color-ink)]">
              Видео загружено: {withVideo} из {lessons.length}
            </p>
            <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
              {withVideo < lessons.length
                ? "Пока видео нет, ученики видят «Видео скоро появится», конспекты и задания уже открыты."
                : "Все уроки с видео."}
            </p>
          </div>
          <Link
            href={`/admin/courses/${course.id}`}
            className="rounded-full border-2 border-[var(--color-ink)] bg-[var(--color-primary)] px-4 py-2 text-sm font-bold text-white shadow-hard-sm"
          >
            Открыть курс
          </Link>
        </div>
      )}

      <div className="mt-6 rounded-2xl border-2 border-[var(--color-ink)] bg-white p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-sans text-sm font-semibold uppercase tracking-wide text-[var(--color-primary)]">
            Последние заявки на платный курс
          </h2>
          <Link href="/admin/requests" className="text-sm text-[var(--color-primary)] hover:underline">
            Все заявки →
          </Link>
        </div>
        {recentRequests.length === 0 ? (
          <p className="text-sm text-[var(--color-ink-soft)]">Заявок пока нет. Они приходят с финала бесплатного курса.</p>
        ) : (
          <ul className="divide-y divide-[var(--color-border)]">
            {recentRequests.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5 text-sm">
                <span className="font-medium text-[var(--color-ink)]">{r.name}</span>
                <a href={`mailto:${r.email}`} className="text-[var(--color-primary)] hover:underline">
                  {r.email}
                </a>
                <span className="text-[var(--color-ink-soft)]">{formatDateTime(r.createdAt)}</span>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    r.status === "NEW" ? "bg-[var(--color-accent-soft)] text-[var(--color-accent-dark)]" : "bg-green-100 text-green-700"
                  }`}
                >
                  {r.status === "NEW" ? "Новая" : "Обработана"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
