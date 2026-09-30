import Link from "next/link";
import clsx from "clsx";
import type { ButtonHTMLAttributes } from "react";

/**
 * Кнопка сайта.
 *
 * Манера — как на лендинге Давида: «таблетка», жирный текст, при наведении
 * по кнопке проходит блик, а стрелка в конце сдвигается вперёд.
 *
 * Варианты:
 *   primary / accent — главные действия;
 *   outline          — второстепенное рядом с главным;
 *   glass            — полупрозрачная, для светлых фонов с картинкой;
 *   light            — белая, для тёмных секций;
 *   ghost            — без фона.
 */

type Variant = "primary" | "accent" | "outline" | "glass" | "light" | "ghost";
type Size = "md" | "lg";

const base =
  "btn-shine inline-flex items-center justify-center gap-2.5 rounded-full font-bold tracking-[-0.01em] " +
  "transition-[transform,box-shadow,background-color,border-color,color] duration-300 ease-[var(--ease-out-expo)] " +
  "hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] " +
  "disabled:pointer-events-none disabled:opacity-50 " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]";

const variants: Record<Variant, string> = {
  primary:
    "bg-[var(--color-primary)] text-white shadow-[0_8px_20px_-10px_rgba(74,58,255,0.7)] hover:shadow-primary",
  accent:
    "bg-[var(--color-accent)] text-white shadow-[0_8px_20px_-10px_rgba(255,138,61,0.7)] hover:shadow-accent",
  outline:
    "border-[1.5px] border-[var(--color-border-strong)] bg-white/60 text-[var(--color-ink)] backdrop-blur-md hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]",
  glass:
    "border border-white/60 bg-white/55 text-[var(--color-ink)] shadow-subtle backdrop-blur-xl hover:bg-white/80",
  light:
    "bg-white text-[var(--color-primary-deep)] shadow-[0_10px_30px_-12px_rgba(0,0,0,0.45)] hover:shadow-[0_18px_40px_-14px_rgba(0,0,0,0.55)]",
  ghost: "text-[var(--color-ink)] hover:bg-black/5",
};

const sizes: Record<Size, string> = {
  md: "px-5 py-2.5 text-[0.9375rem]",
  lg: "px-7 py-4 text-[0.96875rem]",
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
