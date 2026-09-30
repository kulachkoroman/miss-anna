/**
 * Расчёт прогресса по курсу.
 *
 * Логика вынесена сюда, потому что одни и те же числа нужны на трёх экранах
 * кабинета: на главной, на странице курса и на странице урока. Считать их
 * в каждом месте заново — верный способ получить расхождение.
 */

type LessonLike = { id: string };
type ModuleLike = { lessons: LessonLike[] };

export type Progress = {
  total: number;
  done: number;
  /** Процент, округлённый до целого. */
  percent: number;
};

export function calcProgress(modules: ModuleLike[], completedIds: Set<string>): Progress {
  const lessons = modules.flatMap((courseModule) => courseModule.lessons);
  const total = lessons.length;
  const done = lessons.filter((lesson) => completedIds.has(lesson.id)).length;

  return {
    total,
    done,
    percent: total > 0 ? Math.round((done / total) * 100) : 0,
  };
}

/**
 * Первый непройденный урок — то, что открывается по кнопке «Продолжить».
 * Если пройдено всё, возвращает null: продолжать нечего.
 */
export function findNextLesson<T extends LessonLike>(
  modules: Array<{ lessons: T[] }>,
  completedIds: Set<string>
): T | null {
  /* Имя module зарезервировано сборщиком, поэтому courseModule. */
  for (const courseModule of modules) {
    for (const lesson of courseModule.lessons) {
      if (!completedIds.has(lesson.id)) return lesson;
    }
  }
  return null;
}
