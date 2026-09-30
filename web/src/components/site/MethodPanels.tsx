import Icon from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { METHOD } from "@/content/site";

/**
 * Два блока: что происходит на занятии и что после него.
 *
 * Вторая половина намеренно подана на равных с первой — домашняя работа
 * и разбор ошибок дают половину результата, хотя обычно про них пишут вскользь.
 *
 * Используется и на странице «Обо мне», и на странице занятий.
 */
export default function MethodPanels({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="grid gap-6 lg:grid-cols-2">
        <Reveal from="right">
          <MethodPanel icon="video" eyebrow="Во время занятия" items={[...METHOD.during]} />
        </Reveal>
        <Reveal from="left" delay={0.1}>
          <MethodPanel icon="document" eyebrow="После занятия" items={[...METHOD.after]} accent />
        </Reveal>
      </div>
    </div>
  );
}

function MethodPanel({
  icon,
  eyebrow,
  items,
  accent = false,
}: {
  icon: "video" | "document";
  eyebrow: string;
  items: string[];
  accent?: boolean;
}) {
  const tint = accent ? "var(--color-accent-dark)" : "var(--color-primary)";

  return (
    <div className="flex h-full flex-col rounded-panel border-2 border-[var(--color-ink)] bg-[var(--color-surface)] p-7 shadow-hard sm:p-9">
      <span
        className={`flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-[var(--color-ink)] shadow-hard-sm ${
          accent ? "bg-[var(--color-accent)] text-[var(--color-ink)]" : "bg-[var(--color-primary)] text-white"
        }`}
      >
        <Icon name={icon} className="h-6 w-6" />
      </span>

      <p className="mt-5 text-eyebrow uppercase" style={{ color: tint }}>
        {eyebrow}
      </p>

      <ul className="mt-6 space-y-4">
        {items.map((item, i) => (
          <li key={item} className="flex items-start gap-4">
            <span
              className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-caption font-bold"
              style={{
                backgroundColor: "color-mix(in srgb, " + tint + " 12%, transparent)",
                color: tint,
              }}
            >
              {i + 1}
            </span>
            <span className="text-[var(--color-ink-soft)]">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
