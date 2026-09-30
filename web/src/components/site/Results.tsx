import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Counter from "@/components/ui/Counter";
import Icon from "@/components/ui/Icon";
import ScoreJump from "@/components/site/ScoreJump";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { STUDENT_RESULTS, STUDENT_STORY } from "@/content/site";

/**
 * Результаты учеников: четыре цифры и одна живая история.
 *
 * Цифры — со слов Анны. Где она сказала «около», так и написано:
 * придуманный «средний балл 96» вызывает меньше доверия, чем честное «≈130».
 *
 * Тёмный фон выделяет блок как «момент доказательств» среди светлых секций.
 * Используется на главной и на странице «Обо мне».
 */
export default function Results({ id = "results" }: { id?: string }) {
  if (STUDENT_RESULTS.length === 0) return null;

  return (
    <Section id={id} tone="ink" size="lg" className="overflow-hidden">
      {/* Световое пятно — чтобы тёмный фон не был плоским. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 top-0 h-[28rem] w-[28rem] rounded-full bg-[var(--color-primary)] opacity-30 blur-[120px]"
      />
      <div aria-hidden className="bg-dots-light pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />

      <div className="relative">
        <Reveal>
          <SectionHeading
            onDark
            eyebrow="Результаты учеников"
            title="Цифры без приукрашивания"
            highlight="без приукрашивания"
            description="Где нет точного подсчёта, так и пишу — «около». Придумывать баллы не буду."
          />
        </Reveal>

        <RevealGroup
          stagger={0.1}
          className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-panel bg-white/10 ring-1 ring-white/10 lg:grid-cols-4"
        >
          {STUDENT_RESULTS.map((result) => (
            <RevealItem key={result.label} className="bg-[#140f2b] p-6 sm:p-8">
              <p className="text-[clamp(2.25rem,1.6rem+2.4vw,3.5rem)] font-extrabold leading-none tracking-[-0.04em] text-white">
                {result.value !== null ? (
                  <Counter value={result.value} prefix={result.prefix} suffix={result.suffix} />
                ) : (
                  result.text
                )}
              </p>
              <p className="mt-3 max-w-[14rem] text-[0.9375rem] leading-snug text-white/60">
                {result.label}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>

        {/* История одной ученицы */}
        <Reveal delay={0.1}>
          <article className="mt-6 grid gap-10 rounded-panel bg-white/[0.05] p-7 ring-1 ring-white/10 backdrop-blur-sm sm:p-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
            <div>
              <p className="eyebrow eyebrow-on-dark">История ученицы</p>
              <h3 className="mt-4 text-[clamp(1.75rem,1.3rem+1.8vw,2.75rem)] font-extrabold leading-[1.05] tracking-[-0.035em] text-white">
                С {STUDENT_STORY.before} до {STUDENT_STORY.after} баллов
                <span className="text-[#ffb581]"> за месяц</span>
              </h3>

              <ScoreJump before={STUDENT_STORY.before} after={STUDENT_STORY.after} />

              <div className="mt-6 flex flex-wrap gap-2">
                <Tag icon="clock">{STUDENT_STORY.period}</Tag>
                <Tag icon="refresh">{STUDENT_STORY.rhythm}</Tag>
                {STUDENT_STORY.focus.map((item) => (
                  <Tag key={item}>{item}</Tag>
                ))}
              </div>
            </div>

            <div className="space-y-4 self-center text-lead text-white/75">
              {STUDENT_STORY.text.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </article>
        </Reveal>
      </div>
    </Section>
  );
}

function Tag({
  icon,
  children,
}: {
  icon?: "clock" | "refresh";
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.08] px-3.5 py-1.5 text-caption font-semibold text-white/80 ring-1 ring-white/10">
      {icon && <Icon name={icon} className="h-3.5 w-3.5 text-[#ffb581]" />}
      {children}
    </span>
  );
}
