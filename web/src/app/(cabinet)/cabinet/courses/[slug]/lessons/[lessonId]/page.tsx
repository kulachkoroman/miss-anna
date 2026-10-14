import Link from "next/link";
import { notFound } from "next/navigation";
import clsx from "clsx";
import { calcProgress } from "@/lib/progress";
import { getEnrolledCourse } from "@/lib/cabinet-course";
import Icon, { type IconName } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import VideoPlayer from "@/components/cabinet/VideoPlayer";
import CompleteButton from "@/components/cabinet/CompleteButton";
import PaidRequestForm from "@/components/cabinet/PaidRequestForm";
import { COURSE_FINISH, LESSON_TEXTS } from "@/content/course";

/**
 * Страница урока — в том порядке, в каком с ним работают:
 * перед уроком → видео → конспект с заданиями → ответы → после практики.
 * На последнем уроке вместо «после практики» — финал курса и заявка
 * на платный курс. Справа — программа курса с отметками, она остаётся
 * на экране при прокрутке.
 */

const DOC_META: Record<string, { icon: IconName; note: string }> = {
  NOTES: { icon: "document", note: "Теория, задания и текст произведения" },
  ANSWERS: { icon: "check", note: "Открывай после своей попытки" },
  MOCK: { icon: "clock", note: "Открой, когда готов писать — до 235 минут" },
};

