import type { Metadata } from "next";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Badge from "@/components/ui/Badge";
import SplitText from "@/components/ui/SplitText";
import SocialButton from "@/components/site/SocialButton";
import Button from "@/components/ui/Button";
import Icon, { type IconName } from "@/components/ui/Icon";
import MediaSlot from "@/components/ui/MediaSlot";
import PriceCard from "@/components/ui/PriceCard";
import Accordion, { type AccordionItem } from "@/components/ui/Accordion";
import Timeline, { type TimelineStep } from "@/components/ui/Timeline";
import MethodPanels from "@/components/site/MethodPanels";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { MEDIA } from "@/content/media";
import { PRICING, TRIAL, activeMessengers } from "@/content/site";
import { formatRub } from "@/lib/format";

export const metadata: Metadata = {
  title: "Индивидуальные занятия",
  description:
    "Индивидуальная подготовка к ЕГЭ и ОГЭ по русскому языку онлайн через Zoom: программа под уровень ученика, домашние задания и обратная связь. Первый пробный урок бесплатно.",
};

/** Ключевые параметры формата — то, что спрашивают первым делом. */
const essentials: Array<{ icon: IconName; label: string; value: string }> = [
  { icon: "video", label: "Формат", value: "Онлайн, Zoom" },
  { icon: "clock", label: "Занятие", value: "60 минут" },
  { icon: "refresh", label: "Частота", value: "1 раз в неделю" },
  { icon: "sparkle", label: "Первый урок", value: "Бесплатно" },
];

/** Что происходит от первого сообщения до регулярных занятий. */
const steps: TimelineStep[] = [
  {
    title: "Пишете мне",
    description: "Рассказываете, какой класс, какой экзамен и что именно не получается",
    icon: "chat",
  },
  {
    title: "Пробный урок",
    description: "Бесплатно: знакомимся и определяем реальный уровень",
    icon: "video",
  },
  {
    title: "Программа",
    description: "Составляю индивидуальный план на весь период подготовки",
    icon: "document",
  },
  {
    title: "Занятия",
    description: "Раз в неделю, с домашними заданиями и разбором ошибок",
    icon: "refresh",
  },
];

/* Ответы про стоимость собираются из тех же цен, что и карточки тарифов:
   так они не разойдутся, если цена изменится. */
const faq: AccordionItem[] = [
  {
    q: "Какая стоимость занятий?",
    a: `Разовое занятие — ${formatRub(PRICING.single.priceRub)} за ${PRICING.single.duration}. Ежемесячно — ${formatRub(PRICING.monthly.priceRub)} за ${PRICING.monthly.duration}.`,
  },
  {
    q: "Где и как проходят занятия?",
    a: "Онлайн, видеовстречи через Zoom. Материал подбираю под уровень ученика, разбираем задания, проверяю домашние работы с подробной обратной связью.",
  },
  {
    q: "Есть ли бесплатный пробный урок?",
    a: "Да. Перед началом занятий — знакомство, определение уровня и индивидуальная программа на весь период подготовки. Он ни к чему не обязывает.",
  },
  {
    q: "Предусмотрены ли домашние задания?",
    a: "Да, после каждого занятия. К каждой работе даю развёрнутую обратную связь: не просто «неверно», а почему и как надо.",
  },
  {
    q: "Сколько занятий в неделю?",
    a: "Стандартно одно. По договорённости можно увеличить до двух — например, если до экзамена осталось мало времени.",
  },
  {
    q: "Можно ли заниматься в паре или небольшой группой?",
    a: "Нет. Занятия только индивидуальные — один на один с учеником.",
  },
  {
    q: "Может ли родитель оплатить занятия?",
    a: "Да. Написать и договориться о занятиях может и сам ученик, и родитель — оплату обсудим после пробного урока.",
  },
];

