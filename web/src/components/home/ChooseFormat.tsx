import type { Course } from "@prisma/client";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { PRICING } from "@/content/site";
import { formatRub } from "@/lib/format";

/**
 * «Курс или занятия» — блок выбора.
 *
 * Курсы и индивидуальные занятия описаны на главной по отдельности, но нигде
 * не сравниваются, и посетитель остаётся с вопросом «а мне что брать».
 * Здесь два формата стоят рядом с честными плюсами каждого.
 *
 * Цены курсов приходят из базы, цены занятий — из src/content/site.ts:
 * в этом блоке нет ни одной вшитой цифры.
 */
export default function ChooseFormat({ courses }: { courses: Course[] }) {
  const hasFree = courses.some((course) => course.isFree);
  const paidPrices = courses.filter((c) => !c.isFree).map((c) => c.priceRub);
  const minPaid = paidPrices.length > 0 ? Math.min(...paidPrices) : null;

  const coursePrice = hasFree
    ? minPaid !== null
      ? `Бесплатно или от ${formatRub(minPaid)}`
      : "Бесплатно"
    : minPaid !== null
      ? `От ${formatRub(minPaid)}`
      : null;

  return (
    <Section tone="tint">
      <Reveal>
        <SectionHeading
          align="center"
          eyebrow="Что выбрать"
          title="Курс или занятия один на один"
          description="Форматы решают разные задачи. Ниже — чем они отличаются на самом деле."
        />
      </Reveal>

      <div className="relative mx-auto mt-14 grid max-w-4xl gap-6 md:grid-cols-2 md:gap-0">
        {/* Разделитель с «или» — виден только на широком экране */}
        <span
          aria-hidden
          className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-[var(--color-border-strong)] md:block"
        />
        <span
          aria-hidden
          className="absolute left-1/2 top-1/2 hidden h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--color-border-strong)] bg-[var(--color-bg-tint)] text-caption font-bold uppercase text-[var(--color-ink-muted)] md:flex"
        >
          или
        </span>

        <Reveal from="right" className="md:pr-12">
          <FormatColumn
            icon="play"
            eyebrow="Онлайн-курс"
            title="Когда удобно учиться самому"
            price={coursePrice}
            points={[
              "Смотреть в своё время, с телефона или компьютера",
              "Доступ к курсу остаётся после экзамена",
              "Видеоуроки, материалы и чек-листы для скачивания",
              "Можно отмечать пройденные уроки и не терять место",
            ]}
            caveat="Нужна самодисциплина: никто не проверит, посмотрел ли урок."
            cta={{ href: "/courses", label: "Смотреть курсы" }}
          />
        </Reveal>

        <Reveal from="left" delay={0.1} className="md:pl-12">
          <FormatColumn
            icon="video"
            eyebrow="Индивидуально"
            title="Когда нужен разбор своих ошибок"
            price={`${formatRub(PRICING.single.priceRub)} за занятие · ${formatRub(PRICING.monthly.priceRub)} в месяц`}
            points={[
              "Программа под уровень и цель конкретного ученика",
              "Разбираем ваши ошибки, а не типовые",
              "Домашние задания с подробной обратной связью",
              "Занятия в Zoom, обычно раз в неделю",
            ]}
            caveat="Нужно подстроиться под расписание и заниматься регулярно."
            cta={{ href: "/classes", label: "Об индивидуальных занятиях" }}
            accent
          />
        </Reveal>
      </div>

      <Reveal delay={0.15}>
        <p className="mx-auto mt-12 max-w-xl text-center text-[0.9375rem] text-[var(--color-ink-soft)]">
          Выбирать одно необязательно: курс закрывает теорию и структуру,
          а занятия — то, что не получается лично у вас.
        </p>
      </Reveal>
    </Section>
  );
}

function FormatColumn({
  icon,
  eyebrow,
  title,
  price,
  points,
  caveat,
  cta,
  accent = false,
}: {
  icon: "play" | "video";
  eyebrow: string;
  title: string;
  price: string | null;
  points: string[];
  /** Честное ограничение формата. Без него сравнение превращается в рекламу. */
  caveat: string;
  cta: { href: string; label: string };
  accent?: boolean;
}) {
  const tint = accent ? "var(--color-accent-dark)" : "var(--color-primary)";

  return (
    <div className="flex h-full flex-col">
      <span
        className="flex h-12 w-12 items-center justify-center rounded-2xl text-white"
        style={{ backgroundColor: tint }}
      >
        <Icon name={icon} className="h-6 w-6" />
      </span>

      <p className="mt-5 text-eyebrow uppercase" style={{ color: tint }}>
        {eyebrow}
      </p>
      <h3 className="mt-2 text-h3 text-[var(--color-ink)]">{title}</h3>

      {price && (
        <p className="mt-3 text-h4 font-bold text-[var(--color-ink)]">{price}</p>
      )}

      <ul className="mt-6 flex-1 space-y-3">
        {points.map((point) => (
          <li key={point} className="flex items-start gap-3 text-[0.9375rem] text-[var(--color-ink-soft)]">
            <span className="mt-1 shrink-0" style={{ color: tint }}>
              <Icon name="check" className="h-4 w-4" strokeWidth={2.4} />
            </span>
            {point}
          </li>
        ))}
      </ul>

      <p className="mt-6 rounded-xl bg-[var(--color-surface-alt)] px-4 py-3 text-caption text-[var(--color-ink-muted)]">
        {caveat}
      </p>

      <div className="mt-6">
        <Button href={cta.href} variant={accent ? "accent" : "primary"}>
          {cta.label}
          <Icon name="arrowRight" className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
