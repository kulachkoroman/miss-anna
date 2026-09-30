import Image from "next/image";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Icon, { type IconName } from "@/components/ui/Icon";
import SplitText from "@/components/ui/SplitText";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { MEDIA } from "@/content/media";
import { HUNDRED_YEARS, PRACTICE_SINCE } from "@/content/site";

/**
 * Первый экран.
 *
 * Слева — заголовок и текст (возвращён исходный вариант), справа — Анна
 * без фона на фирменной арке. Нижний край фото совпадает с нижним краем
 * экрана: срез кадра прячется за бегущей строкой.
 *
 * Типографика — как на лендинге Давида: заголовок выезжает по словам,
 * ключевые слова выделены цветом и маркером.
 *
 * Отрицательный отступ сверху заводит экран под прозрачную шапку.
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
            marker
            className="mt-5 text-balance text-[clamp(2.5rem,1.2rem+4.6vw,4.75rem)] font-extrabold leading-[1.02] tracking-[-0.04em] text-[var(--color-ink)]"
          />

          <Reveal immediate delay={0.35}>
            <p className="mt-7 max-w-[34rem] text-lead text-[var(--color-ink-soft)]">
              Эксперт с 10-летним опытом, трижды сдала ЕГЭ на 100 баллов. Готовлю без стресса —
              на онлайн-курсах и индивидуальных занятиях, объясняю простым языком.
            </p>
          </Reveal>

          <Reveal immediate delay={0.45}>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
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
            className="mt-11 grid max-w-[34rem] grid-cols-3 gap-4 border-t border-[var(--color-border-strong)] pt-6 sm:gap-6"
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

/** Фон первого экрана: сетка точек и два мягких световых пятна. */
function Backdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div className="bg-dots absolute inset-0 [mask-image:radial-gradient(ellipse_80%_70%_at_60%_40%,black_30%,transparent_80%)]" />
      <div className="absolute -right-40 -top-40 h-[42rem] w-[42rem] rounded-full bg-[var(--color-primary)] opacity-[0.12] blur-[120px]" />
      <div className="absolute -left-40 bottom-0 h-[30rem] w-[30rem] rounded-full bg-[var(--color-accent)] opacity-[0.12] blur-[120px]" />
    </div>
  );
}

function HeroStat({ value, label }: { value: string; label: string }) {
  return (
    <RevealItem>
      <p className="whitespace-nowrap text-[clamp(1.25rem,1rem+1vw,1.75rem)] font-extrabold leading-none tracking-[-0.03em] text-[var(--color-ink)]">
        {value}
      </p>
      <p className="mt-2 text-caption text-[var(--color-ink-muted)]">{label}</p>
    </RevealItem>
  );
}

/**
 * Анна на арке. Арка и кольцо — фирменная графика, плашки с фактами
 * мягко «парят». Фото прижато к нижнему краю экрана.
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
      <div className="bg-brand-gradient texture-grain absolute bottom-0 left-1/2 h-[80%] w-[82%] max-w-[26rem] -translate-x-1/2 overflow-hidden rounded-t-full shadow-hero">
        <div className="bg-dots-light absolute inset-0 opacity-60" />
        <div className="absolute -right-16 -top-10 h-64 w-64 rounded-full bg-[var(--color-accent)] opacity-40 blur-3xl" />
        <div className="absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-[#8f7bff] opacity-50 blur-3xl" />
      </div>

      {/* Кольцо за спиной — акцентный цвет */}
      <div className="absolute left-[4%] top-[14%] h-28 w-28 rounded-full border-[3px] border-[var(--color-accent)] opacity-80 sm:h-36 sm:w-36" />

      {/* Анна */}
      <div className="absolute bottom-0 left-1/2 h-[98%] -translate-x-[46%]">
        <Image
          src={MEDIA.heroCutout.src}
          alt={MEDIA.heroCutout.alt}
          width={MEDIA.heroCutout.width}
          height={MEDIA.heroCutout.height}
          preload
          sizes="(max-width: 640px) 70vw, (max-width: 1024px) 45vw, 32vw"
          className="h-full w-auto max-w-none select-none object-contain object-bottom drop-shadow-[0_30px_40px_rgba(31,23,71,0.35)]"
          draggable={false}
        />
      </div>

      {/* Плашки с фактами */}
      <FloatChip
        icon="star"
        title="100 баллов"
        text={`ЕГЭ в ${HUNDRED_YEARS.join(", ")}`}
        className="left-0 top-[30%] sm:-left-4"
        tone="accent"
      />
      <FloatChip
        icon="graduation"
        title="Диплом ТОГУ"
        text="Русский язык и литература"
        className="right-0 top-[50%] sm:-right-2 [animation-delay:1.2s]"
        slow
        hideOnMobile
      />
      <FloatChip
        icon="sparkle"
        title="Пробный урок"
        text="бесплатно"
        className="bottom-[9%] left-[2%] [animation-delay:0.6s]"
        tone="primary"
      />
    </Reveal>
  );
}

function FloatChip({
  icon,
  title,
  text,
  className,
  tone = "primary",
  slow = false,
  hideOnMobile = false,
}: {
  icon: IconName;
  title: string;
  text: string;
  className?: string;
  tone?: "primary" | "accent";
  slow?: boolean;
  /** true — на телефоне не показывать: три плашки закрывают фото. */
  hideOnMobile?: boolean;
}) {
  return (
    <div
      className={`absolute z-10 ${hideOnMobile ? "hidden sm:flex" : "flex"} items-center gap-3 rounded-2xl border border-white/80 bg-white/80 py-2.5 pl-2.5 pr-4 shadow-lift backdrop-blur-xl sm:py-3 sm:pl-3 sm:pr-5 ${
        slow ? "animate-float-slow" : "animate-float"
      } ${className ?? ""}`}
    >
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white sm:h-10 sm:w-10 ${
          tone === "accent" ? "bg-[var(--color-accent)]" : "bg-[var(--color-primary)]"
        }`}
      >
        <Icon name={icon} className="h-5 w-5" />
      </span>
      <span className="leading-tight">
        <span className="block text-[0.875rem] font-bold tracking-[-0.01em] text-[var(--color-ink)] sm:text-[0.9375rem]">
          {title}
        </span>
        <span className="block text-[0.75rem] text-[var(--color-ink-muted)] sm:text-caption">
          {text}
        </span>
      </span>
    </div>
  );
}
