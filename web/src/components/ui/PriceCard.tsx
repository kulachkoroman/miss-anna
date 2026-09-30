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
        "relative flex h-full flex-col overflow-hidden rounded-panel border-2 border-[var(--color-ink)] p-7 shadow-hard sm:p-8",
        "transition-[translate,box-shadow] duration-150 ease-out hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-hard-lg",
        highlight ? "bg-brand-gradient text-white" : "bg-[var(--color-surface)]",
        className
      )}
    >
      {badge && (
        <div className="relative mb-5">
          <Badge tone="accent">{badge}</Badge>
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
          "relative mt-6 whitespace-nowrap font-display text-[clamp(1.875rem,1.5rem+1.2vw,2.5rem)] font-extrabold leading-none tracking-[-0.04em]",
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
