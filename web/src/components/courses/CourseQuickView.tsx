"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import MediaSlot from "@/components/ui/MediaSlot";
import Badge from "@/components/ui/Badge";
import Icon from "@/components/ui/Icon";
import { courseCoverSpec } from "@/content/media";
import { formatRub, plural } from "@/lib/format";
import { DURATION, EASE } from "@/lib/motion";

/**
 * Фрейм с подробностями курса.
 *
 * Открывается по клику на карточку в каталоге: человек видит состав курса
 * и программу, не уходя со страницы и не теряя список. Полная страница курса
 * остаётся — на неё ведёт кнопка из фрейма.
 */

export type CourseQuickInfo = {
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  isFree: boolean;
  priceRub: number;
  duration: string | null;
  coverImage: string | null;
  whatsIncluded: string | null;
  forWhom: string | null;
  moduleCount: number;
  lessonCount: number;
  modules: Array<{ id: string; title: string; lessonCount: number }>;
};

export default function CourseQuickView({
  course,
  onClose,
}: {
  course: CourseQuickInfo | null;
  onClose: () => void;
}) {
  /* Закрытие по Escape и блокировка прокрутки страницы под фреймом. */
  useEffect(() => {
    if (!course) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [course, onClose]);

  const included =
    course?.whatsIncluded?.split(";").map((s) => s.trim()).filter(Boolean) ?? [];

  return (
    <AnimatePresence>
      {course && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: DURATION.fast, ease: EASE.out }}
        >
          <div
            className="absolute inset-0 bg-[var(--color-primary-deep)]/70 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="quickview-title"
            className="relative flex max-h-[92svh] w-full max-w-6xl flex-col overflow-hidden rounded-t-hero bg-[var(--color-surface)] shadow-hero sm:rounded-hero"
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: DURATION.base, ease: EASE.out }}
          >
            <QuickViewBody course={course} included={included} onClose={onClose} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function QuickViewBody({
  course,
  included,
  onClose,
}: {
  course: CourseQuickInfo;
  included: string[];
  onClose: () => void;
}) {
  return (
    <>
      {/* Шапка фрейма: та же обложка, что на карточке — переход читается как
          продолжение, а не как открытие чего-то постороннего. */}
      <div className="relative shrink-0">
        <MediaSlot
          spec={courseCoverSpec(course)}
          overlay="bottom"
          sizes="(max-width: 1152px) 100vw, 72rem"
          className="aspect-[16/7] w-full sm:aspect-[24/7] lg:aspect-[32/7]"
        />

        <button
          type="button"
          onClick={onClose}
          aria-label="Закрыть"
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-all duration-200 hover:bg-black/60 hover:scale-105"
        >
          <Icon name="plus" className="h-5 w-5 rotate-45" strokeWidth={2.2} />
        </button>

        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 lg:p-10">
          <Badge tone="light">{course.isFree ? "Бесплатный курс" : "Платный курс"}</Badge>
          <h2 id="quickview-title" className="mt-3 text-balance text-h2 text-white">
            {course.title}
          </h2>
        </div>
      </div>

      {/* Прокручивается только содержимое: шапка и нижняя панель остаются на месте. */}
      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-8 sm:px-8 sm:py-9 lg:px-10 lg:py-10">
        <p className="max-w-3xl text-lead text-[var(--color-ink-soft)]">{course.description}</p>

        <dl className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:max-w-2xl">
          <QuickStat label="Модулей" value={String(course.moduleCount)} />
          <QuickStat label="Уроков" value={String(course.lessonCount)} />
          {course.duration && <QuickStat label="Доступ" value={course.duration} />}
        </dl>

        {/*
          На широком экране состав курса и программа идут в две колонки.
          Одной ширины мало: если оставить всё в один столбец, текст растянется
          в слишком длинные строки, а списки встанут плотной стеной.
        */}
        <div className="mt-10 grid gap-x-14 gap-y-10 lg:grid-cols-2">
          <div className="space-y-8">
            {course.forWhom && (
              <div className="flex gap-4 rounded-card bg-[var(--color-accent-soft)] p-5 sm:p-6">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-accent)] text-white">
                  <Icon name="target" className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-h4 text-[var(--color-ink)]">Для кого</p>
                  <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-[var(--color-ink-soft)]">
                    {course.forWhom}
                  </p>
                </div>
              </div>
            )}

            {included.length > 0 && (
              <div>
                <h3 className="text-h4 text-[var(--color-ink)]">Что входит</h3>
                <ul className="mt-5 space-y-3.5">
                  {included.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-[0.9375rem] leading-relaxed text-[var(--color-ink-soft)]"
                    >
                      <Icon
                        name="check"
                        className="mt-1 h-4 w-4 shrink-0 text-[var(--color-primary)]"
                        strokeWidth={2.4}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {course.modules.length > 0 && (
            <div>
              <h3 className="text-h4 text-[var(--color-ink)]">Программа</h3>
              <ol className="mt-5 space-y-3">
                {course.modules.map((module, i) => (
                  <li
                    key={module.id}
                    className="flex items-center gap-4 rounded-card border border-[var(--color-border)] px-5 py-4"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-caption font-extrabold text-[var(--color-primary)]">
                      {i + 1}
                    </span>
                    <span className="flex-1 font-semibold leading-snug text-[var(--color-ink)]">
                      {module.title}
                    </span>
                    <span className="shrink-0 text-caption text-[var(--color-ink-muted)]">
                      {module.lessonCount} {plural(module.lessonCount, ["урок", "урока", "уроков"])}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </div>

      <div className="flex shrink-0 flex-wrap items-center justify-between gap-4 border-t border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-5 sm:px-8 lg:px-10">
        <p className="text-h3 text-[var(--color-ink)]">
          {course.isFree ? "Бесплатно" : formatRub(course.priceRub)}
        </p>
        <Link
          href={`/courses/${course.slug}`}
          className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-6 py-3 font-semibold text-white shadow-primary transition-all duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-0.5 hover:bg-[var(--color-primary-dark)]"
        >
          {course.isFree ? "Начать бесплатно" : "Открыть курс"}
          <Icon name="arrowRight" className="h-4 w-4" />
        </Link>
      </div>
    </>
  );
}

function QuickStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-card bg-[var(--color-surface-alt)] px-4 py-3">
      <dt className="text-eyebrow uppercase text-[var(--color-ink-muted)]">{label}</dt>
      <dd className="mt-1 font-bold text-[var(--color-ink)]">{value}</dd>
    </div>
  );
}