/**
 * Страница индивидуальных занятий.
 *
 * Цены берутся из src/content/site.ts и нигде не продублированы: одно и то же
 * число используется в карточках тарифов и в ответе про стоимость.
 *
 * Кнопки мессенджеров появляются только при наличии рабочих ссылок —
 * пока их нет, человек уходит на страницу контактов, а не в пустоту.
 */
export default function ClassesPage() {
  return (
    <>
      <Intro />
      <Tariffs />
      <Trial />
      <HowToStart />
      <Lesson />
      <Questions />
      <Booking />
    </>
  );
}

function Intro() {
  return (
    <Section tone="default" size="md">
      <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-16">
        <div>
          <Reveal immediate>
            <p className="eyebrow">Индивидуальные занятия</p>
          </Reveal>
          <SplitText
            as="h1"
            immediate
            delay={100}
            text="Разбираем то, что не получается именно у вас"
            highlight="именно у вас"
            marker
            className="mt-5 text-balance text-h1 text-[var(--color-ink)]"
          />
          <Reveal immediate delay={0.3}>
            <p className="mt-6 max-w-[36rem] text-lead text-[var(--color-ink-soft)]">
              Курс объясняет тему всем одинаково. На индивидуальных занятиях я смотрю
              конкретные работы ученика, нахожу, где рвётся логика, и закрываю пробелы —
              даже если они тянутся с шестого класса.
            </p>
          </Reveal>

          <RevealGroup stagger={0.08} className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-4">
            {essentials.map((item) => (
              <RevealItem key={item.label}>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
                  <Icon name={item.icon} className="h-5 w-5" />
                </span>
                <p className="mt-3 text-caption text-[var(--color-ink-muted)]">{item.label}</p>
                <p className="mt-0.5 font-bold text-[var(--color-ink)]">{item.value}</p>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal delay={0.15}>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button href="#booking" size="lg">
                Записаться на пробный урок
                <Icon name="arrowRight" className="h-5 w-5" />
              </Button>
              <Button href="#tariffs" variant="outline" size="lg">
                Стоимость
              </Button>
            </div>
          </Reveal>
        </div>

        <Reveal from="left" variant="scale" immediate delay={0.2}>
          <figure className="relative">
            <MediaSlot
              spec={MEDIA.classesScene}
              preload
              sizes="(max-width: 1024px) 100vw, 42vw"
              className="aspect-[4/3] w-full rounded-hero shadow-hero"
            />
            <figcaption className="absolute -bottom-6 left-6 right-6 flex items-center gap-3 rounded-2xl border border-white/80 bg-white/85 px-4 py-3 shadow-lift backdrop-blur-xl sm:left-auto sm:max-w-xs">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary)] text-white">
                <Icon name="document" className="h-5 w-5" />
              </span>
              <span className="text-caption leading-snug text-[var(--color-ink-soft)]">
                <b className="block text-[0.875rem] text-[var(--color-ink)]">Настоящее занятие</b>
                Разбор задания 23 ОГЭ на онлайн-доске
              </span>
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </Section>
  );
}

function Tariffs() {
  return (
    <Section id="tariffs" tone="tint">
      <Reveal>
        <SectionHeading
          align="center"
          eyebrow="Стоимость"
          title="Два варианта: попробовать или заниматься"
          description="Оплата за занятие или за месяц. Никаких пакетов на полгода вперёд."
        />
      </Reveal>

      <RevealGroup stagger={0.12} className="mx-auto mt-14 grid max-w-3xl gap-6 sm:grid-cols-2">
        <RevealItem className="h-full">
          <PriceCard
            title={PRICING.single.title}
            priceRub={PRICING.single.priceRub}
            duration={PRICING.single.duration}
            note={PRICING.single.note}
            features={[
              "Объясняю теорию и даю материал",
              "Разбираем задания и практику",
              "Домашнее задание с проверкой",
              "Обратная связь по ошибкам",
            ]}
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
            features={[
              "Всё, что в разовом занятии",
              "Программа на весь период подготовки",
              "Последовательно закрываем пробелы",
              "По договорённости — до двух занятий в неделю",
            ]}
            className="h-full"
          />
        </RevealItem>
      </RevealGroup>
    </Section>
  );
}

/** Пробный урок — главный аргумент попробовать, поэтому отдельным блоком. */
function Trial() {
  const points = [
    { icon: "chat" as IconName, text: "Знакомимся и разговариваем о целях" },
    { icon: "target" as IconName, text: "Определяю реальный уровень, а не оценку в дневнике" },
    { icon: "document" as IconName, text: "Составляю программу на весь период подготовки" },
  ];

  return (
    <Section tone="default">
      <div className="overflow-hidden rounded-hero bg-[var(--color-accent-soft)] p-8 sm:p-12">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,5fr)] lg:items-center">
          <Reveal>
            <Badge tone="accent">Ни к чему не обязывает</Badge>
            <h2 className="mt-5 text-balance text-h2 text-[var(--color-ink)]">{TRIAL.title}</h2>
            <p className="mt-4 text-[var(--color-ink-soft)]">{TRIAL.text}</p>
          </Reveal>

          <RevealGroup stagger={0.1} className="space-y-4">
            {points.map((point) => (
              <RevealItem key={point.text}>
                <div className="flex items-center gap-4 rounded-card bg-[var(--color-surface)] px-5 py-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-accent)] text-white">
                    <Icon name={point.icon} className="h-5 w-5" />
                  </span>
                  <span className="text-[var(--color-ink-soft)]">{point.text}</span>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </Section>
  );
}

function HowToStart() {
  return (
    <Section tone="tint">
      <Reveal>
        <SectionHeading
          align="center"
          eyebrow="Как начать"
          title="От сообщения до первого занятия"
        />
      </Reveal>

      <Timeline steps={steps} className="mt-14" />
    </Section>
  );
}

function Lesson() {
  return (
    <Section tone="default" size="lg">
      <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-16">
        <Reveal>
          <SectionHeading
            eyebrow="Как проходит занятие"
            title="Урок не заканчивается, когда мы прощаемся"
            highlight="когда мы прощаемся"
            marker
            description="Встречаемся в Zoom, разбираем задания на онлайн-доске. Половина результата появляется между занятиями — в домашней работе и разборе ошибок."
          />
        </Reveal>
        <Reveal from="left" variant="scale">
          <MediaSlot
            spec={MEDIA.aboutPreview}
            sizes="(max-width: 1024px) 100vw, 40vw"
            className="aspect-[4/3] w-full rounded-hero shadow-lift"
          />
        </Reveal>
      </div>

      <MethodPanels className="mt-14" />
    </Section>
  );
}

function Questions() {
  return (
    <Section tone="tint">
      <Reveal>
        <SectionHeading align="center" eyebrow="Вопросы" title="Частые вопросы о занятиях" />
      </Reveal>

      <Reveal delay={0.1} className="mx-auto mt-12 max-w-2xl">
        <Accordion items={faq} />
      </Reveal>
    </Section>
  );
}

/** Запись. Кнопки мессенджеров появляются только при рабочих ссылках. */
function Booking() {
  const messengers = activeMessengers();

  return (
    <Section id="booking" tone="dark" size="lg" className="overflow-hidden">
      <div aria-hidden className="bg-dots-light pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      <div className="relative mx-auto max-w-3xl text-center">
        <Reveal>
          <SectionHeading
            align="center"
            onDark
            eyebrow="Запись"
            title="Начнём с бесплатного урока"
            description="Напишите, в каком классе ученик и к чему готовимся — согласуем удобное время. Оплата обсуждается уже после пробного занятия."
          />
        </Reveal>

        <RevealGroup stagger={0.08} className="mt-10 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
          {messengers.map((m) => (
            <RevealItem key={m.id}>
              <SocialButton
                brand={m.brand}
                href={m.href}
                label={`Написать в ${m.id === "vk" ? "VK" : m.label}`}
                size="lg"
                className="w-full ring-1 ring-white/25"
              />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </Section>
  );
}
