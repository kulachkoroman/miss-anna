import Image from "next/image";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Icon from "@/components/ui/Icon";
import SplitText from "@/components/ui/SplitText";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { MEDIA } from "@/content/media";
import { HUNDRED_YEARS, PRACTICE_SINCE } from "@/content/site";

/**
 * Первый экран.
 *
 * Слева — заголовок и текст, справа — Анна без фона на фирменной арке.
 * Нижний край фото совпадает с нижним краем экрана: срез кадра прячется
 * за бегущей строкой.
 *
 * Стиль — «тетрадь»: фон в клетку с полями, ключевые слова выделены
 * розовым маркером, факты наклеены стикерами, рядом пометка от руки.
 *
 * Отрицательный отступ сверху заводит экран под плавающую шапку.
 */
export default function Hero() {
  return (
    <section
      id="hero"
      className="relative -mt-[88px] overflow-hidden bg-[var(--color-bg)] sm:-mt-[104px]"
    >
      <Backdrop />

      <Container className="relative grid items-end gap-6 pt-[120px] sm:pt-[140px] lg:min-h-[max(94svh,720px)] lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] lg:gap-10">
        {/* ——— Текст ——— */}
        <div className="self-center lg:pb-16">
          <Reveal immediate>
            <p className="eyebrow">Русский язык · ЕГЭ и ОГЭ</p>
          </Reveal>

          <SplitText
            as="h1"
            immediate
            delay={120}
            text="Подготовка к ЕГЭ и ОГЭ по русскому языку"
            highlight="по русскому языку"
            tone="inherit"
            marker
            className="mt-5 text-balance text-[clamp(2rem,1rem+2.9vw,3rem)] font-extrabold leading-[1.08] tracking-[-0.04em] text-[var(--color-ink)]"
          />

          <Reveal immediate delay={0.35}>
            <p className="mt-7 max-w-[34rem] text-lead text-[var(--color-ink-soft)]">
              Эксперт с 10-летним опытом, трижды сдала ЕГЭ на 100 баллов. Готовлю без стресса —
              на онлайн-курсах и индивидуальных занятиях, объясняю простым языком.
            </p>
          </Reveal>

          <Reveal immediate delay={0.45}>
            <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
              <Button href="/courses" size="lg">
                Выбрать курс
                <Icon name="arrowRight" className="h-5 w-5" />
              </Button>
              <Button href="/classes" variant="outline" size="lg">
                Записаться
                <Icon name="arrowRight" className="h-5 w-5" />
              </Button>
            </div>
          </Reveal>

          <RevealGroup
            immediate
            delayChildren={0.6}
            stagger={0.08}
            className="mt-11 grid max-w-[34rem] grid-cols-3 gap-4 border-t-2 border-[var(--color-ink)] pt-6 sm:gap-6"
          >
            <HeroStat value="3×100" label="баллов на ЕГЭ" />
            <HeroStat value={`с ${PRACTICE_SINCE}`} label="готовлю к экзаменам" />
            <HeroStat value="5 500+" label="читают блог в Telegram" />
          </RevealGroup>
        </div>

        {/* ——— Фото ——— */}
        <HeroVisual />
      </Container>
    </section>
  );
}

/**
 * Фон первого экрана: тетрадная клетка и линия полей слева.
 * Поля видны только на широких экранах — на узких линия пересекала бы текст.
 */
function Backdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div className="bg-grid absolute inset-0" />
      <div className="absolute inset-y-0 left-8 hidden w-[2px] bg-[var(--color-accent-dark)] opacity-25 xl:block" />
    </div>
  );
}

function HeroStat({ value, label }: { value: string; label: string }) {
  return (
    <RevealItem>
      <p className="whitespace-nowrap font-display text-[clamp(1.125rem,0.95rem+0.8vw,1.5rem)] font-bold leading-none tracking-[-0.03em] text-[var(--color-ink)]">
        {value}
      </p>
      <p className="mt-2 text-caption text-[var(--color-ink-muted)]">{label}</p>
    </RevealItem>
  );
}

