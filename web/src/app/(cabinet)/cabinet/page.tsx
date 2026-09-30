import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatRub, plural } from "@/lib/format";
import { calcProgress, findNextLesson } from "@/lib/progress";
import { supportHref, isExternal } from "@/content/site";
import { courseCoverSpec } from "@/content/media";
import MediaSlot from "@/components/ui/MediaSlot";
import ProgressRing from "@/components/ui/ProgressRing";
import Badge from "@/components/ui/Badge";
import Icon from "@/components/ui/Icon";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";

/**
 * Главная кабинета.
 *
 * Ключевое изменение — кнопка «Продолжить»: она ведёт сразу к первому
 * непройденному уроку. Раньше, чтобы вернуться к обучению, нужно было
 * вспомнить курс, открыть его и найти, на чём остановился.
 */
export default async function CabinetHomePage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const [enrollments, progress, otherCourses] = await Promise.all([
    prisma.enrollment.findMany({
      where: { userId: user.id },
      include: {
        course: {
          include: {
            modules: {
              orderBy: { order: "asc" },
              include: { lessons: { orderBy: { order: "asc" } } },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.lessonProgress.findMany({ where: { userId: user.id, completed: true } }),
    prisma.course.findMany({
      where: { published: true, enrollments: { none: { userId: user.id } } },
      orderBy: { order: "asc" },
    }),
  ]);

  const completedIds = new Set(progress.map((p) => p.lessonId));

  const courses = enrollments.map((enrollment) => ({
    enrollmentId: enrollment.id,
    course: enrollment.course,
    progress: calcProgress(enrollment.course.modules, completedIds),
    nextLesson: findNextLesson(enrollment.course.modules, completedIds),
  }));

  const overall = calcProgress(
    enrollments.flatMap((enrollment) => enrollment.course.modules),
    completedIds
  );

  /* Продолжаем с курса, в котором ещё остались непройденные уроки. */
  const continueFrom = courses.find((item) => item.nextLesson !== null) ?? null;

  return (
    <div className="space-y-10">
      <Reveal>
        <section className="overflow-hidden rounded-hero border border-[var(--color-border)] bg-[var(--color-surface)] shadow-subtle">
          <div className="flex flex-col gap-8 p-7 sm:p-9 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <Badge>{user.role === "PARENT" ? "Аккаунт родителя" : "Аккаунт ученика"}</Badge>
              <h1 className="mt-4 text-h2 text-[var(--color-ink)]">
                Здравствуйте, {user.studentName || user.name}
              </h1>
              <p className="mt-3 max-w-lg text-[var(--color-ink-soft)]">
                {enrollments.length === 0
                  ? "Здесь появятся ваши курсы и прогресс — сразу после записи на первый."
                  : continueFrom
                    ? "Прогресс сохраняется сам. Можно продолжить с того места, где остановились."
                    : "Все уроки пройдены. При желании можно вернуться к любому разделу."}
              </p>

              {continueFrom?.nextLesson && (
                <Link
                  href={`/cabinet/courses/${continueFrom.course.slug}/lessons/${continueFrom.nextLesson.id}`}
                  className="mt-7 inline-flex items-center gap-2.5 rounded-full bg-[var(--color-primary)] px-6 py-3.5 font-semibold text-white shadow-primary transition-all duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-0.5 hover:bg-[var(--color-primary-dark)]"
                >
                  <Icon name="play" className="h-5 w-5" />
                  Продолжить: {continueFrom.nextLesson.title}
                </Link>
              )}
            </div>

            {enrollments.length > 0 && (
              <div className="flex items-center gap-8">
                <ProgressRing percent={overall.percent} label="пройдено" />
                <dl className="space-y-4">
                  <div>
                    <dt className="text-caption text-[var(--color-ink-muted)]">Курсов открыто</dt>
                    <dd className="text-h3 text-[var(--color-ink)]">{enrollments.length}</dd>
                  </div>
                  <div>
                    <dt className="text-caption text-[var(--color-ink-muted)]">Уроков пройдено</dt>
                    <dd className="text-h3 text-[var(--color-ink)]">
                      {overall.done}
                      <span className="text-[var(--color-ink-muted)]">/{overall.total}</span>
                    </dd>
                  </div>
                </dl>
              </div>
            )}
          </div>
        </section>
      </Reveal>

      {courses.length === 0 ? (
        <Reveal>
          <div className="rounded-hero border border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface)] p-12 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
              <Icon name="graduation" className="h-7 w-7" />
            </span>
            <p className="mt-5 text-h4 text-[var(--color-ink)]">Пока нет открытых курсов</p>
            <p className="mx-auto mt-2 max-w-sm text-[var(--color-ink-soft)]">
              Начать можно с бесплатного курса — доступ откроется сразу, платить не нужно.
            </p>
            <Link
              href="/courses"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-6 py-3 font-semibold text-white transition-all duration-300 hover:-translate-y-0.5"
            >
              Смотреть каталог
              <Icon name="arrowRight" className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      ) : (
        <section>
          <h2 className="text-h3 text-[var(--color-ink)]">Мои курсы</h2>
          <RevealGroup stagger={0.1} className="mt-6 grid gap-6 sm:grid-cols-2">
            {courses.map((item) => (
              <RevealItem key={item.enrollmentId} className="h-full">
                <Link
                  href={`/cabinet/courses/${item.course.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-panel border border-[var(--color-border)] bg-[var(--color-surface)] transition-[transform,box-shadow] duration-400 ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:shadow-lift"
                >
                  <MediaSlot
                    spec={courseCoverSpec(item.course)}
                    overlay="bottom"
                    sizes="(max-width: 640px) 100vw, 45vw"
                    className="aspect-[16/7] w-full"
                    imageClassName="transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-105"
                  />

                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-h4 text-[var(--color-ink)]">{item.course.title}</h3>

                    <p className="mt-2 flex-1 text-caption text-[var(--color-ink-soft)]">
                      {item.progress.done} из {item.progress.total}{" "}
                      {plural(item.progress.total, ["урока", "уроков", "уроков"])} пройдено
                    </p>

                    <div className="mt-5 flex items-center gap-3">
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-[var(--color-primary)]/10">
                        <div
                          className="h-full rounded-full bg-[var(--color-primary)] transition-[width] duration-700 ease-[var(--ease-out-expo)]"
                          style={{ width: `${item.progress.percent}%` }}
                        />
                      </div>
                      <span className="text-caption font-bold text-[var(--color-primary)]">
                        {item.progress.percent}%
                      </span>
                    </div>
                  </div>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        </section>
      )}

      {otherCourses.length > 0 && (
        <section>
          <h2 className="text-h3 text-[var(--color-ink)]">Ещё доступно</h2>
          <RevealGroup stagger={0.08} className="mt-6 grid gap-4 sm:grid-cols-2">
            {otherCourses.map((course) => (
              <RevealItem key={course.id}>
                <Link
                  href={`/courses/${course.slug}`}
                  className="group flex items-center justify-between gap-4 rounded-card border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition-all duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:shadow-card"
                >
                  <div>
                    <p className="font-semibold text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-primary)]">
                      {course.title}
                    </p>
                    <p className="mt-1 text-caption text-[var(--color-ink-soft)]">
                      {course.isFree ? "Бесплатно" : formatRub(course.priceRub)}
                    </p>
                  </div>
                  <Icon
                    name="arrowRight"
                    className="h-5 w-5 shrink-0 text-[var(--color-ink-muted)] transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        </section>
      )}

      <Reveal>
        <div className="flex flex-col items-start justify-between gap-5 rounded-panel bg-[var(--color-primary-soft)] p-7 sm:flex-row sm:items-center">
          <div className="flex gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-primary)] text-white">
              <Icon name="chat" className="h-5 w-5" />
            </span>
            <div>
              <p className="text-h4 text-[var(--color-ink)]">Остались вопросы по курсу?</p>
              <p className="mt-1 text-[0.9375rem] text-[var(--color-ink-soft)]">
                Напишите мне — отвечу и помогу разобраться.
              </p>
            </div>
          </div>
          <a
            href={supportHref()}
            {...(isExternal(supportHref()) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[var(--color-primary)] px-6 py-3 font-semibold text-white transition-all duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-0.5 hover:bg-[var(--color-primary-dark)]"
          >
            Написать
            <Icon name="arrowRight" className="h-4 w-4" />
          </a>
        </div>
      </Reveal>
    </div>
  );
}
