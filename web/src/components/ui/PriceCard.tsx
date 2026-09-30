import clsx from "clsx";
import Icon from "@/components/ui/Icon";
import Badge from "@/components/ui/Badge";
import { formatRub } from "@/lib/format";

/**
 * Карточка тарифа.
 *
 * Выделенный вариант (highlight) визуально тяжелее остальных —
 * это подсказывает, какой формат основной, не написав ни слова.
 */
export default function PriceCard({
  title,
  priceRub,
  duration,
  note,
  features = [],
  highlight = false,
  badge,
  className,
  children,
}: {
  title: string;
  priceRub: number;
  duration: string;
  note?: string;
  features?: string[];
  highlight?: boolean;
  badge?: string;
  className?: string;
  /** Кнопка или ссылка под тарифом. */
  children?: React.ReactNode;
}) {
  return (
    <div
      className={clsx(
        "relative flex h-full flex-col overflow-hidden rounded-panel p-7 sm:p-8",
        "transition-[transform,box-shadow] duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-1",
        highlight
          ? "bg-brand-gradient texture-grain text-white shadow-hero"
          : "border border-[var(--color-border)] bg-[var(--color-surface)] shadow-subtle hover:shadow-lift",
        className
      )}
    >
      {badge && (
        <div className="relative mb-5">
          <Badge tone={highlight ? "light" : "accent"}>{badge}</Badge>
        </div>
      )}
      <div className="relative">
        <div>
          <h3 className={clsx("text-h4", highlight ? "text-white" : "text-[var(--color-ink)]")}>
            {title}
          </h3>
          <p
            className={clsx(
              "mt-1 text-caption",
              highlight ? "text-white/70" : "text-[var(--color-ink-muted)]"
            )}
          >
            {duration}
          </p>
        </div>
      </div>

      <p
        className={clsx(
          "relative mt-6 whitespace-nowrap text-[clamp(2.25rem,1.8rem+1.4vw,3rem)] font-extrabold leading-none tracking-[-0.04em]",
          highlight ? "text-white" : "text-[var(--color-ink)]"
        )}
      >
        {formatRub(priceRub)}
      </p>

      {note && (
        <p
          className={clsx(
            "relative mt-3 text-[0.9375rem] leading-relaxed",
            highlight ? "text-white/80" : "text-[var(--color-ink-soft)]"
          )}
        >
          {note}
        </p>
      )}

      {features.length > 0 && (
        <ul className="relative mt-6 space-y-2.5">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-2.5">
              <Icon
                name="check"
                className={clsx(
                  "mt-0.5 h-4 w-4",
                  highlight ? "text-[var(--color-accent)]" : "text-[var(--color-primary)]"
                )}
                strokeWidth={2.4}
              />
              <span
                className={clsx(
                  "text-[0.9375rem]",
                  highlight ? "text-white/85" : "text-[var(--color-ink-soft)]"
                )}
              >
                {feature}
              </span>
            </li>
          ))}
        </ul>
      )}

      {children && <div className="relative mt-auto pt-7">{children}</div>}
    </div>
  );
}
