import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Icon from "@/components/ui/Icon";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { COURSE_HOW } from "@/content/course";

/** «Как устроено обучение»: текст Анны и три шага работы с уроком. */
export default function CourseHow() {
  return (
    <Section id="how">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center">
        <Reveal>
          <SectionHeading eyebrow="Как это работает" title={COURSE_HOW.title} description={COURSE_HOW.text[0]} />
          <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--color-surface-alt)] px-4 py-2 text-[0.875rem] font-semibold text-[var(--color-ink)]">
            <Icon name="clock" className="h-4 w-4 text-[var(--color-primary)]" />
            до 20 часов на весь маршрут, в своём темпе
          </p>
        </Reveal>
        <RevealGroup stagger={0.1} className="grid gap-4 sm:grid-cols-3">
          {COURSE_HOW.steps.map((s, i) => (
            <RevealItem key={s.title}>
              <div className="h-full rounded-card border-2 border-[var(--color-ink)] bg-white p-5 shadow-hard-sm">
                <p className="font-hand text-[1.75rem] font-bold leading-none text-[var(--color-accent-dark)]">{i + 1}.</p>
                <p className="mt-3 font-bold text-[var(--color-ink)]">{s.title}</p>
                <p className="mt-1 text-caption text-[var(--color-ink-muted)]">{s.text}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </Section>
  );
}
