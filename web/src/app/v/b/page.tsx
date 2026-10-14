import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import SplitText from "@/components/ui/SplitText";
import Icon from "@/components/ui/Icon";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import StartCourseButton from "@/components/landing/StartCourseButton";
import AboutAnna from "@/components/landing/AboutAnna";
import CourseFAQ from "@/components/landing/CourseFAQ";
import FinalCta from "@/components/landing/FinalCta";
import {
  COURSE_FACTS,
  COURSE_HERO,
  COURSE_LESSONS,
  COURSE_OUTCOMES,
  COURSE_PROBLEM,
  COURSE_READING,
} from "@/content/course";
import { getCourseAccess } from "@/lib/course-access";

/**
 * Вариант B — «Маршрут в тетради».
 * Первый экран по центру: крупный заголовок, кнопка и три стикера с цифрами.
 * Дальше — «если трудно понять что писать», затем весь курс как путь
 * из шести шагов на тетрадной странице со списком чтения сбоку,
 * «что ты сделаешь», Анна и вопросы.
 */
export default async function VariantB() {
  const access = await getCourseAccess();

  return (
    <>
      <section id="top" className="relative -mt-[88px] overflow-hidden sm:-mt-[104px]">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="bg-grid absolute inset-0" />
          <div className="absolute inset-y-0 left-8 hidden w-[2px] bg-[var(--color-accent-dark)] opacity-25 xl:block" />
        </div>
        <Container className="relative flex flex-col items-center pb-20 pt-[132px] text-center sm:pb-28 sm:pt-[170px]">
          <Reveal immediate>
            <p className="eyebrow">{COURSE_HERO.eyebrow}</p>
          </Reveal>
          <SplitText
            as="h1"
            immediate
            delay={120}
            text={COURSE_HERO.title}
            highlight={COURSE_HERO.highlight}
            tone="inherit"
            marker
            className="mt-5 max-w-[17ch] text-balance text-display text-[var(--color-ink)]"
          />
          <Reveal immediate delay={0.35}>
            <p className="mx-auto mt-7 max-w-[40rem] text-lead text-[var(--color-ink-soft)]">{COURSE_HERO.text}</p>
          </Reveal>
          <Reveal immediate delay={0.45}>
            <div className="mt-9 flex flex-col items-center">
              <StartCourseButton
                {...access}
                label={access.isEnrolled ? "Продолжить курс" : COURSE_HERO.button}
                className="w-full sm:w-auto"
              />
              <p className="mt-4 max-w-[28rem] text-caption text-[var(--color-ink-muted)]">{COURSE_HERO.underButton}</p>
            </div>
          </Reveal>

          <RevealGroup immediate delayChildren={0.6} stagger={0.08} className="mt-12 grid w-full max-w-md grid-cols-3 gap-2.5 sm:flex sm:max-w-none sm:justify-center sm:gap-4">
            {COURSE_FACTS.map((f, i) => (
              <RevealItem key={f.label}>
                <div
                  className={`h-full rounded-2xl border-2 border-[var(--color-ink)] px-2.5 py-3 shadow-hard sm:px-5 ${
                    i === 2 ? "rotate-[2deg] bg-[var(--color-accent)]" : i === 0 ? "rotate-[-2deg] bg-white" : "bg-white"
                  }`}
                >
                  <p className="font-display text-[1.25rem] font-bold leading-none text-[var(--color-ink)] sm:text-[1.5rem]">{f.value}</p>
                  <p className="mt-1 text-[0.75rem] leading-snug text-[var(--color-ink-soft)] sm:text-caption">{f.label}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </section>

      <Section tone="ink">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
          <Reveal>
            <p className="eyebrow eyebrow-on-dark">Знакомо?</p>
            <h2 className="mt-4 text-h2 text-white">{COURSE_PROBLEM.title}</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="space-y-5 text-lead text-white/75">
              {COURSE_PROBLEM.text.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </Reveal>
        </div>
      </Section>

      <Section id="program">
        <Reveal>
          <SectionHeading eyebrow="Маршрут курса" title="Шесть шагов к своему сочинению" highlight="своему сочинению" marker />
        </Reveal>

        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
          {/* Путь: номера на линии, урок — карточкой на «тетрадном листе». */}
          <ol className="relative">
            <span
              aria-hidden
              className="absolute bottom-10 left-[1.375rem] top-6 w-0 border-l-2 border-dashed border-[var(--color-ink)]/40 sm:left-[1.625rem]"
            />
            {COURSE_LESSONS.map((l) => (
              <li key={l.number} className="relative pb-6 pl-16 last:pb-0 sm:pl-20">
                <Reveal>
                  <span
                    className={`absolute left-0 top-4 flex h-11 w-11 items-center justify-center rounded-full border-2 border-[var(--color-ink)] font-display font-bold sm:h-[3.25rem] sm:w-[3.25rem] sm:text-lg ${
                      l.number === 1 ? "bg-[var(--color-accent)] text-[var(--color-ink)]" : "bg-white text-[var(--color-ink)]"
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

      <Section tone="tint">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-center">
          <Reveal>
            <SectionHeading eyebrow="Результат" title={COURSE_OUTCOMES.title} />
          </Reveal>
          <RevealGroup stagger={0.07} className="grid gap-3">
            {COURSE_OUTCOMES.items.map((item) => (
              <RevealItem key={item}>
                <div className="flex items-center gap-4 rounded-2xl border-2 border-[var(--color-ink)] bg-white px-5 py-4 shadow-hard-sm">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 border-[var(--color-ink)] bg-[var(--color-accent)]">
                    <Icon name="check" className="h-4 w-4 text-[var(--color-ink)]" strokeWidth={2.8} />
                  </span>
                  <p className="font-semibold text-[var(--color-ink)]">{item}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Section>

      <AboutAnna tone="default" />
      <CourseFAQ tone="tint" />
      <FinalCta access={access} />
    </>
  );
}
