import Link from "next/link";
import { plural } from "@/lib/format";
import { calcProgress, findNextLesson } from "@/lib/progress";
import { getEnrolledCourse } from "@/lib/cabinet-course";
import ProgressRing from "@/components/ui/ProgressRing";
import Icon from "@/components/ui/Icon";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";

/**
 * Страница курса в кабинете: прогресс, кнопка «Начать / Продолжить»,
 * шесть уроков по порядку с описаниями и отметками и маршрут со списком
 * чтения. У каждого урока видно состояние: пройден, следующий или впереди.
 */
export default async function CabinetCoursePage(props: PageProps<"/cabinet/courses/[slug]">) {
  const { slug } = await props.params;
  const { course, lessons, completedIds } = await getEnrolledCourse(slug);

  const progress = calcProgress(course.modules, completedIds);
  const nextLesson = findNextLesson(course.modules, completedIds);
  const routeDoc = course.docs.find((d) => d.kind === "ROUTE");
  const lastLesson = lessons[lessons.length - 1];

  return (
    <div className="space-y-8">
      <Link
        href="/cabinet"
        className="group inline-flex items-center gap-2 text-caption font-semibold text-[var(--color-ink-muted)] transition-colors hover:text-[var(--color-primary)]"
      >
        <Icon name="arrowRight" className="h-4 w-4 rotate-180 transition-transform duration-300 group-hover:-translate-x-1" />
        Мой кабинет
      </Link>

      <Reveal>
        <section className="overflow-hidden rounded-hero border-2 border-[var(--color-ink)] bg-[var(--color-surface)] shadow-hard-lg">
          <div className="bg-brand-gradient relative border-b-2 border-[var(--color-ink)] p-7 sm:p-9">
            <div aria-hidden className="bg-grid-light pointer-events-none absolute inset-0" />
            <p className="relative text-[0.75rem] font-bold uppercase tracking-[0.16em] text-white/70">
              Бесплатный курс · {lessons.length} {plural(lessons.length, ["урок", "урока", "уроков"])}
            </p>
            <h1 className="relative mt-3 max-w-3xl text-balance text-h2 text-white">{course.title}</h1>
          </div>

          <div className="flex flex-col gap-7 p-7 sm:flex-row sm:items-center sm:justify-between sm:p-9">
            <div className="flex items-center gap-6">
              <ProgressRing percent={progress.percent} size={96} strokeWidth={8} />
              <div>
                <p className="text-h4 text-[var(--color-ink)]">
                  {progress.done} из {progress.total} {plural(progress.total, ["урока", "уроков", "уроков"])}
                </p>
                <p className="mt-1 text-caption text-[var(--color-ink-soft)]">
                  {nextLesson ? "Уроки в записи, проходи в своём темпе" : "Все уроки отмечены пройденными"}
                </p>
              </div>
            </div>

            <Link
              href={`/cabinet/courses/${slug}/lessons/${(nextLesson ?? lastLesson).id}`}
              className="inline-flex shrink-0 items-center justify-center gap-2.5 rounded-full border-2 border-[var(--color-ink)] bg-[var(--color-accent)] px-6 py-3 font-bold text-[var(--color-ink)] shadow-hard transition-[translate,box-shadow] duration-150 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-hard-sm active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
            >
              <Icon name="play" className="h-5 w-5" />
              {!nextLesson ? "К финалу курса" : progress.done === 0 ? "Начать первый урок" : "Продолжить"}
            </Link>
          </div>
        </section>
      </Reveal>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
        <RevealGroup stagger={0.06} className="space-y-3">
          {lessons.map((lesson, i) => {
            const done = completedIds.has(lesson.id);
            const isNext = nextLesson?.id === lesson.id;
            return (
              <RevealItem key={lesson.id}>
                <Link
                  href={`/cabinet/courses/${slug}/lessons/${lesson.id}`}
                  className={
                    "group flex gap-4 rounded-card border-2 border-[var(--color-ink)] p-5 transition-[translate,box-shadow] duration-150 hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-hard " +
                    (isNext ? "bg-[var(--color-accent-tint)] shadow-hard" : "bg-white shadow-hard-sm")
                  }
                >
                  <span
                    className={
                      done
                        ? "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[var(--color-ink)] bg-[var(--color-primary)] text-white"
                        : isNext
                          ? "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[var(--color-ink)] bg-[var(--color-accent)] font-display font-bold text-[var(--color-ink)]"
                          : "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[var(--color-border-strong)] font-display font-bold text-[var(--color-ink-muted)]"
                    }
                  >
                    {done ? <Icon name="check" className="h-5 w-5" strokeWidth={2.6} /> : i + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-baseline gap-x-3">
                      <span className="font-bold text-[var(--color-ink)]">{lesson.title}</span>
                      {isNext && (
                        <span className="text-caption font-semibold text-[var(--color-accent-dark)]">
                          {progress.done === 0 ? "начни отсюда" : "следующий"}
                        </span>
                      )}
                    </span>
                    {lesson.description && (
                      <span className="mt-1 line-clamp-2 block text-[0.9375rem] text-[var(--color-ink-soft)]">
                        {lesson.description}
                      </span>
                    )}
                  </span>
                  <Icon
                    name="arrowRight"
                    className="mt-2.5 h-5 w-5 shrink-0 text-[var(--color-ink-muted)] transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
              </RevealItem>
            );
          })}
        </RevealGroup>

        {routeDoc && (
          <Reveal delay={0.1} className="lg:sticky lg:top-8">
            <Link
              href={`/cabinet/courses/${slug}/docs/${routeDoc.id}`}
              className="group block rounded-card border-2 border-[var(--color-ink)] bg-[var(--color-accent-tint)] p-6 shadow-hard transition-[translate,box-shadow] duration-150 hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-hard-lg"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-[var(--color-ink)] bg-[var(--color-accent)] text-[var(--color-ink)]">
                <Icon name="document" className="h-5 w-5" />
              </span>
              <p className="mt-4 font-bold text-[var(--color-ink)]">{routeDoc.title}</p>
              <p className="mt-1 text-caption text-[var(--color-ink-soft)]">
                Что прочитать, что подготовить и сколько времени закладывать. Загляни перед первым уроком.
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-caption font-bold text-[var(--color-primary)]">
                Открыть
                <Icon name="arrowRight" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </Reveal>
        )}
      </div>
    </div>
  );
}
