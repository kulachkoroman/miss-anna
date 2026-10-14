import clsx from "clsx";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Icon, { type IconName } from "@/components/ui/Icon";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { COURSE_HOW } from "@/content/course";

/**
 * «Как проходить уроки»: текст и три шага работы с уроком.
 * Шаги — разные по цвету карточки (фиолетовый → розовый → белый) с иконкой
 * и крупным номером, между ними стрелки: на широком экране вправо,
 * на телефоне вниз. Так цикл «смотри → пиши → сверяй» читается с одного взгляда.
 */

const STEP_STYLE: Array<{ icon: IconName; card: string; title: string; text: string; num: string; badge: string }> = [
  {
    icon: "play",
    card: "bg-[var(--color-primary)]",
    title: "text-white",
    text: "text-white/80",
    num: "text-white/25",
    badge: "bg-white text-[var(--color-primary)]",
  },
  {
    icon: "pencil",
    card: "bg-[var(--color-accent)]",
    title: "text-[var(--color-ink)]",
    text: "text-[var(--color-ink)]/75",
    num: "text-[var(--color-ink)]/15",
    badge: "bg-white text-[var(--color-ink)]",
  },
  {
    icon: "check",
    card: "bg-white",
    title: "text-[var(--color-ink)]",
    text: "text-[var(--color-ink-soft)]",
    num: "text-[var(--color-primary)]/15",
    badge: "bg-[var(--color-primary)] text-white",
  },
];

export default function CourseHow() {
  return (
    <Section id="how">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <Reveal className="max-w-2xl">
          <SectionHeading eyebrow={COURSE_HOW.eyebrow} title={COURSE_HOW.title} description={COURSE_HOW.text} />
        </Reveal>
        <Reveal delay={0.1}>
          <p className="inline-flex items-center gap-2 rounded-2xl border-2 border-[var(--color-ink)] bg-white px-4 py-2 text-[0.875rem] sm:rounded-full font-semibold text-[var(--color-ink)] shadow-hard-sm">
            <Icon name="clock" className="h-4 w-4 text-[var(--color-primary)]" />
            {COURSE_HOW.time}
          </p>
        </Reveal>
      </div>

      <RevealGroup stagger={0.12} className="mt-12 grid gap-3 lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:items-stretch lg:gap-4">
        {COURSE_HOW.steps.flatMap((step, i) => {
          const st = STEP_STYLE[i];
          const card = (
            <RevealItem key={step.title} className="h-full">
              <div
                className={clsx(
                  "relative h-full overflow-hidden rounded-panel border-2 border-[var(--color-ink)] p-6 shadow-hard sm:p-7",
                  st.card
                )}
              >
                {/* Крупный номер фоном в углу */}
                <span
                  aria-hidden
                  className={clsx(
                    "pointer-events-none absolute -right-1 -top-4 font-display text-[6.5rem] font-bold leading-none tracking-[-0.06em]",
                    st.num
                  )}
                >
                  {i + 1}
                </span>
                <span
                  className={clsx(
                    "relative flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-[var(--color-ink)] shadow-hard-sm",
                    st.badge
                  )}
                >
                  <Icon name={st.icon} className="h-6 w-6" strokeWidth={2.2} />
                </span>
                <p className={clsx("relative mt-6 font-display text-[1.25rem] font-bold leading-tight tracking-[-0.02em]", st.title)}>
                  {step.title}
                </p>
                <p className={clsx("relative mt-2 text-[0.9375rem] leading-relaxed", st.text)}>{step.text}</p>
              </div>
            </RevealItem>
          );
          if (i === COURSE_HOW.steps.length - 1) return [card];
          return [
            card,
            <RevealItem key={`arrow-${i}`} className="flex items-center justify-center">
              <Icon name="arrowRight" className="h-7 w-7 rotate-90 text-[var(--color-ink)] lg:rotate-0" strokeWidth={2.4} />
            </RevealItem>,
          ];
        })}
      </RevealGroup>
    </Section>
  );
}