/**
 * Анна на арке. Арка — плоский фиолетовый в клетку с жёсткой тенью,
 * за спиной розовый круг. Факты наклеены стикерами и мягко «парят».
 * Фото прижато к нижнему краю экрана.
 */
function HeroVisual() {
  return (
    <Reveal
      immediate
      delay={0.15}
      variant="scale"
      className="relative mx-auto h-[min(118vw,520px)] w-full max-w-[30rem] sm:h-[600px] lg:h-full lg:min-h-[640px] lg:max-w-none"
    >
      {/* Арка */}
      <div className="bg-brand-gradient absolute bottom-0 left-1/2 h-[80%] w-[82%] max-w-[26rem] -translate-x-1/2 overflow-hidden rounded-t-full border-2 border-b-0 border-[var(--color-ink)] shadow-[6px_0_0_var(--color-ink)]">
        <div className="bg-grid-light absolute inset-0" />
      </div>

      {/* Розовый круг за спиной */}
      <div className="absolute right-[6%] top-[16%] h-20 w-20 rounded-full border-2 border-[var(--color-ink)] bg-[var(--color-accent)] sm:h-28 sm:w-28" />

      {/* Анна */}
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

      {/* Пометка от руки над стикером */}
      <HandNote className="left-[2%] top-[11%] sm:left-0" />

      {/* Стикеры с фактами */}
      <Sticker
        title="100 баллов"
        text={`ЕГЭ в ${HUNDRED_YEARS.join(", ")}`}
        tone="accent"
        className="left-0 top-[30%] rotate-[-5deg] sm:-left-4"
      />
      <Sticker
        title="Диплом ТОГУ"
        text="Русский язык и литература"
        className="right-0 top-[52%] rotate-[3deg] sm:-right-2 [animation-delay:1.2s]"
        slow
        hideOnMobile
      />
      <Sticker
        title="Пробный урок"
        text="бесплатно"
        className="bottom-[9%] left-[2%] rotate-[-2deg] [animation-delay:0.6s]"
      />
    </Reveal>
  );
}

/** «трижды 100!» рукописным шрифтом и стрелка к стикеру — как пометка на полях. */
function HandNote({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`absolute z-10 flex flex-col items-start text-[var(--color-accent-dark)] ${className ?? ""}`}
    >
      <span className="rotate-[-7deg] font-hand text-[1.75rem] font-bold leading-none sm:text-[2rem]">
        трижды 100!
      </span>
      <svg viewBox="0 0 46 64" className="ml-4 mt-1 h-11 w-8 sm:h-14 sm:w-10" fill="none">
        <path d="M30 4 C 10 14, 6 34, 14 56" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
        <path
          d="M6 46 L14 57 L23 48"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function Sticker({
  title,
  text,
  className,
  tone = "white",
  slow = false,
  hideOnMobile = false,
}: {
  title: string;
  text: string;
  className?: string;
  tone?: "white" | "accent";
  slow?: boolean;
  /** true — на телефоне не показывать: три стикера закрывают фото. */
  hideOnMobile?: boolean;
}) {
  return (
    <div
      className={`absolute z-10 ${hideOnMobile ? "hidden sm:flex" : "flex"} flex-col rounded-2xl border-2 border-[var(--color-ink)] px-3.5 py-2.5 shadow-hard sm:px-4 sm:py-3 ${
        tone === "accent" ? "bg-[var(--color-accent)]" : "bg-white"
      } ${slow ? "animate-float-slow" : "animate-float"} ${className ?? ""}`}
    >
      <span className="font-display text-[0.875rem] font-bold leading-tight tracking-[-0.01em] text-[var(--color-ink)] sm:text-[0.9375rem]">
        {title}
      </span>
      <span
        className={`mt-0.5 text-[0.75rem] sm:text-caption ${
          tone === "accent" ? "text-[var(--color-ink)]" : "text-[var(--color-ink-soft)]"
        }`}
      >
        {text}
      </span>
    </div>
  );
}
