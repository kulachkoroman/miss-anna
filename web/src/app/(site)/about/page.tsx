import type { Metadata } from "next";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import SplitText from "@/components/ui/SplitText";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import Counter from "@/components/ui/Counter";
import MediaSlot from "@/components/ui/MediaSlot";
import Quote from "@/components/ui/Quote";
import Timeline from "@/components/ui/Timeline";
import MethodPanels from "@/components/site/MethodPanels";
import Results from "@/components/site/Results";
import DiplomaViewer from "@/components/site/DiplomaViewer";
import SocialButton from "@/components/site/SocialButton";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { MEDIA } from "@/content/media";
import { plural } from "@/lib/format";
import {
  ANNA_QUOTE,
  APPROACH,
  BLOG_NAME,
  DIPLOMA,
  FACTS,
  MESSENGERS,
  MILESTONES,
  PRACTICE_SINCE,
  TOP_MISTAKE,
  WHY_PRIVATE,
} from "@/content/site";

export const metadata: Metadata = {
  title: "Обо мне",
  description:
    "Анна Паршукова — преподаватель русского языка. Трижды сдала ЕГЭ на 100 баллов (2015, 2024, 2025), готовит к экзаменам с 2015 года, диплом ТОГУ по русскому языку и литературе.",
};

/**
 * Страница «Обо мне» — главная страница доверия на сайте.
 *
 * Всё написано от первого лица и опирается на ответы Анны в брифе и её
 * диплом: годы, места работы, история ухода из школы, подход, цитата,
 * результаты учеников. Ничего сверх этого не добавлено.
 */
export default function AboutPage() {
  return (
    <>
      <Intro />
      <Quote quote={ANNA_QUOTE} eyebrow="Как я отношусь к подготовке" />
      <Path />
      <WhyPrivate />
      <Approach />
      <Education />
      <Results />
      <Method />
      <FinalCta />
    </>
  );
}

