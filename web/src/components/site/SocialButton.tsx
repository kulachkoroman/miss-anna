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
          "group inline-flex items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] py-2.5 pl-2.5 pr-5",
          "shadow-subtle transition-[transform,box-shadow,border-color] duration-300 ease-[var(--ease-out-expo)]",
          "hover:-translate-y-0.5 hover:border-transparent hover:shadow-lift",
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
        "btn-shine inline-flex items-center justify-center gap-2.5 rounded-full font-bold text-white",
        "shadow-[0_10px_26px_-12px_rgba(0,0,0,0.5)] transition-[transform,box-shadow,filter] duration-300 ease-[var(--ease-out-expo)]",
        "hover:-translate-y-0.5 hover:shadow-[0_16px_34px_-14px_rgba(0,0,0,0.55)] hover:brightness-105",
        size === "lg" ? "px-7 py-4 text-[0.96875rem]" : "px-5 py-3 text-[0.9375rem]",
        className
      )}
    >
      <BrandIcon brand={brand} mono className={size === "lg" ? "h-5 w-5" : "h-[1.125rem] w-[1.125rem]"} />
      <span>{label}</span>
    </a>
  );
}
