import clsx from "clsx";
import BrandIcon, { BRAND_STYLE, type BrandId } from "@/components/ui/BrandIcon";

/**
 * Кнопка-ссылка на мессенджер или соцсеть в фирменном стиле приложения.
 *
 *   pill — цветная «таблетка» с белым значком: Telegram синий, VK синий,
 *          Max с градиентом. Для призывов «Написать».
 *   chip — светлая, с цветным логотипом и ником. Для светлых секций.
 *   icon — круглая кнопка-значок. Для подвала: белая, при наведении
 *          заливается цветом приложения.
 */
export default function SocialButton({
  brand,
  href,
  label,
  handle,
  variant = "pill",
  size = "md",
  className,
}: {
  brand: BrandId;
  href: string;
  label: string;
  handle?: string;
  variant?: "pill" | "chip" | "icon";
  size?: "md" | "lg";
  className?: string;
}) {
  const style = BRAND_STYLE[brand];
  const external = { target: "_blank", rel: "noopener noreferrer" } as const;

  if (variant === "icon") {
    return (
      <a
        href={href}
        {...external}
        aria-label={label}
        title={label}
        style={{ "--brand-bg": style.background } as React.CSSProperties}
        className={clsx(
          "group relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-full",
          "bg-white/[0.07] text-white/80 ring-1 ring-white/12 transition-[color,transform] duration-300 ease-[var(--ease-out-expo)]",
          "hover:-translate-y-0.5 hover:text-white",
          className
        )}
      >
        <span
          aria-hidden
          className="absolute inset-0 scale-50 rounded-full opacity-0 transition-[opacity,transform] duration-300 ease-[var(--ease-out-expo)] group-hover:scale-100 group-hover:opacity-100 [background:var(--brand-bg)]"
        />
        <BrandIcon brand={brand} mono className="relative h-5 w-5" />
      </a>
    );
  }

  if (variant === "chip") {
    return (
      <a
        href={href}
        {...external}
        className={clsx(
          "group inline-flex items-center gap-3 rounded-2xl border-2 border-[var(--color-ink)] bg-[var(--color-surface)] py-2.5 pl-2.5 pr-5",
          "shadow-hard-sm transition-[translate,box-shadow] duration-150 ease-out",
          "hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-hard",
          className
        )}
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-surface-alt)]">
          <BrandIcon brand={brand} className="h-6 w-6 text-black" />
        </span>
        <span className="leading-tight">
          <span className="block font-bold text-[var(--color-ink)]">{label}</span>
          {handle && (
            <span className="block text-caption text-[var(--color-ink-muted)]">{handle}</span>
          )}
        </span>
      </a>
    );
  }

  return (
    <a
      href={href}
      {...external}
      style={{ background: style.background }}
      className={clsx(
        "btn-shine inline-flex items-center justify-center gap-2.5 rounded-full border-2 border-[var(--color-ink)] font-bold text-white",
        "shadow-hard transition-[translate,box-shadow,filter] duration-150 ease-out",
        "hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-hard-sm hover:brightness-105",
        "active:translate-x-[4px] active:translate-y-[4px] active:shadow-none",
        size === "lg" ? "px-7 py-3.5 text-[0.96875rem]" : "px-5 py-2.5 text-[0.9375rem]",
        className
      )}
    >
      <BrandIcon brand={brand} mono className={size === "lg" ? "h-5 w-5" : "h-[1.125rem] w-[1.125rem]"} />
      <span>{label}</span>
    </a>
  );
}
