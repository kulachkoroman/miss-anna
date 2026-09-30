import clsx from "clsx";

/** Небольшая подпись-ярлык: «Бесплатно», «Основной формат», «Аккаунт ученика». */

type Tone = "primary" | "accent" | "neutral" | "light";

const tones: Record<Tone, string> = {
  primary: "bg-[var(--color-primary-soft)] text-[var(--color-primary)]",
  accent: "bg-[var(--color-accent-soft)] text-[var(--color-accent-dark)]",
  neutral: "bg-[var(--color-surface-alt)] text-[var(--color-ink-soft)]",
  light: "bg-white/15 text-white backdrop-blur-sm ring-1 ring-white/25",
};

export default function Badge({
  children,
  tone = "primary",
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={clsx(
        "inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5",
        "text-[0.6875rem] font-bold uppercase leading-none tracking-[0.12em]",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
