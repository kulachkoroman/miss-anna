import Image from "next/image";
import clsx from "clsx";
import Section from "@/components/ui/Section";
import SocialButton from "@/components/site/SocialButton";
import { Reveal } from "@/components/ui/Reveal";
import { MEDIA } from "@/content/media";
import { BLOG_LINKS, HUNDRED_YEARS, MESSENGERS, PRACTICE_SINCE } from "@/content/site";

/**
 * «Кто ведёт курс» — коротко, как просила Анна: фото, две строки,
 * три факта и куда написать. Без записи на занятия: мест нет.
 * Факты — из её ответов на бриф (content/site.ts).
 */
const facts = [
  { value: "3×100", label: `баллов на ЕГЭ: ${HUNDRED_YEARS.join(", ")}` },
  { value: `с ${PRACTICE_SINCE}`, label: "готовит к экзаменам" },
  { value: "100%", label: "её учеников сдали итоговое сочинение с первой попытки" },
];

export default function AboutAnna({
  tone = "tint",
  compact = false,
}: {
  tone?: "default" | "tint";
  /** true — без фото, одной строкой: для самого короткого варианта. */
  compact?: boolean;
}) {
  return (
    <Section id="anna" tone={tone} size={compact ? "sm" : "md"}>
      <Reveal>
        <div
          className={clsx(
            "grid gap-8 rounded-panel border-2 border-[var(--color-ink)] bg-white p-6 shadow-hard sm:p-8 lg:p-10",
            !compact && "md:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] md:items-center lg:gap-12"
          )}
        >
          {!compact && (
            <div className="relative mx-auto w-full max-w-[20rem]">
              <div className="relative aspect-[4/5] overflow-hidden rounded-card border-2 border-[var(--color-ink)]">
                <Image
                  src={MEDIA.aboutPortrait.src}
                  alt={MEDIA.aboutPortrait.alt}
                  fill
                  sizes="(max-width: 768px) 80vw, 320px"
                  className="object-cover object-top"
                />
              </div>
              <span className="absolute -right-3 -top-3 rotate-[4deg] rounded-2xl border-2 border-[var(--color-ink)] bg-[var(--color-accent)] px-3.5 py-2 font-display text-[0.875rem] font-bold text-[var(--color-ink)] shadow-hard-sm">
                трижды 100
              </span>
            </div>
          )}

          <div>
            <p className="eyebrow">Кто ведёт курс</p>
            <h2 className="mt-4 text-h2 text-[var(--color-ink)]">Анна Паршукова</h2>
            <p className="mt-4 max-w-[36rem] text-lead text-[var(--color-ink-soft)]">
              Преподаватель русского языка и литературы, автор блога «Русичка Анна Евгеньевна».
              Готовит к экзаменам с {PRACTICE_SINCE} года.
            </p>

            <dl className="mt-7 grid gap-3 sm:grid-cols-3">
              {facts.map((f) => (
                <div key={f.value} className="rounded-2xl bg-[var(--color-surface-alt)] px-4 py-3.5">
                  <dt className="font-display text-[1.25rem] font-bold leading-none tracking-[-0.03em] text-[var(--color-ink)]">
                    {f.value}
                  </dt>
                  <dd className="mt-1.5 text-caption text-[var(--color-ink-muted)]">{f.label}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-7 border-t-2 border-dashed border-[var(--color-border-strong)] pt-6">
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
                Вопросы о курсе и блог
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {MESSENGERS.slice(0, 1).map((m) => (
                  <SocialButton key={m.href} brand={m.brand} href={m.href} label="Написать" size="md" />
                ))}
                {BLOG_LINKS.map((l) => (
                  <SocialButton key={l.href} brand={l.brand} href={l.href} label={l.label} handle={l.handle} variant="chip" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
