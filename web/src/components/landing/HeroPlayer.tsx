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

          {/*
            Наведение: сам плеер стоит на месте (раньше он сдвигался к тени — и «дёргался»,
            когда край уезжал из-под курсора). Вместо этого плавно, за 0,7 с, чуть
            приближаются слои внутри: фон, Анна, кнопка ▶ — с разной силой, как в кадре.
          */}
          <StartCourseTrigger {...access} ariaLabel="Начать бесплатный курс — урок 1" className="group block w-full text-left">
            <div className="relative overflow-hidden rounded-panel border-2 border-[var(--color-ink)] bg-[var(--color-ink)] shadow-[8px_8px_0_var(--color-ink)] transition-shadow duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:shadow-[11px_11px_0_var(--color-ink)]">
              <div className="bg-brand-gradient relative aspect-[4/5] overflow-hidden sm:aspect-[16/9] lg:aspect-[2/1]">
                {/* Фон: клетка и розовый круг — приближаются сильнее всего */}
                <div className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]">
                  <div aria-hidden className="bg-grid-light absolute inset-0" />
                  <div className="absolute bottom-[42%] right-[3%] aspect-square h-[26%] rounded-full border-2 border-[var(--color-ink)] bg-[var(--color-accent)] sm:bottom-[30%] sm:right-[12%] sm:h-[52%]" />
                </div>

                {/* Анна */}
                <div className="absolute bottom-0 right-[-11%] h-[62%] origin-bottom transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04] sm:right-[3%] sm:h-[100%]">
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

                {/* Название курса — как заставка видео */}
                <div className="absolute left-[6%] top-[12%] max-w-[72%] origin-top-left transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03] sm:left-[5%] sm:top-[9%] sm:max-w-[52%]">
                  <p className="whitespace-nowrap text-[0.6875rem] font-bold uppercase tracking-[0.1em] text-white/75 sm:text-[0.8125rem] sm:tracking-[0.18em]">
                    Бесплатный курс
                  </p>
                  {/* Название курса целиком: «Подготовка к итоговому сочинению» */}
                  <p className="mt-2 font-display text-[clamp(1.625rem,0.8rem+3vw,3.5rem)] font-bold leading-[0.98] tracking-[-0.035em] text-white">
                    подготовка к
                    <br />
                    итоговому
                    <br />
                    <span className="mt-1 inline-block rotate-[-1.5deg] rounded-xl border-2 border-[var(--color-ink)] bg-[var(--color-accent)] px-2.5 pb-1 text-[var(--color-ink)] shadow-hard-sm sm:px-3.5">
                      сочинению
                    </span>
                  </p>
                  <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[0.75rem] font-semibold text-white ring-1 ring-white/25 backdrop-blur-sm sm:mt-4 sm:text-[0.875rem]">
                    {COURSE_LESSONS.length} видеоуроков · 11 класс
                  </p>
                </div>

                {/* Кнопка ▶ с пульсом */}
                <div className="absolute bottom-[15%] left-[6%] sm:bottom-[17%] sm:left-[5%]">
                  <span className="relative flex h-20 w-20 items-center justify-center sm:h-28 sm:w-28">
                    <span
                      aria-hidden
                      className="absolute inset-0 animate-ping rounded-full bg-[var(--color-accent)] opacity-40 [animation-duration:2.2s]"
                    />
                    <span className="relative flex h-full w-full items-center justify-center rounded-full border-2 border-[var(--color-ink)] bg-[var(--color-accent)] shadow-hard-lg transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.1]">
                      <Icon name="play" className="ml-1.5 h-9 w-9 fill-[var(--color-ink)] text-[var(--color-ink)] sm:h-12 sm:w-12" />
                    </span>
                  </span>
                </div>
                <span className="absolute bottom-[19%] left-[calc(6%+6rem)] max-w-[6.5rem] rotate-[-4deg] font-hand text-[1.375rem] font-bold leading-[0.95] text-white sm:bottom-[22%] sm:left-[calc(5%+8.5rem)] sm:max-w-none sm:text-[2.125rem]">
                  жми и смотри бесплатно
                </span>

                {/* Полоса управления */}
                <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 bg-[var(--color-ink)]/85 px-4 py-3 backdrop-blur-sm sm:gap-4 sm:px-6 sm:py-4">
                  <Icon name="play" className="h-4 w-4 fill-white text-white sm:h-5 sm:w-5" />
                  <span className="h-1.5 flex-1 rounded-full bg-white/25 sm:h-2">
                    <span className="block h-full w-[6%] rounded-full bg-[var(--color-accent)]" />
                  </span>
                  <span className="text-[0.75rem] font-semibold text-white/80 sm:text-[0.875rem]">
                    урок 1 / {COURSE_LESSONS.length}
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
