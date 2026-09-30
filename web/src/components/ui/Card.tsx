import clsx from "clsx";

/**
 * Базовая карточка. Единая геометрия и тень для всего сайта.
 * Варианты нужны, чтобы соседние блоки не выглядели одинаково.
 */

type Variant = "solid" | "outline" | "soft" | "dark" | "glass";

const variants: Record<Variant, string> = {
  solid: "bg-[var(--color-surface)] border border-[var(--color-border)] shadow-subtle",
  outline: "bg-transparent border border-[var(--color-border-strong)]",
  soft: "bg-[var(--color-surface-alt)] border border-transparent",
  dark: "bg-brand-gradient text-white border border-white/10 shadow-hero texture-grain",
  glass: "bg-white/10 backdrop-blur-xl border border-white/20 text-white",
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
          "transition-[transform,box-shadow] duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:shadow-lift",
        className
      )}
    >
      {children}
    </div>
  );
}
