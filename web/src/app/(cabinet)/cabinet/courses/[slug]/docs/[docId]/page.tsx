import Link from "next/link";
import { notFound } from "next/navigation";
import clsx from "clsx";
import Icon from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import CourseText from "@/components/cabinet/CourseText";
import { getEnrolledCourse } from "@/lib/cabinet-course";
import { LESSON_TEXTS } from "@/content/course";

/**
 * Текст курса на отдельной странице: конспект и задания, ответы,
 * темы пробника или маршрут. Читается с телефона как обычная статья,
 * сверху — к какому уроку относится, снизу — соседние тексты урока.
 */
export default async function CourseDocPage(props: PageProps<"/cabinet/courses/[slug]/docs/[docId]">) {
  const { slug, docId } = await props.params;
  const { course, lessons } = await getEnrolledCourse(slug);

  const doc = course.docs.find((d) => d.id === docId);
  if (!doc) notFound();

  const lessonIndex = doc.lessonId ? lessons.findIndex((l) => l.id === doc.lessonId) : -1;
  const lesson = lessonIndex >= 0 ? lessons[lessonIndex] : null;
  const siblings = course.docs.filter((d) => d.lessonId === doc.lessonId && d.id !== doc.id);

  const backHref = lesson ? `/cabinet/courses/${slug}/lessons/${lesson.id}` : `/cabinet/courses/${slug}`;
  const backLabel = lesson ? `Урок ${lessonIndex + 1}. ${lesson.title}` : "К программе курса";

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href={backHref}
        className="group inline-flex items-center gap-2 text-caption font-semibold text-[var(--color-ink-muted)] transition-colors hover:text-[var(--color-primary)]"
      >
        <Icon name="arrowRight" className="h-4 w-4 rotate-180 transition-transform duration-300 group-hover:-translate-x-1" />
        {backLabel}
      </Link>

      <Reveal immediate>
        <p className="mt-5 text-eyebrow uppercase text-[var(--color-primary)]">
          {lesson ? `Урок ${lessonIndex + 1} из ${lessons.length}` : "Бесплатный курс"}
        </p>
        <h1 className="mt-3 text-balance text-h2 text-[var(--color-ink)]">{doc.title}</h1>
      </Reveal>

      {doc.kind === "ANSWERS" && (
        <p className="mt-6 flex gap-3 rounded-card border-2 border-[var(--color-ink)] bg-[var(--color-accent-soft)] p-4 text-[0.9375rem] text-[var(--color-ink)]">
          <Icon name="sparkle" className="mt-0.5 h-5 w-5 text-[var(--color-accent-dark)]" />
          {LESSON_TEXTS.underAnswers}
        </p>
      )}
      {doc.kind === "MOCK" && (
        <p className="mt-6 flex gap-3 rounded-card border-2 border-[var(--color-ink)] bg-[var(--color-accent-soft)] p-4 text-[0.9375rem] text-[var(--color-ink)]">
          <Icon name="clock" className="mt-0.5 h-5 w-5 text-[var(--color-accent-dark)]" />
          {LESSON_TEXTS.beforeMock}
        </p>
      )}

      {/* Лист тетради: клетка и поля слева. */}
      <article className="relative mt-8 overflow-hidden rounded-panel border-2 border-[var(--color-ink)] bg-[var(--color-surface)] shadow-hard">
        <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 opacity-60" />
        <div aria-hidden className="absolute inset-y-0 left-6 w-[2px] bg-[var(--color-accent-dark)] opacity-25 sm:left-10" />
        <div className="relative px-6 py-8 pl-10 sm:px-12 sm:py-10 sm:pl-16">
          <CourseText body={doc.body} />
        </div>
      </article>

      <div className="mt-8 flex flex-wrap gap-3">
        {siblings.map((s) => (
          <Link
            key={s.id}
            href={`/cabinet/courses/${slug}/docs/${s.id}`}
            className="inline-flex items-center gap-2 rounded-full border-2 border-[var(--color-ink)] bg-white px-5 py-2.5 font-semibold text-[var(--color-ink)] shadow-hard-sm transition-[translate,box-shadow] duration-150 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
          >
            <Icon name="document" className="h-4 w-4" />
            {s.title}
          </Link>
        ))}
        <Link
          href={backHref}
          className={clsx(
            "inline-flex items-center gap-2 rounded-full border-2 border-[var(--color-ink)] bg-[var(--color-primary)] px-5 py-2.5 font-bold text-white shadow-hard-sm transition-[translate,box-shadow] duration-150 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
          )}
        >
          {lesson ? "Вернуться к уроку" : "К программе курса"}
          <Icon name="arrowRight" className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
