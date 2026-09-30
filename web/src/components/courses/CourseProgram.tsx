"use client";

import { useState } from "react";
import clsx from "clsx";
import Icon from "@/components/ui/Icon";
import { plural } from "@/lib/format";

/**
 * Программа курса: модули раскрываются, внутри — уроки.
 *
 * Раньше программа была плоским списком: по нему нельзя было понять ни объём
 * курса, ни его устройство. Теперь видно количество уроков в каждом модуле,
 * а длинная программа не занимает весь экран.
 *
 * Первый модуль раскрыт — чтобы сразу было понятно, что внутри.
 */

export type ProgramModule = {
  id: string;
  title: string;
  lessons: Array<{ id: string; title: string; description: string | null }>;
};

export default function CourseProgram({ modules }: { modules: ProgramModule[] }) {
  const [openId, setOpenId] = useState<string | null>(modules[0]?.id ?? null);

  if (modules.length === 0) return null;

  return (
    <div className="space-y-3">
      {modules.map((module, index) => {
        const isOpen = openId === module.id;
        const count = module.lessons.length;

        return (
          <div
            key={module.id}
            className={clsx(
              "overflow-hidden rounded-card border bg-[var(--color-surface)] transition-[border-color,box-shadow] duration-300",
              isOpen
                ? "border-[var(--color-primary)]/35 shadow-card"
                : "border-[var(--color-border)] hover:border-[var(--color-border-strong)]"
            )}
          >
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : module.id)}
              aria-expanded={isOpen}
              className="flex w-full items-center gap-4 px-5 py-4 text-left sm:px-6 sm:py-5"
            >
              <span
                className={clsx(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-caption font-extrabold transition-colors duration-300",
                  isOpen
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                )}
              >
                {index + 1}
              </span>

              <span className="flex-1">
                <span className="block text-h4 text-[var(--color-ink)]">{module.title}</span>
                <span className="mt-0.5 block text-caption text-[var(--color-ink-muted)]">
                  {count} {plural(count, ["урок", "урока", "уроков"])}
                </span>
              </span>

              <Icon
                name="chevronDown"
                className={clsx(
                  "h-5 w-5 shrink-0 text-[var(--color-ink-muted)] transition-transform duration-300 ease-[var(--ease-out-expo)]",
                  isOpen && "rotate-180"
                )}
              />
            </button>

            <div
              className={clsx(
                "grid transition-all duration-400 ease-[var(--ease-out-expo)]",
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              )}
            >
              <div className="overflow-hidden">
                <ol className="space-y-3 px-5 pb-5 sm:px-6 sm:pb-6">
                  {module.lessons.map((lesson, i) => (
                    <li key={lesson.id} className="flex gap-3.5 border-t border-[var(--color-border)] pt-3.5">
                      <span className="mt-0.5 text-caption font-semibold text-[var(--color-ink-muted)]">
                        {index + 1}.{i + 1}
                      </span>
                      <span>
                        <span className="block font-semibold text-[var(--color-ink)]">
                          {lesson.title}
                        </span>
                        {lesson.description && (
                          <span className="mt-1 block text-caption text-[var(--color-ink-soft)]">
                            {lesson.description}
                          </span>
                        )}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
