import Link from "next/link";
import clsx from "clsx";
import type { ButtonHTMLAttributes } from "react";

/**
 * Кнопка сайта.
 *
 * Новый стиль: «таблетка» с тёмной обводкой и жёсткой тенью без размытия.
 * При наведении кнопка сдвигается к тени, при нажатии «вдавливается»
 * полностью. Стрелка в конце при наведении сдвигается вперёд.
 *
 * Варианты:
 *   primary / accent — главные действия (на розовом — только тёмный текст);
 *   outline          — второстепенное рядом с главным;
 *   glass            — полупрозрачная, для светлых фонов с картинкой;
 *   light            — белая с розовой тенью, для тёмных секций
 *                      (тёмная тень на тёмном фоне не видна);
 *   ghost            — без фона и тени.
 */

type Variant = "primary" | "accent" | "outline" | "glass" | "light" | "ghost";
type Size = "md" | "lg";

const base =
  "btn-shine inline-flex items-center justify-center gap-2.5 rounded-full border-2 font-bold tracking-[-0.01em] " +
  "transition-[translate,box-shadow,background-color,border-color,color] duration-150 ease-out " +
  "disabled:pointer-events-none disabled:opacity-50 " +
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-primary)]";

/* Нажатие: тень 4px → 2px при наведении → 0 при нажатии, кнопка едет следом. */
const press =
  "border-[var(--color-ink)] shadow-hard " +
  "hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-hard-sm " +
  "active:translate-x-[4px] active:translate-y-[4px] active:shadow-none";

const pressOnDark =
  "border-[var(--color-ink)] shadow-[4px_4px_0_var(--color-accent)] " +
  "hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_var(--color-accent)] " +
  "active:translate-x-[4px] active:translate-y-[4px] active:shadow-none";

const variants: Record<Variant, string> = {
  primary: `${press} bg-[var(--color-primary)] text-white`,
  accent: `${press} bg-[var(--color-accent)] text-[var(--color-ink)]`,
  outline: `${press} bg-white text-[var(--color-ink)] hover:bg-[var(--color-accent-tint)]`,
  glass: `${press} bg-white/85 text-[var(--color-ink)] backdrop-blur-md hover:bg-white`,
  light: `${pressOnDark} bg-white text-[var(--color-ink)]`,
  ghost: "border-transparent text-[var(--color-ink)] hover:bg-black/5",
};

const sizes: Record<Size, string> = {
  md: "px-5 py-2 text-[0.9375rem]",
  lg: "px-7 py-3.5 text-[0.96875rem]",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = CommonProps & {
  href: string;
  target?: string;
  rel?: string;
};

export default function Button(props: ButtonAsButton | ButtonAsLink) {
  const { variant = "primary", size = "md", className, children } = props;
  const classes = clsx(base, variants[variant], sizes[size], className);

  if ("href" in props && props.href) {
    const { href, target, rel } = props;
    return (
      <Link href={href} target={target} rel={rel} className={classes}>
        {children}
      </Link>
    );
  }

  const { href, variant: v, size: s, className: c, children: ch, ...rest } =
    props as ButtonAsButton;

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
