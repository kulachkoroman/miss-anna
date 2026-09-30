import type { ReactNode } from "react";
import Section from "@/components/ui/Section";
import SplitText from "@/components/ui/SplitText";
import Icon from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Общий вид юридических документов: оферты и политики обработки данных.
 *
 * Задача — читаемость. Сплошной мелкий текст никто не читает, поэтому здесь
 * оглавление со ссылками на разделы, крупный текст и ограниченная ширина строки.
 *
 * Сам текст документов приходит снаружи и не редактируется: его утверждает
 * юрист, а не вёрстка.
 */

export type LegalSection = {
  /** Якорь для ссылки из оглавления. */
  id: string;
  title: string;
  body: ReactNode;
};

export default function LegalPage({
  title,
  notice,
  sections,
}: {
  title: string;
  /** Предупреждение о статусе документа. */
  notice: string;
  sections: LegalSection[];
}) {
  return (
    <Section tone="default" size="md">
      <Reveal>
        <div className="max-w-3xl">
          <p className="eyebrow">Документ</p>
          <SplitText
            as="h1"
            immediate
            text={title}
            className="mt-5 text-balance text-[clamp(1.75rem,1.2rem+2.2vw,2.75rem)] font-extrabold leading-[1.1] tracking-[-0.03em] text-[var(--color-ink)]"
          />

          <div className="mt-8 flex gap-4 rounded-card border-2 border-[var(--color-ink)] bg-[var(--color-accent-soft)] p-5">
            <Icon name="shield" className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-accent-dark)]" />
            <p className="text-[0.9375rem] leading-relaxed text-[var(--color-ink-soft)]">{notice}</p>
          </div>
        </div>
      </Reveal>

      <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] lg:gap-16">
        {/* Оглавление: на десктопе остаётся на экране при прокрутке. */}
        <Reveal className="lg:sticky lg:top-28 lg:self-start">
          <nav aria-label="Содержание документа">
            <p className="text-eyebrow uppercase text-[var(--color-ink-muted)]">Содержание</p>
            <ol className="mt-4 space-y-1">
              {sections.map((section, i) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="flex gap-3 rounded-lg px-3 py-2 text-[0.9375rem] text-[var(--color-ink-soft)] transition-colors duration-200 hover:bg-[var(--color-accent-tint)] hover:text-[var(--color-ink)]"
                  >
                    <span className="text-[var(--color-ink-muted)]">{i + 1}.</span>
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </Reveal>

        <div className="max-w-2xl space-y-12">
          {sections.map((section, i) => (
            <Reveal key={section.id}>
              <section id={section.id} className="scroll-mt-28">
                <h2 className="text-h3 text-[var(--color-ink)]">
                  <span className="text-[var(--color-primary)]">{i + 1}.</span> {section.title}
                </h2>
                <div className="mt-4 space-y-4 leading-relaxed text-[var(--color-ink-soft)]">
                  {section.body}
                </div>
              </section>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
