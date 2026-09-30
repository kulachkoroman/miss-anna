import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import PriceCard from "@/components/ui/PriceCard";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { PRICING, TRIAL } from "@/content/site";

/**
 * Индивидуальные занятия на главной.
 *
 * Цены берутся из src/content/site.ts — в вёрстке их больше нет,
 * поэтому поменять стоимость можно в одном месте.
 */
export default function ClassesPreview() {
  return (
    <Section id="classes" tone="surface" size="lg">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:items-center lg:gap-14">
        <div>
          <Reveal>
            <SectionHeading
              eyebrow="Индивидуально"
              title="Занятия один на один через Zoom"
              description="Когда нужен не общий курс, а разбор именно твоих ошибок: программа под уровень ученика, домашние задания и обратная связь по каждому."
            />
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-8 flex items-start gap-4 rounded-card bg-[var(--color-accent-soft)] p-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)] text-[var(--color-ink)]">
                <Icon name="sparkle" className="h-5 w-5" />
              </span>
              <div>
                <p className="text-h4 text-[var(--color-ink)]">{TRIAL.title}</p>
                <p className="mt-1 text-[0.9375rem] text-[var(--color-ink-soft)]">{TRIAL.text}</p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-8">
              <Button href="/classes" variant="accent" size="lg">
                Подробнее о занятиях
                <Icon name="arrowRight" className="h-5 w-5" />
              </Button>
            </div>
          </Reveal>
        </div>

        <RevealGroup stagger={0.1} className="grid gap-5 sm:grid-cols-2">
          <RevealItem className="h-full">
            <PriceCard
              title={PRICING.single.title}
              priceRub={PRICING.single.priceRub}
              duration={PRICING.single.duration}
              note={PRICING.single.note}
              className="h-full"
            />
          </RevealItem>
          <RevealItem className="h-full">
            <PriceCard
              title={PRICING.monthly.title}
              priceRub={PRICING.monthly.priceRub}
              duration={PRICING.monthly.duration}
              note={PRICING.monthly.note}
              badge="Основной формат"
              highlight
              className="h-full"
            />
          </RevealItem>
        </RevealGroup>
      </div>
    </Section>
  );
}
