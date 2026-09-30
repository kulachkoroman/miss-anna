import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calcProgress } from "@/lib/progress";
import Icon from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import VideoPlayer from "@/components/cabinet/VideoPlayer";
import CompleteButton from "@/components/cabinet/CompleteButton";

/**
 * Страница урока.
 *
 * Слева — видео, описание, материалы и переходы между уроками.
 * Справа — список всех уроков курса с отметками о прохождении: он остаётся
 * на экране при прокрутке, поэтому место в программе не теряется.
 */
export default async function LessonPage(
  props: PageProps<"/cabinet/courses/[slug]/lessons/[lessonId]">
) {
  const { slug, lessonId } = await props.params;
  const user = await getCurrentUser();
  if (!user) return null;

  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: { lessons: { orderBy: { order: "asc" }, include: { materials: true } } },
      },
    },
  });
  if (!course) notFound();

  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: user.id, courseId: course.id } },
  });
  if (!enrollment) redirect(`/courses/${slug}`);

  const allLessons = course.modules.flatMap((module) => module.lessons);
  const lessonIndex = allLessons.findIndex((item) => item.id === lessonId);
  const lesson = allLessons[lessonIndex];
  if (!lesson) notFound();

  const prevLesson = lessonIndex > 0 ? allLessons[lessonIndex - 1] : null;
  const nextLesson = lessonIndex < allLessons.length - 1 ? allLessons[lessonIndex + 1] : null;

  const progressRows = await prisma.lessonProgress.findMany({
    where: { userId: user.id, completed: true, lesson: { module: { courseId: course.id } } },
  });
  const completedIds = new Set(progressRows.map((row) => row.lessonId));
  const progress = calcProgress(course.modules, completedIds);
  const isCompleted = completedIds.has(lesson.id);

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-12">
      <div>
        <Link
          href={`/cabinet/courses/${slug}`}
          className="group inline-flex items-center gap-2 text-caption font-semibold text-[var(--color-ink-muted)] transition-colors hover:text-[var(--color-primary)]"
        >
          <Icon
            name="arrowRight"
            className="h-4 w-4 rotate-180 transition-transform duration-300 group-hover:-translate-x-1"
          />
          {course.title}
        </Link>

        <Reveal immediate>
          <p className="mt-5 text-eyebrow uppercase text-[var(--color-primary)]">
            Урок {lessonIndex + 1} из {allLessons.length}
          </p>
          <h1 className="mt-3 text-balance text-h2 text-[var(--color-ink)]">{lesson.title}</h1>
          {lesson.description && (
            <p className="mt-4 max-w-2xl text-[var(--color-ink-soft)]">{lesson.description}</p>
          )}
        </Reveal>

        <div className="mt-8">
          <VideoPlayer lessonId={lesson.id} hasVideo={Boolean(lesson.videoPath)} />
        </div>

        {lesson.materials.length > 0 && (
          <section className="mt-8 rounded-panel border-2 border-[var(--color-ink)] bg-[var(--color-surface)] p-6 shadow-hard sm:p-7">
            <h2 className="flex items-center gap-2.5 text-h4 text-[var(--color-ink)]">
              <Icon name="document" className="h-5 w-5 text-[var(--color-primary)]" />
              Материалы урока
            </h2>
            <ul className="mt-5 space-y-2.5">
              {lesson.materials.map((material) => (
                <li key={material.id}>
                  <a
                    href={`/api/files/${material.id}`}
                    target={material.downloadAllowed ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-4 rounded-card border-2 border-[var(--color-ink)] px-5 py-3.5 transition-colors duration-200 hover:bg-[var(--color-accent-tint)]"
                  >
                    <span className="font-medium text-[var(--color-ink)]">{material.fileName}</span>
                    <span className="flex shrink-0 items-center gap-2 text-caption font-semibold text-[var(--color-primary)]">
                      {material.downloadAllowed ? "Скачать" : "Открыть"}
                      <Icon
                        name="arrowUpRight"
                        className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="mt-9 flex flex-wrap items-center justify-between gap-4 border-t-2 border-[var(--color-ink)] pt-7">
          <CompleteButton lessonId={lesson.id} completed={isCompleted} />

          <div className="flex gap-2.5">
            {prevLesson && (
              <Link
                href={`/cabinet/courses/${slug}/lessons/${prevLesson.id}`}
                className="inline-flex items-center gap-2 rounded-full border-2 border-[var(--color-ink)] bg-white px-5 py-2 font-semibold text-[var(--color-ink)] shadow-hard-sm transition-[translate,box-shadow] duration-150 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
              >
                <Icon name="arrowRight" className="h-4 w-4 rotate-180" />
                Назад
              </Link>
            )}
            {nextLesson && (
              <Link
                href={`/cabinet/courses/${slug}/lessons/${nextLesson.id}`}
                className="inline-flex items-center gap-2 rounded-full border-2 border-[var(--color-ink)] bg-[var(--color-primary)] px-5 py-2 font-bold text-white shadow-hard-sm transition-[translate,box-shadow] duration-150 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
              >
                Следующий урок
                <Icon name="arrowRight" className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      </div>

      <aside className="lg:sticky lg:top-8 lg:self-start">
        <div className="overflow-hidden rounded-panel border-2 border-[var(--color-ink)] bg-[var(--color-surface)] shadow-hard">
          <div className="border-b-2 border-[var(--color-ink)] px-5 py-4">
            <p className="text-eyebrow uppercase text-[var(--color-ink-muted)]">Программа курса</p>
            <div className="mt-3 flex items-center gap-3">
              <div className="h-3 flex-1 overflow-hidden rounded-full border-2 border-[var(--color-ink)] bg-white">
                <div
                  className="h-full rounded-full bg-[var(--color-primary)] transition-[width] duration-700 ease-[var(--ease-out-expo)]"
                  style={{ width: `${progress.percent}%` }}
                />
              </div>
              <span className="font-display text-caption font-bold text-[var(--color-ink)]">
                {progress.percent}%
              </span>
            </div>
          </div>

          {/* На узком экране список не должен занимать весь экран,
              на широком он помещается целиком. */}
          <div className="max-h-[26rem] overflow-y-auto lg:max-h-[calc(100svh-16rem)]">
            {course.modules.map((module, moduleIndex) => (
              <div key={module.id}>
                <p className="sticky top-0 bg-[var(--color-surface-alt)] px-5 py-2.5 text-caption font-semibold text-[var(--color-ink-soft)]">
                  {moduleIndex + 1}. {module.title}
                </p>
                <ul>
                  {module.lessons.map((item) => {
                    const done = completedIds.has(item.id);
                    const isCurrent = item.id === lesson.id;

                    return (
                      <li key={item.id}>
                        <Link
                          href={`/cabinet/courses/${slug}/lessons/${item.id}`}
                          aria-current={isCurrent ? "page" : undefined}
                          className={
                            isCurrent
                              ? "flex items-start gap-3 border-l-4 border-[var(--color-ink)] bg-[var(--color-accent-soft)] px-4 py-3 text-[0.9375rem] font-semibold text-[var(--color-ink)]"
                              : "flex items-start gap-3 border-l-2 border-transparent px-[18px] py-3 text-[0.9375rem] text-[var(--color-ink-soft)] transition-colors duration-200 hover:bg-[var(--color-accent-tint)]"
                          }
                        >
                          <span
                            className={
                              done
                                ? "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-[var(--color-ink)] bg-[var(--color-primary)] text-white"
                                : "mt-0.5 h-5 w-5 shrink-0 rounded-full border-2 border-[var(--color-border-strong)]"
                            }
                          >
                            {done && <Icon name="check" className="h-3 w-3" strokeWidth={3} />}
                          </span>
                          {item.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
