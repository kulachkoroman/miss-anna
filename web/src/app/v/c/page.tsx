import Image from "next/image";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import SplitText from "@/components/ui/SplitText";
import Icon from "@/components/ui/Icon";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import StartCourseButton from "@/components/landing/StartCourseButton";
import StartCourseTrigger from "@/components/landing/StartCourseTrigger";
import AboutAnna from "@/components/landing/AboutAnna";
import CourseFAQ from "@/components/landing/CourseFAQ";
import { MEDIA } from "@/content/media";
import { COURSE_HERO, COURSE_LESSONS } from "@/content/course";
import { getCourseAccess } from "@/lib/course-access";

/**
 * Вариант C — «Минимум».
 * Первый экран прежнего сайта (Анна на арке), но всё про курс.
 * Под ним — программа одним списком, Анна в две строки и вопросы,
 * свёрнутые по умолчанию.
 */
export default async function VariantC() {
  const access = await getCourseAccess();
  const label = access.isEnrolled ? "Продолжить курс" : COURSE_HERO.button;

  return (
    <>
      <section id="top" className="relative -mt-[88px] overflow-hidden sm:-mt-[104px]">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="bg-grid absolute inset-0" />
          <div className="absolute inset-y-0 left-8 hidden w-[2px] bg-[var(--color-accent-dark)] opacity-25 xl:block" />
        </div>

        <Container className="relative grid items-end gap-6 pt-[120px] sm:pt-[140px] lg:min-h-[max(90svh,700px)] lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] lg:gap-10">
          <div className="self-center lg:pb-16">
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
              className="mt-5 text-balance text-[clamp(2rem,1rem+2.9vw,3rem)] font-extrabold leading-[1.08] tracking-[-0.04em] text-[var(--color-ink)]"
            />
            <Reveal immediate delay={0.35}>
              <p className="mt-7 max-w-[34rem] text-lead text-[var(--color-ink-soft)]">{COURSE_HERO.text}</p>
            </Reveal>
            <Reveal immediate delay={0.45}>
              <div className="mt-9">
                <StartCourseButton {...access} label={label} className="w-full sm:w-auto" />
                <p className="mt-4 max-w-[30rem] text-caption text-[var(--color-ink-muted)]">{COURSE_HERO.underButton}</p>
              </div>
            </Reveal>
          </div>

          <ArchVisual />
        </Container>
      </section>

      <Section id="program" tone="tint" size="sm">
        <Reveal>
          <div className="overflow-hidden rounded-panel border-2 border-[var(--color-ink)] bg-white shadow-hard">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-[var(--color-ink)] bg-[var(--color-accent)] px-5 py-4 sm:px-7">
              <h2 className="font-display text-[1.125rem] font-bold text-[var(--color-ink)] sm:text-[1.375rem]">
                Программа курса
              </h2>
              <span className="text-[0.8125rem] font-semibold text-[var(--color-ink)]">6 видеоуроков · до 20 часов</span>
            </div>
            <RevealGroup stagger={0.05} className="divide-y-2 divide-dashed divide-[var(--color-border-strong)]">
              {COURSE_LESSONS.map((l) => (
                <RevealItem key={l.number}>
                  <StartCourseTrigger
                    {...access}
                    ariaLabel={`Урок ${l.number}. ${l.title}`}
                    className="group flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-[var(--color-accent-tint)] sm:gap-5 sm:px-7 sm:py-5"
                  >
                    <span className="font-display text-[1.375rem] font-bold leading-none text-[var(--color-primary)] sm:text-[1.625rem]">
                      {String(l.number).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-bold text-[var(--color-ink)]">{l.title}</span>
                      <span className="mt-0.5 block text-caption text-[var(--color-ink-muted)]">
                        {l.works.length > 0 ? l.works.join(", ") : l.number === 5 ? "план и первая полная работа" : "исправления и пробник"}
                      </span>
                    </span>
                    <Icon
                      name={l.number === 1 ? "play" : "arrowRight"}
                      className="h-5 w-5 text-[var(--color-ink-muted)] transition-transform group-hover:translate-x-1 group-hover:text-[var(--color-ink)]"
                    />
                  </StartCourseTrigger>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </Reveal>
      </Section>

      <AboutAnna tone="default" compact />
      <CourseFAQ tone="tint" defaultOpen={null} />
    </>
  );
}

/** Анна на фирменной арке — как на прежнем первом экране, но стикеры про курс. */
function ArchVisual() {
  return (
    <Reveal
      immediate
      delay={0.15}
      variant="scale"
      className="relative mx-auto h-[min(118vw,520px)] w-full max-w-[30rem] sm:h-[600px] lg:h-full lg:min-h-[620px] lg:max-w-none"
    >
      <div className="bg-brand-gradient absolute bottom-0 left-1/2 h-[80%] w-[82%] max-w-[26rem] -translate-x-1/2 overflow-hidden rounded-t-full border-2 border-b-0 border-[var(--color-ink)] shadow-[6px_0_0_var(--color-ink)]">
        <div className="bg-grid-light absolute inset-0" />
      </div>
      <div className="absolute right-[6%] top-[16%] h-20 w-20 rounded-full border-2 border-[var(--color-ink)] bg-[var(--color-accent)] sm:h-28 sm:w-28" />
      <div className="absolute bottom-0 left-1/2 h-[98%] -translate-x-[46%]">
        <Image
          src={MEDIA.heroCutout.src}
          alt={MEDIA.heroCutout.alt}
          width={MEDIA.heroCutout.width}
          height={MEDIA.heroCutout.height}
          preload
          sizes="(max-width: 640px) 70vw, (max-width: 1024px) 45vw, 32vw"
          className="h-full w-auto max-w-none select-none object-contain object-bottom"
          draggable={false}
        />
      </div>

      <div aria-hidden className="absolute left-[2%] top-[11%] z-10 flex flex-col items-start text-[var(--color-accent-dark)] sm:left-0">
        <span className="rotate-[-7deg] font-hand text-[1.75rem] font-bold leading-none sm:text-[2rem]">это бесплатно!</span>
        <svg viewBox="0 0 46 64" className="ml-4 mt-1 h-11 w-8 sm:h-14 sm:w-10" fill="none">
          <path d="M30 4 C 10 14, 6 34, 14 56" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
          <path d="M6 46 L14 57 L23 48" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <Sticker title="6 видеоуроков" text="0 ₽, без оплаты" accent className="left-0 top-[30%] rotate-[-5deg] sm:-left-4" />
      <Sticker title="Итоговое сочинение" text="11 класс" className="bottom-[9%] left-[2%] rotate-[-2deg] [animation-delay:0.6s]" />
    </Reveal>
  );
}

function Sticker({
  title,
  text,
  className,
  accent = false,
}: {
  title: string;
  text: string;
  className?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`animate-float absolute z-10 flex flex-col rounded-2xl border-2 border-[var(--color-ink)] px-3.5 py-2.5 shadow-hard sm:px-4 sm:py-3 ${
        accent ? "bg-[var(--color-accent)]" : "bg-white"
      } ${className ?? ""}`}
    >
      <span className="font-display text-[0.875rem] font-bold leading-tight tracking-[-0.01em] text-[var(--color-ink)] sm:text-[0.9375rem]">
        {title}
      </span>
      <span className="mt-0.5 text-[0.75rem] text-[var(--color-ink-soft)] sm:text-caption">{text}</span>
    </div>
  );
}
