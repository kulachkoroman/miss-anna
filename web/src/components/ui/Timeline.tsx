"use client";

import { motion } from "framer-motion";
import clsx from "clsx";
import Icon, { type IconName } from "@/components/ui/Icon";
import { DURATION, EASE, staggerContainer, staggerItem } from "@/lib/motion";

/**
 * Последовательность с соединительной линией.
 *
 * Линия прорисовывается при прокрутке и связывает пункты — видно, что это
 * процесс или путь, а не четыре независимые плитки.
 *
 * Два вида:
 *   "steps"    — шаги в ряд (как «как это работает»), с номерами;
 *   "vertical" — всегда столбиком, без номеров (как биография).
 */

export type TimelineStep = {
  /** Год или период — показывается над заголовком шага. */
  year?: string;
  title: string;
  description: string;
  icon: IconName;
};

export default function Timeline({
  steps,
  variant = "steps",
  className,
}: {
  steps: TimelineStep[];
  variant?: "steps" | "vertical";
  className?: string;
}) {
  const vertical = variant === "vertical";

  return (
    <motion.ol
      variants={staggerContainer(0.14)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className={clsx(
        "relative",
        vertical ? "grid gap-10" : "grid gap-8 sm:gap-6 md:grid-cols-4",
        className
      )}
    >
      {/* Соединительная линия. В вертикальном виде — всегда слева,
          в шагах — слева на телефоне и горизонтально на широком экране. */}
      <motion.span
        aria-hidden
        className={clsx(
          "absolute left-[27px] top-4 w-[2px] origin-top bg-[var(--color-ink)]/15",
          vertical
            ? "block"
            : "hidden sm:block md:left-0 md:right-0 md:top-[27px] md:h-[2px] md:w-auto md:origin-left"
        )}
        style={{ bottom: "1rem" }}
        initial={{ scaleY: 0, scaleX: 0 }}
        whileInView={{ scaleY: 1, scaleX: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: DURATION.slow, ease: EASE.out, delay: 0.1 }}
      />

      {steps.map((step, i) => (
        <motion.li
          key={step.title}
          variants={staggerItem}
          className={clsx("relative flex gap-5", !vertical && "md:block md:gap-4")}
        >
          <span
            className={clsx(
              "relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full",
              "border-2 border-[var(--color-ink)] bg-[var(--color-surface)] text-[var(--color-primary)] shadow-hard-sm"
            )}
          >
            <Icon name={step.icon} className="h-6 w-6" />

            {/* Номер нужен там, где важен порядок действий.
                В биографии он только мешает. */}
            {!vertical && (
              <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full border-2 border-[var(--color-ink)] bg-[var(--color-accent)] font-display text-[11px] font-bold text-[var(--color-ink)]">
                {i + 1}
              </span>
            )}
          </span>

          <div className={clsx(vertical ? "pt-2" : "md:mt-5 md:pr-6")}>
            {step.year && <p className="eyebrow mb-2">{step.year}</p>}
            <h3 className={clsx(vertical ? "text-h3" : "text-h4", "text-[var(--color-ink)]")}>
              {step.title}
            </h3>
            <p
              className={clsx(
                "mt-2 text-[var(--color-ink-soft)]",
                vertical ? "max-w-xl leading-relaxed" : "text-caption sm:text-[0.9375rem]"
              )}
            >
              {step.description}
            </p>
          </div>
        </motion.li>
      ))}
    </motion.ol>
  );
}
