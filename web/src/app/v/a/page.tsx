import Image from "next/image";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import SplitText from "@/components/ui/SplitText";
import Icon from "@/components/ui/Icon";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import StartCourseButton from "@/components/landing/StartCourseButton";
import StartCourseTrigger from "@/components/landing/StartCourseTrigger";
import AboutAnna from "@/components/landing/AboutAnna";
import CourseFAQ from "@/components/landing/CourseFAQ";
import FinalCta from "@/components/landing/FinalCta";
import { MEDIA } from "@/content/media";
import { COURSE_FACTS, COURSE_HERO, COURSE_HOW, COURSE_LESSONS } from "@/content/course";
import { getCourseAccess, type CourseAccess } from "@/lib/course-access";

/**
 * Вариант A — «Плеер».
 * Первый экран: слева заголовок и кнопка, справа обложка первого урока
 * с кнопкой ▶ — сразу видно, что здесь смотрят видео. Ниже программа
 * из шести карточек, как устроено обучение, коротко об Анне и вопросы.
 */
export default async function VariantA() {
  const access = await getCourseAccess();

  return (
    <>
      <section id="top" className="relative -mt-[88px] overflow-hidden sm:-mt-[104px]">
        <div aria-hidden className="bg-grid pointer-events-none absolute inset-0" />
        {/*
          Три части: заголовок, плеер, текст с кнопкой. На телефоне плеер стоит
          сразу под заголовком — его видно без прокрутки. На широком экране
          плеер уходит в правую колонку на обе строки.
        */}
        <Container className="relative grid gap-8 pb-16 pt-[120px] sm:pb-24 sm:pt-[150px] lg:min-h-[max(92svh,700px)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:grid-rows-[auto_auto] lg:content-center lg:gap-x-14 lg:gap-y-0">
          <div className="lg:self-end">
            <Reveal immediate>
              <span className="inline-flex items-center gap-2 rounded-full border-2 border-[var(--color-ink)] bg-[var(--color-accent)] px-3.5 py-1.5 text-[0.75rem] font-bold uppercase tracking-[0.12em] text-[var(--color-ink)] shadow-hard-sm">
                {COURSE_HERO.eyebrow}
              </span>
            </Reveal>
            <SplitText
              as="h1"
              immediate
              delay={120}
              text={COURSE_HERO.title}
              highlight={COURSE_HERO.highlight}
              tone="inherit"
              marker
              className="mt-6 text-balance text-[clamp(2rem,1rem+2.9vw,3.25rem)] font-extrabold leading-[1.08] tracking-[-0.04em] text-[var(--color-ink)]"
            />
          </div>

          <Reveal immediate delay={0.2} variant="scale" className="lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center">
            <PlayerCover access={access} />
          </Reveal>

          <div className="lg:col-start-1 lg:row-start-2">
            <Reveal immediate delay={0.35}>
              <p className="mt-6 max-w-[34rem] text-lead text-[var(--color-ink-soft)]">{COURSE_HERO.text}</p>
            </Reveal>
            <Reveal immediate delay={0.45}>
              <div className="mt-9">
                <StartCourseButton
                  {...access}
                  label={access.isEnrolled ? "Продолжить курс" : COURSE_HERO.button}
                  className="w-full sm:w-auto"
                />
                <p className="mt-4 max-w-[30rem] text-caption text-[var(--color-ink-muted)]">{COURSE_HERO.underButton}</p>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <Section id="program" tone="tint">
        <Reveal>
          <SectionHeading
            eyebrow="Программа"
            title="Шесть уроков: от первого тезиса до сочинения"
            highlight="до сочинения"
            marker
          />
        </Reveal>
        <RevealGroup stagger={0.07} className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {COURSE_LESSONS.map((l) => (
            <RevealItem key={l.number} className="h-full">
              <article className="flex h-full flex-col rounded-card border-2 border-[var(--color-ink)] bg-white p-6 shadow-hard transition-[translate,box-shadow] duration-150 hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-hard-lg sm:p-7">
                <div className="flex items-center justify-between gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[var(--color-ink)] bg-[var(--color-accent)] font-display text-[1.0625rem] font-bold text-[var(--color-ink)]">
                    {l.number}
                  </span>
                  {l.number === 1 ? (
                    <span className="font-hand text-[1.375rem] font-bold leading-none text-[var(--color-accent-dark)]">
                      начни здесь
                    </span>
                  ) : (
                    <span className="text-caption font-semibold text-[var(--color-ink-muted)]">Урок {l.number}</span>
                  )}
                </div>
                <h3 className="mt-5 text-h4 text-[var(--color-ink)]">{l.title}</h3>
                <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-[var(--color-ink-soft)]">{l.text}</p>
                {l.works.length > 0 && (
                  <div className="mt-auto flex flex-wrap gap-1.5 pt-5">
                    {l.works.map((w) => (
                      <span
                        key={w}
                        className="rounded-full bg-[var(--color-primary-soft)] px-2.5 py-1 text-[0.75rem] font-semibold text-[var(--color-primary-dark)]"
                      >
                        {w}
                      </span>
                    ))}
                  </div>
                )}
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

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

      <AboutAnna />
      <CourseFAQ />
      <FinalCta access={access} />
    </>
  );
}

/** Обложка «плеера»: Анна на фиолетовой клетке, кнопка ▶ и строка урока. Клик ведёт в курс. */
function PlayerCover({ access }: { access: CourseAccess }) {
  return (
    <div>
      <StartCourseTrigger {...access} ariaLabel="Смотреть урок 1" className="group block w-full text-left">
        <div className="relative overflow-hidden rounded-panel border-2 border-[var(--color-ink)] bg-white shadow-hard-lg transition-[translate,box-shadow] duration-150 group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-hover:shadow-hard">
          {/* «Окно» плеера */}
          <div className="flex items-center gap-1.5 border-b-2 border-[var(--color-ink)] px-4 py-3">
            <span className="h-3 w-3 rounded-full border-2 border-[var(--color-ink)] bg-[var(--color-accent)]" />
            <span className="h-3 w-3 rounded-full border-2 border-[var(--color-ink)] bg-white" />
            <span className="h-3 w-3 rounded-full border-2 border-[var(--color-ink)] bg-white" />
            <span className="ml-3 truncate text-[0.8125rem] font-semibold text-[var(--color-ink-soft)]">
              Урок 1 · Первый тезис
            </span>
          </div>

          <div className="bg-brand-gradient relative aspect-[4/3] overflow-hidden sm:aspect-[16/11]">
            <div aria-hidden className="bg-grid-light absolute inset-0" />
            <div className="absolute -right-4 top-6 h-24 w-24 rounded-full border-2 border-[var(--color-ink)] bg-[var(--color-accent)] sm:h-32 sm:w-32" />
            <div className="absolute bottom-0 right-[4%] h-[96%]">
              <Image
                src={MEDIA.heroCutout.src}
                alt={MEDIA.heroCutout.alt}
                width={MEDIA.heroCutout.width}
                height={MEDIA.heroCutout.height}
                preload
                sizes="(max-width: 1024px) 50vw, 26vw"
                className="h-full w-auto max-w-none select-none object-contain object-bottom"
                draggable={false}
              />
            </div>

            {/* Кнопка ▶ */}
            <span className="absolute left-[12%] top-[44%] flex h-20 w-20 -translate-y-1/2 items-center justify-center rounded-full border-2 border-[var(--color-ink)] bg-[var(--color-accent)] shadow-hard transition-transform duration-300 group-hover:scale-110 sm:h-24 sm:w-24">
              <Icon name="play" className="ml-1 h-9 w-9 fill-[var(--color-ink)] text-[var(--color-ink)]" />
            </span>
            <span className="absolute left-[7%] top-[calc(44%+3.5rem)] rotate-[-4deg] font-hand text-[1.625rem] font-bold leading-none text-white sm:top-[calc(44%+4rem)] sm:text-[1.875rem]">
              смотри бесплатно
            </span>

            {/* Полоса прогресса */}
            <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 bg-[var(--color-ink)]/80 px-4 py-3 backdrop-blur-sm">
              <Icon name="play" className="h-4 w-4 fill-white text-white" />
              <span className="h-1.5 flex-1 rounded-full bg-white/25">
                <span className="block h-full w-[8%] rounded-full bg-[var(--color-accent)]" />
              </span>
              <span className="text-[0.75rem] font-semibold text-white/80">1 / 6</span>
            </div>
          </div>
        </div>
      </StartCourseTrigger>

      <div className="mt-6 grid grid-cols-3 gap-3">
        {COURSE_FACTS.map((f) => (
          <div
            key={f.label}
            className="rounded-2xl border-2 border-[var(--color-ink)] bg-white px-3 py-3 text-center shadow-hard-sm"
          >
            <p className="font-display text-[1.25rem] font-bold leading-none text-[var(--color-ink)]">{f.value}</p>
            <p className="mt-1.5 text-[0.75rem] leading-snug text-[var(--color-ink-muted)]">{f.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