export default async function LessonPage(props: PageProps<"/cabinet/courses/[slug]/lessons/[lessonId]">) {
  const { slug, lessonId } = await props.params;
  const { user, course, lessons, completedIds } = await getEnrolledCourse(slug);

  const lessonIndex = lessons.findIndex((item) => item.id === lessonId);
  const lesson = lessons[lessonIndex];
  if (!lesson) notFound();

  const prevLesson = lessonIndex > 0 ? lessons[lessonIndex - 1] : null;
  const nextLesson = lessonIndex < lessons.length - 1 ? lessons[lessonIndex + 1] : null;
  const isLast = !nextLesson;
  const progress = calcProgress(course.modules, completedIds);
  const isCompleted = completedIds.has(lesson.id);
  const docs = course.docs.filter((d) => d.lessonId === lesson.id);
  const routeDoc = course.docs.find((d) => d.kind === "ROUTE");

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-12">
      <div className="min-w-0">
        <Link
          href={`/cabinet/courses/${slug}`}
          className="group inline-flex items-center gap-2 text-caption font-semibold text-[var(--color-ink-muted)] transition-colors hover:text-[var(--color-primary)]"
        >
          <Icon name="arrowRight" className="h-4 w-4 rotate-180 transition-transform duration-300 group-hover:-translate-x-1" />
          Программа курса
        </Link>

        <Reveal immediate>
          <p className="mt-5 text-eyebrow uppercase text-[var(--color-primary)]">
            Урок {lessonIndex + 1} из {lessons.length}
          </p>
          <h1 className="mt-3 text-balance text-h2 text-[var(--color-ink)]">{lesson.title}</h1>
          {lesson.description && <p className="mt-4 max-w-2xl text-[var(--color-ink-soft)]">{lesson.description}</p>}
        </Reveal>

        {lesson.prep && (
          <Callout icon="document" title="Перед уроком" className="mt-7">
            {lesson.prep}
          </Callout>
        )}

        <div className="mt-8">
          <VideoPlayer lessonId={lesson.id} hasVideo={Boolean(lesson.videoPath)} />
          <p className="mt-4 flex gap-2.5 text-[0.9375rem] text-[var(--color-ink-soft)]">
            <Icon name="play" className="mt-1 h-4 w-4 text-[var(--color-primary)]" />
            {LESSON_TEXTS.beforeVideo}
          </p>
        </div>

        {(docs.length > 0 || lesson.materials.length > 0) && (
          <section className="mt-9">
            <h2 className="text-h4 text-[var(--color-ink)]">Материалы урока</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {docs.map((doc) => {
                const meta = DOC_META[doc.kind] ?? DOC_META.NOTES;
                return (
                  <Link
                    key={doc.id}
                    href={`/cabinet/courses/${slug}/docs/${doc.id}`}
                    className={clsx(
                      "group flex items-center gap-4 rounded-card border-2 border-[var(--color-ink)] p-4 shadow-hard-sm transition-[translate,box-shadow] duration-150 hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-hard sm:p-5",
                      doc.kind === "NOTES" ? "bg-[var(--color-accent)]" : "bg-white"
                    )}
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border-2 border-[var(--color-ink)] bg-white text-[var(--color-ink)]">
                      <Icon name={meta.icon} className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-bold text-[var(--color-ink)]">{doc.title}</span>
                      <span className="mt-0.5 block text-caption text-[var(--color-ink-soft)]">{meta.note}</span>
                    </span>
                    <Icon name="arrowRight" className="h-5 w-5 shrink-0 text-[var(--color-ink)] transition-transform group-hover:translate-x-1" />
                  </Link>
                );
              })}

              {lesson.materials.map((material) => (
                <a
                  key={material.id}
                  href={`/api/files/${material.id}`}
                  target={material.downloadAllowed ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 rounded-card border-2 border-[var(--color-ink)] bg-white p-4 shadow-hard-sm transition-[translate,box-shadow] duration-150 hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-hard sm:p-5"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border-2 border-[var(--color-ink)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
                    <Icon name="document" className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1 truncate font-bold text-[var(--color-ink)]">{material.fileName}</span>
                  <Icon name="arrowUpRight" className="h-5 w-5 shrink-0 text-[var(--color-ink)]" />
                </a>
              ))}
            </div>
          </section>
        )}

        {!isLast && (
          <Callout icon="refresh" title="После практики" className="mt-9">
            {LESSON_TEXTS.afterPractice}
          </Callout>
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

        {isLast && (
          <section className="relative mt-12 overflow-hidden rounded-hero border-2 border-[var(--color-ink)] bg-[var(--color-primary)] p-7 text-white shadow-hard-lg sm:p-10">
            <div aria-hidden className="bg-grid-light pointer-events-none absolute inset-0" />
            <div className="relative">
              <p className="font-hand text-[1.75rem] font-bold leading-none text-[var(--color-accent)]">финиш!</p>
              <h2 className="mt-3 text-h3 text-white">{COURSE_FINISH.title}</h2>
              <p className="mt-3 max-w-2xl text-white/80">{COURSE_FINISH.text}</p>

              <div className="mt-8 border-t-2 border-dashed border-white/25 pt-8">
                <h3 className="text-h4 text-white">{COURSE_FINISH.nextTitle}</h3>
                <p className="mt-2 max-w-2xl text-white/80">{COURSE_FINISH.nextText}</p>
                <div className="mt-6">
                  <PaidRequestForm defaultName={user.studentName || user.name} defaultEmail={user.email ?? ""} />
                </div>
              </div>
            </div>
          </section>
        )}
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
              <span className="font-display text-caption font-bold text-[var(--color-ink)]">{progress.percent}%</span>
            </div>
          </div>

          <ul>
            {lessons.map((item, i) => {
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
                          : "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-[var(--color-border-strong)] text-[0.625rem] font-bold"
                      }
                    >
                      {done ? <Icon name="check" className="h-3 w-3" strokeWidth={3} /> : i + 1}
                    </span>
                    {item.title}
                  </Link>
                </li>
              );
            })}
          </ul>

          {routeDoc && (
            <Link
              href={`/cabinet/courses/${slug}/docs/${routeDoc.id}`}
              className="flex items-center gap-2.5 border-t-2 border-[var(--color-ink)] px-5 py-3.5 text-[0.875rem] font-semibold text-[var(--color-primary)] hover:bg-[var(--color-accent-tint)]"
            >
              <Icon name="document" className="h-4 w-4" />
              {routeDoc.title}
            </Link>
          )}
        </div>
      </aside>
    </div>
  );
}

function Callout({
  icon,
  title,
  children,
  className,
}: {
  icon: IconName;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx("flex gap-4 rounded-card border-2 border-[var(--color-ink)] bg-[var(--color-accent-tint)] p-5", className)}>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-[var(--color-ink)] bg-[var(--color-accent)] text-[var(--color-ink)]">
        <Icon name={icon} className="h-5 w-5" />
      </span>
      <div>
        <p className="font-bold text-[var(--color-ink)]">{title}</p>
        <p className="mt-1 text-[0.9375rem] leading-relaxed text-[var(--color-ink-soft)]">{children}</p>
      </div>
    </div>
  );
}
