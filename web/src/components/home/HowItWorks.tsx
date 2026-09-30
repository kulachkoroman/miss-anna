import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Timeline, { type TimelineStep } from "@/components/ui/Timeline";
import { Reveal } from "@/components/ui/Reveal";

const steps: TimelineStep[] = [
  {
    title: "Регистрация",
    description: "Аккаунт ученика или родителя — занимает меньше минуты",
    icon: "user",
  },
  {
    title: "Выбор курса",
    description: "Бесплатный или платный курс в каталоге, с описанием программы",
    icon: "graduation",
  },
  {
    title: "Оплата",
    description: "Прямо на сайте, картой. Чек приходит автоматически",
    icon: "card",
  },
  {
    title: "Доступ в кабинете",
    description: "Видеоуроки и материалы открываются сразу после оплаты",
    icon: "play",
  },
];

/**
 * Путь от регистрации до начала занятий.
 *
 * Шаги соединены линией, которая прорисовывается при прокрутке — читается
 * как последовательность, а не как четыре независимых плитки.
 */
export default function HowItWorks() {
  return (
    <Section tone="default">
      <Reveal>
        <SectionHeading
          align="center"
          eyebrow="Как это работает"
          title="Четыре шага до первого урока"
          description="Никаких заявок, ожидания ответа и переписки — доступ открывается автоматически."
        />
      </Reveal>

      <Timeline steps={steps} className="mt-14" />
    </Section>
  );
}
