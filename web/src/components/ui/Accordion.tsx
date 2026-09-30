"use client";

import { useState } from "react";
import clsx from "clsx";
import Icon from "@/components/ui/Icon";

/**
 * Раскрывающийся список вопросов.
 *
 * Раньше этот блок был скопирован дважды — на главной и на странице занятий.
 * Теперь он один: правки в анимации или вёрстке применяются сразу везде.
 */

export type AccordionItem = {
  q: string;
  a: string;
};

export default function Accordion({
  items,
  /** Какой пункт раскрыт при загрузке. null — все закрыты. */
  defaultOpen = 0,
  className,
}: {
  items: AccordionItem[];
  defaultOpen?: number | null;
  className?: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpen);

  return (
    <div className={clsx("space-y-3", className)}>
      {items.map((item, i) => {
        const isOpen = openIndex === i;

        return (
          <div
            key={item.q}
            className={clsx(
              "overflow-hidden rounded-card border-2 border-[var(--color-ink)] bg-[var(--color-surface)]",
              "transition-shadow duration-200",
              isOpen ? "shadow-hard" : "hover:shadow-hard-sm"
            )}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-h4 text-[var(--color-ink)] sm:px-6 sm:py-5"
            >
              {item.q}
              <span
                className={clsx(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-[var(--color-ink)] transition-all duration-300 ease-[var(--ease-out-expo)]",
                  isOpen
                    ? "rotate-45 bg-[var(--color-accent)] text-[var(--color-ink)]"
                    : "bg-white text-[var(--color-ink)]"
                )}
              >
                <Icon name="plus" className="h-4 w-4" strokeWidth={2.2} />
              </span>
            </button>

            {/* grid-rows 0fr → 1fr: плавное раскрытие без знания высоты контента */}
            <div
              className={clsx(
                "grid transition-all duration-400 ease-[var(--ease-out-expo)]",
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              )}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-5 text-[var(--color-ink-soft)] sm:px-6 sm:pb-6">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
