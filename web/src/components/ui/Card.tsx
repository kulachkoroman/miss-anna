import clsx from "clsx";

/**
 * Базовая карточка. Единая геометрия и тень для всего сайта.
 * Новый стиль: тёмная обводка и жёсткая тень; при наведении карточка
 * «приподнимается» — сдвигается от тени, тень растёт.
 * Варианты нужны, чтобы соседние блоки не выглядели одинаково.
 */

type Variant = "solid" | "outline" | "soft" | "dark" | "glass";

const variants: Record<Variant, string> = {
  solid: "bg-[var(--color-surface)] border-2 border-[var(--color-ink)] shadow-hard",
  outline: "bg-transparent border-2 border-[var(--color-ink)]",
  soft: "bg-[var(--color-surface-alt)] border-2 border-transparent",
  dark: "bg-brand-gradient text-white border-2 border-[var(--color-ink)] shadow-hard",
  glass: "bg-white/10 backdrop-blur-xl border-2 border-white/20 text-white",
};

export default function Card({
  children,
  variant = "solid",
  /** Подъём и усиление тени при наведении. */
  interactive = false,
  className,
}: {
  children: React.ReactNode;
  variant?: Variant;
  interactive?: boolean;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "relative overflow-hidden rounded-card p-6 sm:p-8",
        variants[variant],
        interactive &&
          "transition-[translate,box-shadow] duration-150 ease-out hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-hard-lg",
        className
      )}
    >
      {children}
    </div>
  );
}
