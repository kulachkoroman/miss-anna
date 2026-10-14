import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Icon from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
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
        <SectionHeading eyebrow="Маршрут курса" title="Шесть шагов к своему сочинению" highlight="своему сочинению" marker />
      </Reveal>

      <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
        <ol className="relative">
          <span
            aria-hidden
            className="absolute bottom-10 left-[1.375rem] top-6 w-0 border-l-2 border-dashed border-[var(--color-ink)]/40 sm:left-[1.625rem]"
          />
          {COURSE_LESSONS.map((l) => (
            <li key={l.number} className="relative pb-6 pl-16 last:pb-0 sm:pl-20">
              <Reveal>
                <span
                  className={`absolute left-0 top-4 flex h-11 w-11 items-center justify-center rounded-full border-2 border-[var(--color-ink)] font-display font-bold text-[var(--color-ink)] sm:h-[3.25rem] sm:w-[3.25rem] sm:text-lg ${
                    l.number === 1 ? "bg-[var(--color-accent)]" : "bg-white"
                  }`}
                >
                  {l.number}
                </span>
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
              </Reveal>
            </li>
          ))}
          <li className="relative pl-16 pt-6 sm:pl-20">
            <span className="absolute left-0 top-6 flex h-11 w-11 items-center justify-center rounded-full border-2 border-[var(--color-ink)] bg-[var(--color-primary)] text-white sm:h-[3.25rem] sm:w-[3.25rem]">
              <Icon name="check" className="h-5 w-5" strokeWidth={2.6} />
            </span>
            <p className="pt-2.5 font-hand text-[1.75rem] font-bold leading-none text-[var(--color-ink)] sm:pt-3">
              самостоятельное сочинение!
            </p>
          </li>
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