/** Первый экран: имя, рассказ от первого лица, цифры и портрет. */
function Intro() {
  return (
    <Section tone="default" size="lg" className="overflow-hidden">
      <div aria-hidden className="bg-dots pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_60%_60%_at_80%_20%,black,transparent_75%)]" />

      <div className="relative grid items-start gap-14 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-20">
        <div>
          <Reveal immediate>
            <p className="eyebrow">Обо мне</p>
          </Reveal>
          <SplitText
            as="h1"
            immediate
            delay={100}
            text="Анна Паршукова"
            className="mt-5 text-display text-[var(--color-ink)]"
          />
          <Reveal immediate delay={0.3}>
            <p className="mt-5 text-h4 font-semibold text-[var(--color-primary)]">
              Преподаватель русского языка. Готовлю к ЕГЭ и ОГЭ с {PRACTICE_SINCE} года.
            </p>
          </Reveal>

          <Reveal immediate delay={0.4}>
            <div className="mt-8 max-w-[38rem] space-y-5 text-lead text-[var(--color-ink-soft)]">
              <p>
                Меня зовут Анна. Готовлю к экзаменам по русскому языку с 2015 года — с того самого
                года, когда сама сдала ЕГЭ на 100 баллов. Потом было ещё два раза, в 2024 и 2025,
                и снова по 100.
              </p>
              <p>
                Работала в частном центре подготовки к ОГЭ и ЕГЭ, была куратором в онлайн-школе,
                четыре года преподавала в школе во Владивостоке. В 2026 году получила диплом ТОГУ:
                русский язык и литература, мировая художественная культура.
              </p>
              <p>
                Сейчас занимаюсь только тем, что люблю: индивидуальные занятия, онлайн-курсы и блог
                «{BLOG_NAME}».
              </p>
            </div>
          </Reveal>

          <RevealGroup
            stagger={0.08}
            className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-[var(--color-border-strong)] pt-8 sm:grid-cols-4"
          >
            {FACTS.map((fact) => (
              <RevealItem key={fact.label}>
                <p className="text-[clamp(1.5rem,1.2rem+1vw,2rem)] font-extrabold leading-none tracking-[-0.03em] text-[var(--color-ink)]">
                  {fact.value !== null ? (
                    <Counter value={fact.value} prefix={fact.prefix} suffix={fact.suffix} />
                  ) : (
                    fact.text
                  )}
                </p>
                <p className="mt-2 text-caption text-[var(--color-ink-soft)]">{fact.label}</p>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal delay={0.15}>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button href="/courses" size="lg">
                Выбрать курс
                <Icon name="arrowRight" className="h-5 w-5" />
              </Button>
              <Button href="/classes" variant="outline" size="lg">
                Индивидуальные занятия
                <Icon name="arrowRight" className="h-5 w-5" />
              </Button>
            </div>
          </Reveal>
        </div>

        <Reveal immediate delay={0.2} variant="scale" className="lg:sticky lg:top-28">
          <div className="relative">
            <MediaSlot
              spec={MEDIA.aboutPortrait}
              overlay="bottom"
              preload
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="aspect-[4/5] w-full rounded-hero shadow-hero"
            >
              <div className="flex h-full flex-col justify-end p-7 sm:p-8">
                <p className="text-h3 text-white">Анна Паршукова</p>
                <p className="mt-1 text-caption text-white/75">
                  Эксперт по ЕГЭ и ОГЭ по русскому языку
                </p>
              </div>
            </MediaSlot>

            {/* Наклейка «100» — как оценка красной ручкой на полях. */}
            <div className="absolute -right-3 -top-5 flex h-24 w-24 rotate-[10deg] flex-col items-center justify-center rounded-full border-[3px] border-[#e5372f] bg-[var(--color-bg)] text-[#e5372f] shadow-lift sm:-right-6 sm:h-28 sm:w-28">
              <span className="font-serif text-4xl font-bold italic leading-none sm:text-5xl">100</span>
              <span className="mt-1 text-[0.625rem] font-bold uppercase tracking-[0.14em]">×3 ЕГЭ</span>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/** Путь по годам. */
function Path() {
  /* Считаем от года первых 100 баллов, чтобы заголовок не устарел через год. */
  const years = new Date().getFullYear() - PRACTICE_SINCE;

  return (
    <Section tone="tint" size="lg">
      <div className="grid gap-14 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-20">
        <Reveal className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeading
            eyebrow="Путь"
            title={`${years} ${plural(years, ["год", "года", "лет"])} с экзаменом`}
            highlight="с экзаменом"
            marker
            description="С первых 100 баллов в 2015 году до собственной практики. Каждая строчка — с годом."
          />
        </Reveal>

        <Timeline steps={MILESTONES} variant="vertical" />
      </div>
    </Section>
  );
}

/** Почему ушла из школы — история её словами. */
function WhyPrivate() {
  return (
    <Section tone="default" size="lg">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-20">
        <Reveal>
          <SectionHeading
            eyebrow="Честно"
            title="Почему я ушла из школы"
            highlight="ушла из школы"
          />
        </Reveal>

        <Reveal delay={0.1}>
          <div className="relative rounded-panel border border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-card sm:p-10">
            <span
              aria-hidden
              className="absolute -top-6 left-8 font-serif text-[5.5rem] leading-none text-[var(--color-accent)]"
            >
              &ldquo;
            </span>
            <div className="space-y-5 text-lead text-[var(--color-ink-soft)]">
              {WHY_PRIVATE.map((paragraph, i) => (
                <p key={paragraph} className={i === WHY_PRIVATE.length - 1 ? "font-semibold text-[var(--color-ink)]" : undefined}>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/** Подход: чего не будет и что вместо этого. */
function Approach() {
  return (
    <Section tone="tint" size="lg">
      <Reveal>
        <SectionHeading
          align="center"
          eyebrow="Подход"
          title="Без запугивания и зубрёжки шаблонов"
          highlight="зубрёжки шаблонов"
          description="Меня раздражает, когда детей пугают экзаменом, дают неверную информацию о его структуре и заставляют учить шаблонные фразы для сочинения. У меня так не будет."
        />
      </Reveal>

      <div className="mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-2">
        <Reveal from="right">
          <div className="h-full rounded-panel border border-[var(--color-border)] bg-[var(--color-surface)] p-7 sm:p-9">
            <p className="eyebrow text-[var(--color-ink-muted)]">Чего на занятиях не будет</p>
            <ul className="mt-6 space-y-4">
              {APPROACH.not.map((item) => (
                <li key={item} className="flex items-start gap-3.5 text-[var(--color-ink-soft)]">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#fdecec] text-[#d94141]">
                    <Icon name="plus" className="h-3.5 w-3.5 rotate-45" strokeWidth={2.6} />
                  </span>
                  <span className="decoration-[#d94141]/40 decoration-2">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal from="left" delay={0.1}>
          <div className="bg-brand-gradient texture-grain h-full overflow-hidden rounded-panel p-7 text-white shadow-hero sm:p-9">
            <p className="eyebrow eyebrow-on-dark">Что вместо этого</p>
            <ul className="relative mt-6 space-y-4">
              {APPROACH.instead.map((item) => (
                <li key={item} className="flex items-start gap-3.5 text-white/85">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/15 text-[#ffb581]">
                    <Icon name="check" className="h-3.5 w-3.5" strokeWidth={2.8} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>

      {/* Самая частая ошибка — прямым текстом. */}
      <Reveal delay={0.1}>
        <div className="mx-auto mt-6 flex max-w-5xl flex-col gap-4 rounded-panel border border-[var(--color-accent)]/25 bg-[var(--color-accent-tint)] p-7 sm:flex-row sm:items-center sm:gap-6 sm:p-8">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-accent)] text-white">
            <Icon name="target" className="h-6 w-6" />
          </span>
          <p className="text-lead text-[var(--color-ink-soft)]">
            <span className="font-bold text-[var(--color-ink)]">
              Самая частая ошибка, из-за которой теряют баллы в сочинении:
            </span>{" "}
            {TOP_MISTAKE.charAt(0).toLowerCase() + TOP_MISTAKE.slice(1)}. Поэтому на занятиях
            мы много работаем с текстом.
          </p>
        </div>
      </Reveal>
    </Section>
  );
}

/** Образование и диплом. */
function Education() {
  return (
    <Section tone="default" size="lg">
      <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-20">
        <div>
          <Reveal>
            <SectionHeading
              eyebrow="Образование"
              title="Диплом по русскому языку и литературе"
              highlight="русскому языку и литературе"
            />
          </Reveal>

          <Reveal delay={0.1}>
            <dl className="mt-10 divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
              <EduRow term="Вуз" value={DIPLOMA.university} />
              <EduRow term="Квалификация" value={DIPLOMA.degree} />
              <EduRow term="Профили" value={DIPLOMA.profile} />
              <EduRow term="Год" value={String(DIPLOMA.year)} />
            </dl>
          </Reveal>

          <Reveal delay={0.15}>
            <p className="mt-6 flex items-start gap-2 text-caption text-[var(--color-ink-muted)]">
              <Icon name="shield" className="mt-0.5 h-4 w-4 shrink-0" />
              Нажмите на диплом, чтобы посмотреть. Номера бланка скрыты.
            </p>
          </Reveal>
        </div>

        <Reveal from="left" variant="scale">
          <div className="rounded-hero bg-[var(--color-bg-tint)] p-6 sm:p-10">
            <DiplomaViewer pages={DIPLOMA.pages} />
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

function EduRow({ term, value }: { term: string; value: string }) {
  return (
    <div className="grid gap-1 py-4 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-6">
      <dt className="text-caption font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-muted)]">
        {term}
      </dt>
      <dd className="font-semibold text-[var(--color-ink)]">{value}</dd>
    </div>
  );
}

/** Что происходит на занятии и после него. */
function Method() {
  return (
    <Section tone="tint" size="lg">
      <Reveal>
        <SectionHeading
          eyebrow="Как я работаю"
          title="Занятие не заканчивается, когда мы прощаемся"
          highlight="когда мы прощаемся"
          description="Половина результата появляется между уроками — в домашней работе и разборе ошибок."
        />
      </Reveal>

      <MethodPanels className="mt-14" />
    </Section>
  );
}

function FinalCta() {
  return (
    <Section tone="dark" size="lg" className="overflow-hidden">
      <div aria-hidden className="bg-dots-light pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      <div className="relative mx-auto max-w-2xl text-center">
        <Reveal>
          <SectionHeading
            align="center"
            onDark
            eyebrow="С чего начать"
            title="Начните с бесплатного"
            highlight="бесплатного"
            description="Есть бесплатный курс по итоговому сочинению и бесплатный пробный урок. Оба ни к чему не обязывают — посмотрите, подходит ли вам, как я объясняю."
          />
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <SocialButton
              brand="telegram"
              href={MESSENGERS[0].href}
              label="Записаться на пробный урок"
              size="lg"
              className="ring-1 ring-white/25"
            />
            <Button href="/courses" variant="light" size="lg">
              Смотреть курсы
              <Icon name="arrowRight" className="h-5 w-5" />
            </Button>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
