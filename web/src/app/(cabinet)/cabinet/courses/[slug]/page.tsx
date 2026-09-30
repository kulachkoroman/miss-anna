import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { plural } from "@/lib/format";
import { calcProgress, findNextLesson } from "@/lib/progress";
import { courseCoverSpec } from "@/content/media";
import MediaSlot from "@/components/ui/MediaSlot";
import ProgressRing from "@/components/ui/ProgressRing";
import Icon from "@/components/ui/Icon";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";

/**
 * Страница курса в кабинете.
 *
 * Показывает не просто список уроков, а состояние каждого: пройден,
 * следующий по очереди или ещё не начат. Плюс прогресс отдельно по каждому
 * модулю — видно, где именно человек остановился.
 */
export default async function CabinetCoursePage(
  props: PageProps<"/cabinet/courses/[slug]">
) {
  const { slug } = await props.params;
  const user = await getCurrentUser();
  if (!user) return null;

  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: { lessons: { orderBy: { order: "asc" } } },
      },
    },
  });
  if (!course) notFound();

  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: user.id, courseId: course.id } },
  });
  if (!enrollment) redirect(`/courses/${slug}`);

  const progressRows = await prisma.lessonProgress.findMany({
    where: { userId: user.id, completed: true, lesson: { module: { courseId: course.id } } },
  });
  const completedIds = new Set(progressRows.map((row) => row.lessonId));

  const progress = calcProgress(course.modules, completedIds);
  const nextLesson = findNextLesson(course.modules, completedIds);

  return (
    <div className="space-y-8">
      <Link
        href="/cabinet"
        className="group inline-flex items-center gap-2 text-caption font-semibold text-[var(--color-ink-muted)] transition-colors hover:text-[var(--color-primary)]"
      >
        <Icon
          name="arrowRight"
          className="h-4 w-4 rotate-180 transition-transform duration-300 group-hover:-translate-x-1"
        />
        Мои курсы
      </Link>

      <Reveal>
        <section className="overflow-hidden rounded-hero border-2 border-[var(--color-ink)] bg-[var(--color-surface)] shadow-hard-lg">
          <MediaSlot
            spec={courseCoverSpec(course)}
            overlay="bottom"
            sizes="(max-width: 1024px) 100vw, 64rem"
            className="aspect-[16/6] w-full border-b-2 border-[var(--color-ink)] sm:aspect-[24/6]"
          >
            <div className="flex h-full items-end p-7 sm:p-9">
              <h1 className="text-balance text-h2 text-white">{course.title}</h1>
            </div>
          </MediaSlot>

          <div className="flex flex-col gap-7 p-7 sm:flex-row sm:items-center sm:justify-between sm:p-9">
            <div className="flex items-center gap-6">
              <ProgressRing percent={progress.percent} size={96} strokeWidth={8} />
              <div>
                <p className="text-h4 text-[var(--color-ink)]">
                  {progress.done} из {progress.total}{" "}
                  {plural(progress.total, ["урока", "уроков", "уроков"])}
                </p>
                <p className="mt-1 text-caption text-[var(--color-ink-soft)]">
                  {nextLesson ? "Курс в процессе" : "Курс пройден полностью"}
                </p>
              </div>
            </div>

            {nextLesson && (
              <Link
                href={`/cabinet/courses/${slug}/lessons/${nextLesson.id}`}
                className="inline-flex shrink-0 items-center gap-2.5 rounded-full px-6 py-3 border-2 border-[var(--color-ink)] bg-[var(--color-primary)] font-bold text-white shadow-hard transition-[translate,box-shadow] duration-150 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-hard-sm active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
              >
                <Icon name="play" className="h-5 w-5" />
                {progress.done === 0 ? "Начать обучение" : "Продолжить"}
              </Link>
            )}
          </div>
        </section>
      </Reveal>

      <RevealGroup stagger={0.08} className="space-y-5">
        {course.modules.map((module, moduleIndex) => {
          const moduleProgress = calcProgress([module], completedIds);

          return (
            <RevealItem key={module.id}>
              <section className="overflow-hidden rounded-panel border-2 border-[var(--color-ink)] bg-[var(--color-surface)] shadow-hard">
                <header className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-[var(--color-ink)] px-6 py-5">
                  <div className="flex items-center gap-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-[var(--color-ink)] bg-[var(--color-accent)] font-display text-caption font-bold text-[var(--color-ink)]">
                      {moduleIndex + 1}
                    </span>
                    <h2 className="text-h4 text-[var(--color-ink)]">{module.title}</h2>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-3 w-24 overflow-hidden rounded-full border-2 border-[var(--color-ink)] bg-white">
                      <div
                        className="h-full rounded-full bg-[var(--color-primary)] transition-[width] duration-700 ease-[var(--ease-out-expo)]"
                        style={{ width: `${moduleProgress.percent}%` }}
                      />
                    </div>
                    <span className="text-caption text-[var(--color-ink-muted)]">
                      {moduleProgress.done}/{moduleProgress.total}
                    </span>
                  </div>
                </header>

                <ul className="divide-y divide-[var(--color-border)]">
                  {module.lessons.map((lesson, lessonIndex) => {
                    const done = completedIds.has(lesson.id);
                    const isNext = nextLesson?.id === lesson.id;

                    return (
                      <li key={lesson.id}>
                        <Link
                          href={`/cabinet/courses/${slug}/lessons/${lesson.id}`}
                          className="group flex items-center gap-4 px-6 py-4 transition-colors duration-200 hover:bg-[var(--color-accent-tint)]"
                        >
                          {/* Состояние урока: пройден, следующий по очереди
                              или ещё не начат. */}
                          <span
                            className={
                              done
                                ? "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-[var(--color-ink)] bg-[var(--color-primary)] text-white"
                                : isNext
                                  ? "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-[var(--color-ink)] bg-[var(--color-accent)] text-[var(--color-ink)]"
                                  : "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-[var(--color-border-strong)] text-caption font-semibold text-[var(--color-ink-muted)]"
                            }
                          >
                            {done ? (
                              <Icon name="check" className="h-4 w-4" strokeWidth={2.6} />
                            ) : isNext ? (
                              <Icon name="play" className="h-3.5 w-3.5" />
                            ) : (
                              moduleIndex + 1 + "." + (lessonIndex + 1)
                            )}
                          </span>

                          <span className="flex-1">
                            <span
                              className={
                                done
                                  ? "block text-[var(--color-ink-muted)]"
                                  : "block font-medium text-[var(--color-ink)]"
                              }
                            >
                              {lesson.title}
                            </span>
                            {isNext && (
                              <span className="mt-0.5 block text-caption font-semibold text-[var(--color-accent-dark)]">
                                Следующий урок
                              </span>
                            )}
                          </span>

                          <Icon
                            name="arrowRight"
                            className="h-5 w-5 shrink-0 text-[var(--color-ink-muted)] transition-transform duration-300 group-hover:translate-x-1"
                          />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            </RevealItem>
          );
        })}
      </RevealGroup>
    </div>
  );
}
