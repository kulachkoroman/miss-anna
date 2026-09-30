import type { Metadata } from "next";
import Link from "next/link";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import SplitText from "@/components/ui/SplitText";
import Button from "@/components/ui/Button";
import Icon, { type IconName } from "@/components/ui/Icon";
import { BlogCard, MessengerCard } from "@/components/site/AppCards";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { BLOG_LINKS, BLOG_NAME, MESSENGERS } from "@/content/site";

export const metadata: Metadata = {
  title: "Контакты",
  description:
    "Как связаться с Анной Паршуковой: Telegram, ВКонтакте и Max. Блог «Русичка Анна Евгеньевна» в Telegram, YouTube и TikTok.",
};

/** О чём пишут чаще всего — снимает ступор «а что вообще писать». */
const topics: Array<{ icon: IconName; title: string; text: string }> = [
  {
    icon: "graduation",
    title: "Какой формат выбрать",
    text: "Не уверены, курс вам нужен или занятия один на один — опишите ситуацию, подскажу.",
  },
  {
    icon: "video",
    title: "Записаться на занятия",
    text: "Согласуем время и проведём бесплатный пробный урок.",
  },
  {
    icon: "card",
    title: "Вопросы по оплате",
    text: "Как оплатить, что делать, если платёж не прошёл, нужен ли чек.",
  },
  {
    icon: "lock",
    title: "Не открывается кабинет",
    text: "Забыли пароль, не приходит доступ к курсу, не запускается видео.",
  },
];

/** Быстрые ответы: часть вопросов уже разобрана на сайте. */
const shortcuts = [
  { href: "/classes#tariffs", label: "Стоимость занятий", icon: "card" as IconName },
  { href: "/courses", label: "Что входит в курсы", icon: "graduation" as IconName },
  { href: "/classes", label: "Как проходят занятия", icon: "video" as IconName },
];

/**
 * Страница контактов.
 *
 * Мессенджеры и соцсети оформлены в стиле своих приложений (см. AppCards):
 * человек узнаёт Telegram или VK по цвету ещё до того, как прочитает подпись.
 */
export default function ContactsPage() {
  const [telegram, ...others] = MESSENGERS;

  return (
    <>
      <Section tone="default" size="lg" className="overflow-hidden">
        <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_60%_55%_at_20%_10%,black,transparent_75%)]" />

        <div className="relative grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <div className="lg:pt-6">
            <Reveal immediate>
              <p className="eyebrow">Контакты</p>
            </Reveal>
            <SplitText
              as="h1"
              immediate
              delay={100}
              text="Напишите — отвечу и подскажу"
              highlight="отвечу и подскажу"
              marker
              className="mt-5 text-balance text-h1 text-[var(--color-ink)]"
            />
            <Reveal immediate delay={0.3}>
              <p className="mt-6 max-w-md text-lead text-[var(--color-ink-soft)]">
                Отвечаю обычно в течение дня, в будни быстрее. Всё общение и занятия проходят
                онлайн, поэтому город значения не имеет.
              </p>
            </Reveal>

            <Reveal immediate delay={0.4}>
              <dl className="mt-10 space-y-5">
                <FactRow icon="clock" term="Скорость ответа" description="Обычно в течение дня" />
                <FactRow icon="video" term="Формат" description="Онлайн, из любого города" />
                <FactRow icon="sparkle" term="Первый шаг" description="Бесплатный пробный урок" />
              </dl>
            </Reveal>
          </div>

          <RevealGroup immediate delayChildren={0.2} stagger={0.1} className="grid gap-5 sm:grid-cols-2">
            <RevealItem className="sm:row-span-2">
              <MessengerCard messenger={telegram} featured />
            </RevealItem>
            {others.map((messenger) => (
              <RevealItem key={messenger.id}>
                <MessengerCard messenger={messenger} />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Section>

      <Section tone="tint" size="lg">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal>
            <SectionHeading
              eyebrow="Блог"
              title={`«${BLOG_NAME}»`}
              description="Подписаться можно, даже если заниматься пока не планируете: в блоге — о русском языке и подготовке к экзаменам."
            />
          </Reveal>
        </div>

        <RevealGroup stagger={0.1} className="mt-12 grid gap-5 md:grid-cols-3">
          {BLOG_LINKS.map((link) => (
            <RevealItem key={link.href} className="h-full">
              <BlogCard link={link} />
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      <Section tone="default" size="lg">
        <Reveal>
          <SectionHeading
            eyebrow="О чём написать"
            title="С любым из этих вопросов — можно"
            highlight="можно"
            description="Не нужно формулировать красиво. Напишите как есть, разберёмся."
          />
        </Reveal>

        <RevealGroup stagger={0.08} className="mt-12 grid gap-5 sm:grid-cols-2">
          {topics.map((topic) => (
            <RevealItem key={topic.title} className="h-full">
              <div className="flex h-full gap-5 rounded-panel border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-[transform,box-shadow] duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:shadow-lift sm:p-7">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
                  <Icon name={topic.icon} className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-h4 text-[var(--color-ink)]">{topic.title}</h3>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-[var(--color-ink-soft)]">
                    {topic.text}
                  </p>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal delay={0.1}>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <span className="text-caption text-[var(--color-ink-muted)]">
              Часть вопросов уже разобрана:
            </span>
            {shortcuts.map((shortcut) => (
              <Link
                key={shortcut.href}
                href={shortcut.href}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] bg-white/60 px-4 py-2 text-caption font-semibold text-[var(--color-ink-soft)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
              >
                <Icon name={shortcut.icon} className="h-4 w-4" />
                {shortcut.label}
              </Link>
            ))}
          </div>
        </Reveal>
      </Section>

      <Section tone="dark" size="lg" className="overflow-hidden">
        <div aria-hidden className="bg-grid-light pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
        <div className="relative mx-auto max-w-2xl text-center">
          <Reveal>
            <SectionHeading
              align="center"
              onDark
              eyebrow="Можно и без переписки"
              title="Посмотрите бесплатный курс"
              highlight="бесплатный курс"
              description="Если писать пока не хочется — начните с бесплатного курса по итоговому сочинению. Регистрация занимает минуту."
            />
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-10 flex justify-center">
              <Button href="/courses" variant="light" size="lg">
                Смотреть курсы
                <Icon name="arrowRight" className="h-5 w-5" />
              </Button>
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}

function FactRow({
  icon,
  term,
  description,
}: {
  icon: IconName;
  term: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
        <Icon name={icon} className="h-5 w-5" />
      </span>
      <div className="leading-tight">
        <dt className="text-caption text-[var(--color-ink-muted)]">{term}</dt>
        <dd className="mt-1 font-bold text-[var(--color-ink)]">{description}</dd>
      </div>
    </div>
  );
}
