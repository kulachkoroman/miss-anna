import Link from "next/link";
import { notFound } from "next/navigation";
import type { CourseDoc } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import ConfirmSubmit from "@/components/admin/ConfirmSubmit";
import SaveButton from "@/components/admin/SaveButton";
import VideoUploader from "@/components/admin/VideoUploader";
import {
  createLessonAction,
  updateLessonAction,
  deleteLessonAction,
  moveLessonAction,
  deleteLessonVideoAction,
  uploadMaterialAction,
  toggleMaterialDownloadAction,
  deleteMaterialAction,
} from "@/lib/actions/admin/courses";
import { updateCourseBasicsAction, updateCourseDocAction } from "@/lib/actions/admin/course-content";

/**
 * Редактор бесплатного курса.
 *
 * Уроки — плоским списком (модули у курса Анны не нужны): каждый урок
 * раскрывается и содержит всё, что видит ученик на его странице —
 * название, описание, «перед уроком», видео, тексты (конспект, ответы,
 * темы пробника) и дополнительные файлы. У каждого — «посмотреть как ученик».
 */

const input =
  "w-full rounded-lg border-2 border-[var(--color-ink)] bg-white px-3 py-2 text-sm outline-none transition-shadow focus:shadow-[3px_3px_0_var(--color-accent)]";
const label = "mb-1 block text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-soft)]";
const smallButton =
  "rounded-lg border border-[var(--color-border-strong)] bg-white px-2.5 py-1.5 text-xs font-medium text-[var(--color-ink-soft)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] disabled:opacity-40";
const dangerButton =
  "rounded-lg border border-red-200 bg-white px-2.5 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50";
const card = "rounded-2xl border-2 border-[var(--color-ink)] bg-white";

