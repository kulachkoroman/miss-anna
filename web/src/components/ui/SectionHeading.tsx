import clsx from "clsx";
import SplitText from "@/components/ui/SplitText";

/**
 * Заголовок секции в манере лендинга Давида:
 * надзаголовок прописными с разрядкой → крупный плотный заголовок,
 * который появляется по словам → приглушённый подзаголовок.
 *
 * highlight — часть заголовка, которую нужно выделить цветом;
 * marker — дополнительно подчеркнуть её маркером.
 */
export default function SectionHeading({
  eyebrow,
  title,
  highlight,
  marker = false,
  description,
  align = "left",
  as = "h2",
  /** true — для тёмных секций: меняет цвета текста на светлые. */
  onDark = false,
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  highlight?: string;
  marker?: boolean;
  description?: React.ReactNode;
  align?: "left" | "center";
  as?: "h1" | "h2";
  onDark?: boolean;
  className?: string;
}) {
  const titleClass = clsx(
    "text-balance",
    as === "h1" ? "text-h1" : "text-h2",
    eyebrow && "mt-4",
    onDark ? "text-white" : "text-[var(--color-ink)]"
  );

  return (
    <div className={clsx("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && <p className={clsx("eyebrow", onDark && "eyebrow-on-dark")}>{eyebrow}</p>}

      {typeof title === "string" ? (
        <SplitText
          as={as}
          text={title}
          highlight={highlight}
          tone={onDark ? "accent" : "primary"}
          marker={marker}
          className={titleClass}
        />
      ) : as === "h1" ? (
        <h1 className={titleClass}>{title}</h1>
      ) : (
        <h2 className={titleClass}>{title}</h2>
      )}

      {description && (
        <p
          className={clsx(
            "mt-5 text-lead",
            align === "center" && "mx-auto",
            "max-w-[38rem]",
            onDark ? "text-white/70" : "text-[var(--color-ink-soft)]"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
