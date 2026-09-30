import clsx from "clsx";
import Container from "@/components/ui/Container";

/**
 * Обёртка секции: задаёт вертикальный ритм и фон.
 *
 * Чередование tone создаёт ощущение разных зон вместо одной бесконечной ленты —
 * это главный приём против «всё выглядит одинаково».
 */

type Tone = "default" | "tint" | "surface" | "dark" | "ink";
type Size = "sm" | "md" | "lg";

const tones: Record<Tone, string> = {
  default: "bg-[var(--color-bg)]",
  tint: "bg-[var(--color-bg-tint)]",
  surface: "bg-[var(--color-surface)]",
  dark: "bg-brand-gradient text-white",
  /** Почти чёрный фиолетовый — для блоков с цифрами, чтобы не повторять градиент. */
  ink: "bg-[#110d24] text-white",
};

const sizes: Record<Size, string> = {
  sm: "py-12 sm:py-16",
  md: "py-16 sm:py-24",
  lg: "py-20 sm:py-32",
};

export default function Section({
  children,
  id,
  tone = "default",
  size = "md",
  /** true — контент во всю ширину, без ограничителя по бокам. */
  bleed = false,
  className,
  containerClassName,
}: {
  children: React.ReactNode;
  id?: string;
  tone?: Tone;
  size?: Size;
  bleed?: boolean;
  className?: string;
  containerClassName?: string;
}) {
  return (
    <section
      id={id}
      className={clsx("relative", tones[tone], sizes[size], (tone === "dark" || tone === "ink") && "texture-grain", className)}
    >
      {bleed ? children : <Container className={containerClassName}>{children}</Container>}
    </section>
  );
}
