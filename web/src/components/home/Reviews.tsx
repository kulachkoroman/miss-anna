import type { Review } from "@prisma/client";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";

/**
 * Отзывы учеников и родителей.
 *
 * Тексты приходят из базы (админка Анны), поэтому здесь нет ни одного
 * вшитого отзыва. Если опубликованных отзывов нет — блок не показывается.
 *
 * На телефоне карточки листаются вбок, а не стоят длинной колонной:
 * три отзыва подряд на весь экран утомляют раньше, чем их дочитают.
 */
export default function Reviews({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) return null;

  return (
    <Section id="reviews" tone="tint" size="lg">
      <Reveal>
        <SectionHeading
          align="center"
          eyebrow="Отзывы"
          title="Что говорят ученики и родители"
          highlight="ученики и родители"
        />
      </Reveal>

      <RevealGroup
        stagger={0.1}
        className="-mx-4 mt-14 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3"
      >
        {reviews.map((review) => (
          <RevealItem key={review.id} className="w-[85%] shrink-0 snap-center sm:w-auto">
            <figure className="flex h-full flex-col rounded-panel border border-[var(--color-border)] bg-[var(--color-surface)] p-7 shadow-subtle transition-[transform,box-shadow] duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:shadow-lift sm:p-8">
              {/* Кавычка как графический элемент: делает карточку отзыва
                  узнаваемой с первого взгляда. */}
              <span
                aria-hidden
                className="font-serif text-[4rem] leading-[0.5] text-[var(--color-accent)]"
              >
                &laquo;
              </span>

              <blockquote className="mt-5 flex-1 text-[1.0625rem] leading-relaxed text-[var(--color-ink)]">
                {review.text}
              </blockquote>

              <figcaption className="mt-7 flex items-center gap-3 border-t border-[var(--color-border)] pt-5">
                <span className="bg-brand-gradient flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-h4 text-white">
                  {review.studentName.trim().charAt(0).toUpperCase()}
                </span>
                <span className="leading-tight">
                  <span className="block font-bold text-[var(--color-ink)]">
                    {review.studentName}
                  </span>
                  {review.studentGrade && (
                    <span className="mt-1 block text-caption text-[var(--color-ink-muted)]">
                      {review.studentGrade}
                    </span>
                  )}
                </span>
              </figcaption>
            </figure>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
