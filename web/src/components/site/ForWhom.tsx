import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Icon from "@/components/ui/Icon";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";

/**
 * «Кому подойдёт» — блок, в котором посетитель должен узнать себя.
 *
 * Крупный номер класса работает как ориентир: человек находит свою строку
 * за секунду, не читая текст целиком.
 */

const groups = [
  {
    grade: "9",
    title: "ОГЭ по русскому",
    text:
      "Разбираем задания экзамена и закрываем пробелы, которые копились с середины школы. " +
      "Задача — сдать спокойно и без пересдачи.",
    points: ["Изложение и сочинение", "Устное собеседование", "Разбор заданий части 2"],
  },
  {
    grade: "10",
    title: "Год форы",
    text:
      "Самое удобное время для старта: программу ЕГЭ можно разобрать без спешки, " +
      "и в 11 классе останется практика, а не изучение теории с нуля.",
    points: ["Теория без аврала", "Свой темп", "К 11 классу — только практика"],
  },
  {
    grade: "11",
    title: "ЕГЭ и итоговое сочинение",
    text:
      "Сначала допуск — итоговое сочинение с первой попытки. Затем задание 27: " +
      "оно даёт больше всего баллов и отнимает больше всего нервов.",
    points: ["Допуск к ЕГЭ", "Сочинение по критериям", "Разбор своих работ"],
  },
];

export default function ForWhom() {
  return (
    <Section id="for-whom" tone="default">
      <Reveal>
        <SectionHeading
          eyebrow="Кому подойдёт"
          title="Найдите свой класс"
          description="Подготовка в 9, 10 и 11 классе устроена по-разному — задачи и сроки не совпадают."
        />
      </Reveal>

      <RevealGroup stagger={0.12} className="mt-14 grid gap-6 md:grid-cols-3">
        {groups.map((group) => (
          <RevealItem key={group.grade} className="h-full">
            <article className="group relative flex h-full flex-col overflow-hidden rounded-panel border border-[var(--color-border)] bg-[var(--color-surface)] p-7 transition-[transform,box-shadow,border-color] duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-1.5 hover:border-[var(--color-primary)]/30 hover:shadow-lift sm:p-8">
              {/* Крупная цифра-ориентир на фоне карточки. */}
              <span
                aria-hidden
                className="pointer-events-none absolute -right-2 -top-6 select-none text-[7rem] font-extrabold leading-none text-[var(--color-primary)]/[0.07] transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-110"
              >
                {group.grade}
              </span>

              <p className="relative text-eyebrow uppercase text-[var(--color-primary)]">
                {group.grade} класс
              </p>
              <h3 className="relative mt-3 text-h3 text-[var(--color-ink)]">{group.title}</h3>
              <p className="relative mt-3 flex-1 text-[0.9375rem] leading-relaxed text-[var(--color-ink-soft)]">
                {group.text}
              </p>

              <ul className="relative mt-6 space-y-2 border-t border-[var(--color-border)] pt-5">
                {group.points.map((point) => (
                  <li key={point} className="flex items-start gap-2.5 text-caption text-[var(--color-ink-soft)]">
                    <Icon
                      name="check"
                      className="mt-px h-4 w-4 text-[var(--color-accent)]"
                      strokeWidth={2.4}
                    />
                    {point}
                  </li>
                ))}
              </ul>
            </article>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
