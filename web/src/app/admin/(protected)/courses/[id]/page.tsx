import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CourseForm from "@/components/admin/CourseForm";
import ConfirmSubmit from "@/components/admin/ConfirmSubmit";
import {
  updateCourseAction,
  deleteCourseAction,
  uploadCourseCoverAction,
  createModuleAction,
  updateModuleAction,
  deleteModuleAction,
  moveModuleAction,
  createLessonAction,
  updateLessonAction,
  deleteLessonAction,
  moveLessonAction,
  uploadLessonVideoAction,
  deleteLessonVideoAction,
  uploadMaterialAction,
  toggleMaterialDownloadAction,
  deleteMaterialAction,
} from "@/lib/actions/admin/courses";

const smallInput =
  "rounded-lg border-2 border-[var(--color-ink)] bg-white px-3 py-1.5 text-sm outline-none transition-shadow focus:shadow-[3px_3px_0_var(--color-accent)]";
const smallButton =
  "rounded-lg border border-[var(--color-border)] px-2.5 py-1.5 text-xs font-medium text-[var(--color-ink-soft)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]";
const dangerButton =
  "rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50";

export default async function AdminCourseEditPage(
  props: PageProps<"/admin/courses/[id]">
) {
  const { id } = await props.params;
  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: {
          lessons: {
            orderBy: { order: "asc" },
            include: { materials: true },
          },
        },
      },
    },
  });
  if (!course) notFound();

  return (
    <div className="max-w-4xl space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link href="/admin/courses" className="text-sm text-[var(--color-ink-soft)] hover:text-[var(--color-primary)]">
            ← Все курсы
          </Link>
          <h1 className="mt-1 text-2xl font-extrabold text-[var(--color-ink)]">{course.title}</h1>
          <Link
            href={`/courses/${course.slug}`}
            target="_blank"
            className="text-xs text-[var(--color-primary)] hover:underline"
          >
            Открыть страницу курса →
          </Link>
        </div>
        <form action={deleteCourseAction.bind(null, course.id)}>
          <ConfirmSubmit
            label="Удалить курс"
            confirmText="Удалить курс без возможности восстановления?"
            className={dangerButton}
          />
        </form>
      </div>

      <section className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[var(--color-primary)]">
          Обложка курса
        </h2>
        <div className="flex flex-wrap items-center gap-5">
          <div
            className="flex h-28 w-20 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] bg-cover bg-center text-xs text-white/80"
            style={course.coverImage ? { backgroundImage: `url(${course.coverImage})` } : undefined}
          >
            {!course.coverImage && "нет фото"}
          </div>
          <form
            action={uploadCourseCoverAction.bind(null, course.id)}
            encType="multipart/form-data"
            className="flex items-center gap-3"
          >
            <input type="file" name="cover" accept="image/*" required className="text-sm" />
            <button type="submit" className={smallButton}>
              Загрузить
            </button>
          </form>
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[var(--color-primary)]">
          Основные данные
        </h2>
        <CourseForm course={course} action={updateCourseAction.bind(null, course.id)} />
      </section>

      <section>
        <h2 className="mb-4 text-lg font-bold text-[var(--color-ink)]">Программа курса</h2>

        <div className="space-y-5">
          {course.modules.map((module, mIdx) => (
            <div key={module.id} className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <form action={updateModuleAction.bind(null, module.id)} className="flex flex-1 items-center gap-2">
                  <span className="text-sm font-semibold text-[var(--color-ink-soft)]">{mIdx + 1}.</span>
                  <input name="title" defaultValue={module.title} className={`${smallInput} flex-1`} />
                  <button type="submit" className={smallButton}>Сохранить</button>
                </form>
                <div className="flex gap-1.5">
                  <form action={moveModuleAction.bind(null, module.id, "up")}>
                    <button type="submit" className={smallButton} disabled={mIdx === 0}>↑</button>
                  </form>
                  <form action={moveModuleAction.bind(null, module.id, "down")}>
                    <button type="submit" className={smallButton} disabled={mIdx === course.modules.length - 1}>↓</button>
                  </form>
                  <form action={deleteModuleAction.bind(null, module.id)}>
                    <ConfirmSubmit label="Удалить модуль" confirmText="Удалить модуль вместе со всеми уроками?" className={dangerButton} />
                  </form>
                </div>
              </div>

              <div className="mt-4 space-y-4 border-l-2 border-[var(--color-border)] pl-4">
                {module.lessons.map((lesson, lIdx) => (
                  <div key={lesson.id} className="rounded-xl bg-[var(--color-bg)] p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <form
                        action={updateLessonAction.bind(null, lesson.id, course.id)}
                        className="flex-1 space-y-2"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-[var(--color-ink-soft)]">
                            Урок {lIdx + 1}
                          </span>
                        </div>
                        <input name="title" defaultValue={lesson.title} className={`${smallInput} w-full`} />
                        <textarea
                          name="description"
                          defaultValue={lesson.description ?? ""}
                          placeholder="Описание урока (необязательно)"
                          rows={2}
                          className={`${smallInput} w-full`}
                        />
                        <button type="submit" className={smallButton}>Сохранить урок</button>
                      </form>
                      <div className="flex shrink-0 gap-1.5">
                        <form action={moveLessonAction.bind(null, lesson.id, course.id, "up")}>
                          <button type="submit" className={smallButton} disabled={lIdx === 0}>↑</button>
                        </form>
                        <form action={moveLessonAction.bind(null, lesson.id, course.id, "down")}>
                          <button type="submit" className={smallButton} disabled={lIdx === module.lessons.length - 1}>↓</button>
                        </form>
                        <form action={deleteLessonAction.bind(null, lesson.id, course.id)}>
                          <ConfirmSubmit label="Удалить" confirmText="Удалить урок вместе с видео и материалами?" className={dangerButton} />
                        </form>
                      </div>
                    </div>

                    <div className="mt-3 rounded-lg border border-dashed border-[var(--color-border)] p-3">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-soft)]">
                        Видео
                      </p>
                      {lesson.videoPath ? (
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm text-[var(--color-ink)]">Видео загружено ✓</span>
                          <form action={deleteLessonVideoAction.bind(null, lesson.id, course.id)}>
                            <ConfirmSubmit label="Удалить видео" confirmText="Удалить видео этого урока?" className={dangerButton} />
                          </form>
                        </div>
                      ) : (
                        <p className="mb-2 text-sm text-[var(--color-ink-soft)]">Видео ещё не загружено</p>
                      )}
                      <form
                        action={uploadLessonVideoAction.bind(null, lesson.id, course.id)}
                        encType="multipart/form-data"
                        className="mt-2 flex flex-wrap items-center gap-2"
                      >
                        <input type="file" name="video" accept="video/*" required className="text-sm" />
                        <button type="submit" className={smallButton}>
                          {lesson.videoPath ? "Заменить видео" : "Загрузить видео"}
                        </button>
                      </form>
                    </div>

                    <div className="mt-3 rounded-lg border border-dashed border-[var(--color-border)] p-3">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-soft)]">
                        Материалы
                      </p>
                      {lesson.materials.length > 0 && (
                        <ul className="mb-2 space-y-1.5">
                          {lesson.materials.map((material) => (
                            <li key={material.id} className="flex flex-wrap items-center gap-2 text-sm">
                              <span className="text-[var(--color-ink)]">{material.fileName}</span>
                              <span className="text-xs text-[var(--color-ink-soft)]">
                                {material.downloadAllowed ? "скачивание разрешено" : "только просмотр"}
                              </span>
                              <form
                                action={toggleMaterialDownloadAction.bind(
                                  null,
                                  material.id,
                                  course.id,
                                  !material.downloadAllowed
                                )}
                              >
                                <button type="submit" className={smallButton}>
                                  {material.downloadAllowed ? "Запретить скачивание" : "Разрешить скачивание"}
                                </button>
                              </form>
                              <form action={deleteMaterialAction.bind(null, material.id, course.id)}>
                                <ConfirmSubmit label="Удалить" confirmText="Удалить файл?" className={dangerButton} />
                              </form>
                            </li>
                          ))}
                        </ul>
                      )}
                      <form
                        action={uploadMaterialAction.bind(null, lesson.id, course.id)}
                        encType="multipart/form-data"
                        className="flex flex-wrap items-center gap-2"
                      >
                        <input type="file" name="file" required className="text-sm" />
                        <label className="flex items-center gap-1.5 text-xs text-[var(--color-ink-soft)]">
                          <input type="checkbox" name="downloadAllowed" />
                          Разрешить скачивание
                        </label>
                        <button type="submit" className={smallButton}>Загрузить файл</button>
                      </form>
                    </div>
                  </div>
                ))}

                <form
                  action={createLessonAction.bind(null, module.id, course.id)}
                  className="flex flex-wrap items-center gap-2 pt-1"
                >
                  <input name="title" placeholder="Название нового урока" required className={`${smallInput} flex-1`} />
                  <button type="submit" className={smallButton}>+ Добавить урок</button>
                </form>
              </div>
            </div>
          ))}
        </div>

        <form action={createModuleAction.bind(null, course.id)} className="mt-5 flex flex-wrap items-center gap-2">
          <input name="title" placeholder="Название нового модуля" required className={`${smallInput} flex-1`} />
          <button
            type="submit"
            className="rounded-full border-2 border-[var(--color-ink)] bg-[var(--color-primary)] px-4 py-1.5 text-sm font-bold text-white shadow-hard transition-[translate,box-shadow] duration-150 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-hard-sm active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
          >
            + Добавить модуль
          </button>
        </form>
      </section>
    </div>
  );
}