export default async function AdminCourseEditPage(props: PageProps<"/admin/courses/[id]">) {
  const { id } = await props.params;
  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: { lessons: { orderBy: { order: "asc" }, include: { materials: true } } },
      },
      docs: { orderBy: { order: "asc" } },
    },
  });
  if (!course) notFound();

  const lessons = course.modules.flatMap((m) => m.lessons);
  const firstModule = course.modules[0];
  const routeDoc = course.docs.find((d) => d.kind === "ROUTE");
  const studentView = `/cabinet/courses/${course.slug}`;

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-primary)]">Курс</p>
          <h1 className="mt-1 text-2xl font-extrabold text-[var(--color-ink)]">{course.title}</h1>
        </div>
        <Link href={studentView} target="_blank" className="text-sm font-semibold text-[var(--color-primary)] hover:underline">
          Посмотреть как ученик ↗
        </Link>
      </div>

      <section className={`${card} p-5`}>
        <form action={updateCourseBasicsAction.bind(null, course.id)} className="space-y-3">
          <div>
            <label className={label}>Название курса (видно в кабинете)</label>
            <input name="title" defaultValue={course.title} required className={input} />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <label className="flex items-center gap-2 text-sm text-[var(--color-ink)]">
              <input type="checkbox" name="published" defaultChecked={course.published} />
              Курс открыт для записи
            </label>
            <SaveButton />
          </div>
        </form>
        <p className="mt-3 text-xs text-[var(--color-ink-muted)]">
          Тексты главной страницы (заголовок, описание уроков на лендинге, вопросы) меняются в коде сайта —
          напиши Роману.
        </p>
      </section>

      {routeDoc && (
        <section className={`${card} p-5`}>
          <h2 className="font-bold text-[var(--color-ink)]">Маршрут и список чтения</h2>
          <p className="mt-1 text-sm text-[var(--color-ink-soft)]">Общий текст курса: что прочитать и что подготовить.</p>
          <div className="mt-3">
            <DocEditor doc={routeDoc} viewHref={`${studentView}/docs/${routeDoc.id}`} />
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-3 text-lg font-bold text-[var(--color-ink)]">Уроки</h2>
        <div className="space-y-3">
          {lessons.map((lesson, i) => {
            const docs = course.docs.filter((d) => d.lessonId === lesson.id);
            return (
              <details key={lesson.id} className={`${card} group`}>
                <summary className="flex cursor-pointer list-none flex-wrap items-center gap-3 p-4 sm:p-5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-[var(--color-ink)] bg-[var(--color-accent)] font-bold text-[var(--color-ink)]">
                    {i + 1}
                  </span>
                  <span className="min-w-0 flex-1 font-semibold text-[var(--color-ink)]">{lesson.title}</span>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      lesson.videoPath ? "bg-green-100 text-green-700" : "bg-[var(--color-accent-soft)] text-[var(--color-accent-dark)]"
                    }`}
                  >
                    {lesson.videoPath ? "видео ✓" : "нет видео"}
                  </span>
                  <span className="text-xs text-[var(--color-ink-muted)] transition-transform group-open:rotate-180">▼</span>
                </summary>

                <div className="space-y-5 border-t-2 border-[var(--color-ink)] p-4 sm:p-5">
                  <form action={updateLessonAction.bind(null, lesson.id, course.id)} className="space-y-3">
                    <div>
                      <label className={label}>Название</label>
                      <input name="title" defaultValue={lesson.title} required className={input} />
                    </div>
                    <div>
                      <label className={label}>Описание (под заголовком урока)</label>
                      <textarea name="description" defaultValue={lesson.description ?? ""} rows={3} className={input} />
                    </div>
                    <div>
                      <label className={label}>Перед уроком</label>
                      <textarea name="prep" defaultValue={lesson.prep ?? ""} rows={2} className={input} />
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <Link
                        href={`${studentView}/lessons/${lesson.id}`}
                        target="_blank"
                        className="text-sm font-semibold text-[var(--color-primary)] hover:underline"
                      >
                        Посмотреть урок ↗
                      </Link>
                      <SaveButton label="Сохранить урок" />
                    </div>
                  </form>

                  <div className="rounded-xl border-2 border-dashed border-[var(--color-border-strong)] p-4">
                    <p className={label}>Видео</p>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <VideoUploader lessonId={lesson.id} hasVideo={Boolean(lesson.videoPath)} />
                      {lesson.videoPath && (
                        <form action={deleteLessonVideoAction.bind(null, lesson.id, course.id)}>
                          <ConfirmSubmit label="Удалить видео" confirmText="Удалить видео этого урока?" className={dangerButton} />
                        </form>
                      )}
                    </div>
                  </div>

                  {docs.length > 0 && (
                    <div className="space-y-2">
                      <p className={label}>Тексты урока</p>
                      {docs.map((doc) => (
                        <DocEditor key={doc.id} doc={doc} viewHref={`${studentView}/docs/${doc.id}`} />
                      ))}
                    </div>
                  )}

                  <details className="rounded-xl border border-[var(--color-border)] p-3">
                    <summary className="cursor-pointer text-sm font-semibold text-[var(--color-ink-soft)]">
                      Дополнительные файлы ({lesson.materials.length})
                    </summary>
                    <div className="mt-3">
                      {lesson.materials.length > 0 && (
                        <ul className="mb-3 space-y-1.5">
                          {lesson.materials.map((m) => (
                            <li key={m.id} className="flex flex-wrap items-center gap-2 text-sm">
                              <span className="text-[var(--color-ink)]">{m.fileName}</span>
                              <form action={toggleMaterialDownloadAction.bind(null, m.id, course.id, !m.downloadAllowed)}>
                                <button type="submit" className={smallButton}>
                                  {m.downloadAllowed ? "Запретить скачивание" : "Разрешить скачивание"}
                                </button>
                              </form>
                              <form action={deleteMaterialAction.bind(null, m.id, course.id)}>
                                <ConfirmSubmit label="Удалить" confirmText="Удалить файл?" className={dangerButton} />
                              </form>
                            </li>
                          ))}
                        </ul>
                      )}
                      <form
                        action={uploadMaterialAction.bind(null, lesson.id, course.id)}
                        className="flex flex-wrap items-center gap-2"
                      >
                        <input type="file" name="file" required className="text-sm" />
                        <label className="flex items-center gap-1.5 text-xs text-[var(--color-ink-soft)]">
                          <input type="checkbox" name="downloadAllowed" />
                          Разрешить скачивание
                        </label>
                        <button type="submit" className={smallButton}>Загрузить файл (до 10 МБ)</button>
                      </form>
                    </div>
                  </details>

                  <div className="flex flex-wrap gap-1.5 border-t border-[var(--color-border)] pt-4">
                    <form action={moveLessonAction.bind(null, lesson.id, course.id, "up")}>
                      <button type="submit" className={smallButton} disabled={i === 0}>↑ Выше</button>
                    </form>
                    <form action={moveLessonAction.bind(null, lesson.id, course.id, "down")}>
                      <button type="submit" className={smallButton} disabled={i === lessons.length - 1}>↓ Ниже</button>
                    </form>
                    <form action={deleteLessonAction.bind(null, lesson.id, course.id)} className="ml-auto">
                      <ConfirmSubmit
                        label="Удалить урок"
                        confirmText="Удалить урок вместе с видео, текстами и прогрессом учеников по нему?"
                        className={dangerButton}
                      />
                    </form>
                  </div>
                </div>
              </details>
            );
          })}
        </div>

        {firstModule && (
          <form action={createLessonAction.bind(null, firstModule.id, course.id)} className="mt-4 flex flex-wrap items-center gap-2">
            <input name="title" placeholder="Название нового урока" required className={`${input} flex-1`} />
            <button type="submit" className={smallButton}>+ Добавить урок</button>
          </form>
        )}
      </section>
    </div>
  );
}

/** Редактор одного текста курса: раскрывается, внутри название и сам текст. */
function DocEditor({ doc, viewHref }: { doc: CourseDoc; viewHref: string }) {
  return (
    <details className="rounded-xl border-2 border-[var(--color-ink)] bg-[var(--color-surface-alt)]">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-semibold text-[var(--color-ink)]">
        {doc.title}
        <span className="text-xs font-normal text-[var(--color-ink-muted)]">изменить ▾</span>
      </summary>
      <form action={updateCourseDocAction.bind(null, doc.id)} className="space-y-3 border-t-2 border-[var(--color-ink)] bg-white p-4">
        <div>
          <label className={label}>Название</label>
          <input name="title" defaultValue={doc.title} required className={input} />
        </div>
        <div>
          <label className={label}>Текст</label>
          <textarea name="body" defaultValue={doc.body} rows={16} required className={`${input} font-mono text-[0.8125rem] leading-relaxed`} />
          <p className="mt-1.5 text-xs leading-relaxed text-[var(--color-ink-muted)]">
            Как оформлять: строка с «# » в начале — заголовок; «1.1. …» — задание; «А. …» под заданием — вариант ответа;
            «Мой ответ: ______» — поле для записи в тетради; остальные строки — обычные абзацы. Ссылки становятся кликабельными.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href={viewHref} target="_blank" className="text-sm font-semibold text-[var(--color-primary)] hover:underline">
            Посмотреть как ученик ↗
          </Link>
          <SaveButton />
        </div>
      </form>
    </details>
  );
}
