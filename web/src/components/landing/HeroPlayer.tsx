import Image from "next/image";
import Container from "@/components/ui/Container";
import SplitText from "@/components/ui/SplitText";
import Icon from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import StartCourseButton from "@/components/landing/StartCourseButton";
import StartCourseTrigger from "@/components/landing/StartCourseTrigger";
import { MEDIA } from "@/content/media";
import { COURSE_HERO, COURSE_LESSONS } from "@/content/course";
import type { CourseAccess } from "@/lib/course-access";

/**
 * Первый экран: курс, который «уже здесь».
 *
 * Сверху короткий заголовок, под ним на всю ширину — большой «плеер»
 * первого урока с кнопкой ▶. Это хук, о котором просила Анна: с первого
 * взгляда видно, что на сайте смотрят бесплатный курс, и куда нажать.
 * Клик по плееру и кнопка под ним ведут в одно место — к уроку 1
 * (гостя — через регистрацию).
 *
 * Видео ещё не записаны, поэтому плеер — обложка, а не настоящее видео.
 * Когда появится трейлер, его можно поставить в эту же рамку.
 */
export default function HeroPlayer({ access }: { access: CourseAccess }) {
  const label = access.isEnrolled ? "Продолжить курс" : COURSE_HERO.button;
  const first = COURSE_LESSONS[0];

  return (
    <section id="top" className="relative -mt-[88px] overflow-hidden sm:-mt-[104px]">
      <div aria-hidden className="bg-grid pointer-events-none absolute inset-0" />

      <Container className="relative pb-16 pt-[118px] sm:pb-20 sm:pt-[140px]">
        {/* Заголовок */}
        <div className="mx-auto max-w-[68rem] text-center">
          <Reveal immediate>
            <span className="inline-flex items-center gap-2 rounded-full border-2 border-[var(--color-ink)] bg-[var(--color-accent)] px-3.5 py-1.5 text-[0.75rem] font-bold uppercase tracking-[0.12em] text-[var(--color-ink)] shadow-hard-sm">
              {COURSE_HERO.eyebrow}
            </span>
          </Reveal>
          <SplitText
            as="h1"
            immediate
            delay={60}
            text={COURSE_HERO.title}
            highlight={COURSE_HERO.highlight}
            tone="inherit"
            marker
            className="mt-5 text-balance text-[clamp(1.875rem,1rem+2.4vw,3rem)] font-extrabold leading-[1.06] tracking-[-0.04em] text-[var(--color-ink)]"
          />
        </div>

        {/* Плеер */}
        <Reveal immediate delay={0.1} variant="scale" className="relative mx-auto mt-8 max-w-[68rem] sm:mt-9">
          {/* Стикер «бесплатно» поверх угла рамки */}
          <span className="absolute -left-2 -top-4 z-20 rotate-[-6deg] rounded-2xl border-2 border-[var(--color-ink)] bg-[var(--color-accent)] px-3.5 py-2 font-display text-[0.9375rem] font-bold text-[var(--color-ink)] shadow-hard sm:-left-5 sm:-top-5 sm:px-5 sm:py-2.5 sm:text-[1.25rem]">
            0 ₽ · бесплатно
          </span>

          <StartCourseTrigger {...access} ariaLabel={`Смотреть урок 1. ${first.title}`} className="group block w-full text-left">
            <div className="relative overflow-hidden rounded-panel border-2 border-[var(--color-ink)] bg-[var(--color-ink)] shadow-[8px_8px_0_var(--color-ink)] transition-[translate,box-shadow] duration-150 group-hover:translate-x-[3px] group-hover:translate-y-[3px] group-hover:shadow-[5px_5px_0_var(--color-ink)]">
              <div className="bg-brand-gradient relative aspect-[4/5] overflow-hidden sm:aspect-[16/9] lg:aspect-[2/1]">
                <div aria-hidden className="bg-grid-light absolute inset-0" />
                {/* Розовый круг за Анной */}
                <div className="absolute bottom-[42%] right-[3%] aspect-square h-[26%] rounded-full border-2 border-[var(--color-ink)] bg-[var(--color-accent)] sm:bottom-[30%] sm:right-[12%] sm:h-[52%]" />

                {/* Анна */}
                <div className="absolute bottom-0 right-[-4%] h-[64%] sm:right-[3%] sm:h-[100%]">
                  <Image
                    src={MEDIA.heroCutout.src}
                    alt={MEDIA.heroCutout.alt}
                    width={MEDIA.heroCutout.width}
                    height={MEDIA.heroCutout.height}
                    preload
                    sizes="(max-width: 640px) 70vw, 40vw"
                    className="h-full w-auto max-w-none select-none object-contain object-bottom"
                    draggable={false}
                  />
                </div>

                {/* Название урока */}
                <div className="absolute left-[6%] top-[7%] max-w-[70%] sm:left-[5%] sm:top-[9%] sm:max-w-[48%]">
                  <p className="text-[0.75rem] font-bold uppercase tracking-[0.16em] text-white/70 sm:text-[0.8125rem]">
                    Урок 1 из {COURSE_LESSONS.length}
                  </p>
                  <p className="mt-2 font-display text-[clamp(1.75rem,1rem+3.4vw,3.75rem)] font-bold leading-[1.02] tracking-[-0.03em] text-white">
                    {first.title}
                  </p>
                </div>

                {/* Кнопка ▶ с пульсом */}
                <div className="absolute left-[6%] top-[38%] sm:left-[5%] sm:top-[44%]">
                  <span className="relative flex h-24 w-24 items-center justify-center sm:h-32 sm:w-32">
                    <span
                      aria-hidden
                      className="absolute inset-0 animate-ping rounded-full bg-[var(--color-accent)] opacity-40 [animation-duration:2.2s]"
                    />
                    <span className="relative flex h-full w-full items-center justify-center rounded-full border-2 border-[var(--color-ink)] bg-[var(--color-accent)] shadow-hard-lg transition-transform duration-300 group-hover:scale-110">
                      <Icon name="play" className="ml-1.5 h-11 w-11 fill-[var(--color-ink)] text-[var(--color-ink)] sm:h-14 sm:w-14" />
                    </span>
                  </span>
                  <span className="mt-4 block max-w-[10rem] rotate-[-4deg] font-hand text-[1.75rem] font-bold leading-[0.95] text-white sm:mt-5 sm:max-w-none sm:text-[2.25rem]">
                    жми и смотри бесплатно
                  </span>
                </div>

                {/* Полоса управления */}
                <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 bg-[var(--color-ink)]/85 px-4 py-3 backdrop-blur-sm sm:gap-4 sm:px-6 sm:py-4">
                  <Icon name="play" className="h-4 w-4 fill-white text-white sm:h-5 sm:w-5" />
                  <span className="h-1.5 flex-1 rounded-full bg-white/25 sm:h-2">
                    <span className="block h-full w-[6%] rounded-full bg-[var(--color-accent)]" />
                  </span>
                  <span className="text-[0.75rem] font-semibold text-white/80 sm:text-[0.875rem]">
                    1 / {COURSE_LESSONS.length}
                  </span>
                </div>
              </div>
            </div>
          </StartCourseTrigger>
        </Reveal>

        {/* Текст и кнопка под плеером */}
        <div className="mx-auto mt-10 grid max-w-[68rem] gap-6 sm:mt-12 lg:grid-cols-[minmax(0,1.2fr)_auto] lg:items-center lg:gap-12">
          <Reveal immediate delay={0.2}>
            <p className="text-lead text-[var(--color-ink-soft)]">{COURSE_HERO.text}</p>
          </Reveal>
          {/* На телефоне кнопка идёт сразу под плеером, текст — после неё. */}
          <Reveal immediate delay={0.15} className="order-first lg:order-none">
            <div className="lg:max-w-[22rem]">
              <StartCourseButton {...access} label={label} className="w-full" />
              <p className="mt-3 text-caption text-[var(--color-ink-muted)]">{COURSE_HERO.underButton}</p>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
