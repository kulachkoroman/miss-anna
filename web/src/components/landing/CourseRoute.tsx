import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Icon from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import RouteStep from "@/components/landing/RouteStep";
import { COURSE_LESSONS, COURSE_READING } from "@/content/course";

/**
 * Программа курса как маршрут: номера уроков на пунктирной линии,
 * урок — карточкой, в конце — «самостоятельное сочинение».
 * Сбоку (на телефоне — под маршрутом) список чтения.
 */
export default function CourseRoute() {
  return (
    <Section id="program" tone="tint">
      <Reveal>
        <SectionHeading eyebrow="Программа" title="Шесть шагов к своему сочинению" highlight="своему сочинению" marker />
      </Reveal>

      <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
        <ol className="relative">
          <span
            aria-hidden
            className="absolute bottom-10 left-[1.375rem] top-6 w-0 border-l-2 border-dashed border-[var(--color-ink)]/40 sm:left-[1.625rem]"
          />
          {COURSE_LESSONS.map((l) => (
            <RouteStep key={l.number} number={l.number} tone={l.number === 1 ? "accent" : "plain"}>
              <div className="rounded-card border-2 border-[var(--color-ink)] bg-white p-5 shadow-hard-sm sm:p-6">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3 className="text-h4 text-[var(--color-ink)]">{l.title}</h3>
                  {l.number === 1 && (
                    <span className="font-hand text-[1.375rem] font-bold leading-none text-[var(--color-accent-dark)]">
                      ← старт
                    </span>
                  )}
                </div>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-[var(--color-ink-soft)]">{l.text}</p>
              </div>
            </RouteStep>
          ))}
          <RouteStep tone="finish" number={<Icon name="check" className="h-5 w-5" strokeWidth={2.6} />}>
            <p className="pt-3 font-hand text-[1.75rem] font-bold leading-none text-[var(--color-ink)] sm:pt-3.5">
              самостоятельное сочинение!
            </p>
          </RouteStep>
        </ol>

        <Reveal delay={0.1} className="lg:sticky lg:top-28">
          <aside className="rounded-card border-2 border-[var(--color-ink)] bg-[var(--color-accent-tint)] p-6 shadow-hard">
            <p className="eyebrow">Что прочитать</p>
            <p className="mt-2 text-caption text-[var(--color-ink-muted)]">
              Читать заранее не нужно — чтение входит в маршрут.
            </p>
            <ul className="mt-4 space-y-2.5">
              {COURSE_READING.map((r) => (
                <li key={r.title} className="flex gap-2.5 text-[0.9375rem] leading-snug">
                  <Icon name="document" className="mt-0.5 h-4 w-4 text-[var(--color-accent-dark)]" />
                  <span>
                    <span className="font-semibold text-[var(--color-ink)]">{r.title}</span>
                    <span className="text-[var(--color-ink-muted)]"> · {r.author}</span>
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-5 border-t-2 border-dashed border-[var(--color-ink)]/20 pt-4 text-caption text-[var(--color-ink-soft)]">
              Ещё понадобятся тетрадь, ручка и орфографический словарь.
            </div>
          </aside>
        </Reveal>
      </div>
    </Section>
  );
}
