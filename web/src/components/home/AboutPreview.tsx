import Link from "next/link";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import MediaSlot from "@/components/ui/MediaSlot";
import Counter from "@/components/ui/Counter";
import Icon from "@/components/ui/Icon";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { MEDIA } from "@/content/media";
import { FACTS, HUNDRED_YEARS } from "@/content/site";

/**
 * Блок «Обо мне» на главной.
 *
 * Асимметричная сетка: живое фото с урока слева, текст справа, цифры внизу.
 * Цифры докручиваются при появлении — взгляд цепляется именно за них.
 */
export default function AboutPreview() {
  return (
    <Section id="about" tone="tint" size="lg">
      <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-20">
        <Reveal from="right" variant="scale">
          <div className="relative">
            <MediaSlot
              spec={MEDIA.aboutPreview}
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="aspect-square w-full rounded-hero shadow-lift"
            />

            {/* Подпись поверх фото: где проходят занятия. */}
            <span className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-black/45 px-3.5 py-1.5 text-caption font-semibold text-white backdrop-blur-md">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#2d8cff]" />
              Занятия проходят в Zoom
            </span>

            {/* Плашка поверх фото: главный факт всегда на виду. */}
            <div className="absolute -bottom-7 -right-3 rounded-card border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-5 shadow-lift sm:-right-7">
              <p className="text-h2 leading-none text-[var(--color-primary)]">
                <Counter value={100} />
              </p>
              <p className="mt-2 max-w-[10rem] text-caption text-[var(--color-ink-soft)]">
                баллов на ЕГЭ — мой результат в {HUNDRED_YEARS.join(", ")}
              </p>
            </div>
          </div>
        </Reveal>

        <div>
          <Reveal from="left">
            <SectionHeading
              eyebrow="Обо мне"
              title="Знаю подготовку к экзаменам с обеих сторон"
              highlight="с обеих сторон"
              marker
              description="Сама сдавала ЕГЭ — трижды и каждый раз на 100. Готовлю к экзаменам с 2015 года: частный центр, онлайн-школа, четыре года в школе и своя практика."
            />
          </Reveal>

          <Reveal from="left" delay={0.1}>
            <p className="mt-6 max-w-[38rem] text-[var(--color-ink-soft)]">
              Из школы ушла, потому что там слишком много сил уходило на бумажную работу вместо
              учеников. Теперь занимаюсь только любимым делом — и каждый день вижу, как растут
              знания и результаты тех, с кем занимаюсь.
            </p>
          </Reveal>

          <RevealGroup
            stagger={0.08}
            className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-[var(--color-border-strong)] pt-8 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4"
          >
            {FACTS.map((fact) => (
              <RevealItem key={fact.label}>
                <p className="text-[clamp(1.5rem,1.2rem+1vw,2rem)] font-extrabold leading-none tracking-[-0.03em] text-[var(--color-ink)]">
                  {fact.value !== null ? (
                    <Counter value={fact.value} prefix={fact.prefix} suffix={fact.suffix} />
                  ) : (
                    fact.text
                  )}
                </p>
                <p className="mt-2 text-caption text-[var(--color-ink-soft)]">{fact.label}</p>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal delay={0.15}>
            <Link
              href="/about"
              className="group mt-10 inline-flex items-center gap-2 font-bold text-[var(--color-primary)]"
            >
              Подробнее обо мне
              <Icon
                name="arrowRight"
                className="h-5 w-5 transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:translate-x-1"
              />
            </Link>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
