import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Badge from "@/components/ui/Badge";
import Icon from "@/components/ui/Icon";
import MediaSlot from "@/components/ui/MediaSlot";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import CourseActionButton from "@/components/courses/CourseActionButton";
import CourseProgram from "@/components/courses/CourseProgram";
import LearningFormat from "@/components/courses/LearningFormat";
import { courseCoverSpec } from "@/content/media";
import { formatRub } from "@/lib/format";

export async function generateMetadata(props: PageProps<"/courses/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const course = await prisma.course.findUnique({ where: { slug } });
  if (!course) return {};

  /* Своё описание для превью: когда ссылку на курс кидают в мессенджер,
     подтягивается название курса, а не общее название сайта. */
  return {
    title: course.title,
    description: course.shortDescription,
    openGraph: {
      title: course.title,
      description: course.shortDescription,
      /*
        Картинку приходится указывать явно: свой блок openGraph полностью
        заменяет унаследованный из корневого layout, и вместе с ним пропадает
        картинка превью. Без этой строки ссылка на курс уходит в мессенджер
        без изображения.
      */
      images: ["/opengraph-image"],
    },
  };
}

/**
 * Страница курса.
 *
 * Главная задача — снять вопрос «что конкретно я получу». Поэтому объём курса
 * (модули, уроки, длительность) вынесен наверх, программа раскрывается
 * по модулям, а кнопка покупки остаётся на экране при прокрутке.
 */
export default async function CoursePage(props: PageProps<"/courses/[slug]">) {
  const { slug } = await props.params;

  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: { lessons: { orderBy: { order: "asc" } } },
      },
    },
  });

  if (!course || !course.published) notFound();

  const user = await getCurrentUser();
  const enrollment = user
    ? await prisma.enrollment.findUnique({
        where: { userId_courseId: { userId: user.id, courseId: course.id } },
      })
    : null;

  /* Другие курсы — чтобы со страницы был выход, а не тупик. */
  const otherCourses = await prisma.course.findMany({
    where: { published: true, NOT: { id: course.id } },
    orderBy: { order: "asc" },
    take: 2,
  });

  const included =
    course.whatsIncluded?.split(";").map((s) => s.trim()).filter(Boolean) ?? [];
  const lessonCount = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);

  return (
    <>
      <CourseHero
        course={course}
        moduleCount={course.modules.length}
        lessonCount={lessonCount}
      />

      <Section tone="default" size="md">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] lg:gap-16">
          <div>
            <Reveal>
              <h2 className="text-h2 text-[var(--color-ink)]">О курсе</h2>
              <p className="mt-5 text-lead text-[var(--color-ink-soft)]">{course.description}</p>
            </Reveal>

            {course.forWhom && (
              <Reveal delay={0.1}>
                <div className="mt-10 flex gap-5 rounded-panel border-2 border-[var(--color-ink)] bg-[var(--color-accent-soft)] p-6 sm:p-8">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-[var(--color-ink)] bg-[var(--color-accent)] text-[var(--color-ink)]">
                    <Icon name="target" className="h-6 w-6" />
                  </span>
                  <div>
                    <h3 className="text-h4 text-[var(--color-ink)]">Для кого этот курс</h3>
                    <p className="mt-2 text-[var(--color-ink-soft)]">{course.forWhom}</p>
                  </div>
                </div>
              </Reveal>
            )}

            {included.length > 0 && (
              <div className="mt-12">
                <Reveal>
                  <h2 className="text-h2 text-[var(--color-ink)]">Что входит</h2>
                </Reveal>
                <RevealGroup stagger={0.08} className="mt-6 grid gap-4 sm:grid-cols-2">
                  {included.map((item) => (
                    <RevealItem key={item} className="h-full">
                      <div className="flex h-full items-start gap-3 rounded-card border-2 border-[var(--color-ink)] bg-[var(--color-surface)] p-5">
                        <Icon
                          name="check"
                          className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-primary)]"
                          strokeWidth={2.4}
                        />
                        <span className="text-[0.9375rem] text-[var(--color-ink-soft)]">{item}</span>
                      </div>
                    </RevealItem>
                  ))}
                </RevealGroup>
              </div>
            )}

            <div className="mt-12">
              <Reveal>
                <h2 className="text-h2 text-[var(--color-ink)]">Программа</h2>
                <p className="mt-3 text-[var(--color-ink-soft)]">
                  Нажмите на модуль, чтобы посмотреть уроки.
                </p>
              </Reveal>
              <Reveal delay={0.1} className="mt-6">
                <CourseProgram modules={course.modules} />
              </Reveal>
            </div>
          </div>

          <PurchasePanel
            course={course}
            lessonCount={lessonCount}
            moduleCount={course.modules.length}
            isAuthenticated={Boolean(user)}
            isEnrolled={Boolean(enrollment)}
          />
        </div>
      </Section>

      <Section tone="tint">
        <Reveal>
          <SectionHeading align="center" eyebrow="Формат" title="Как проходит обучение" />
        </Reveal>
        <LearningFormat className="mt-14" />
      </Section>

      <OtherCourses courses={otherCourses} />
    </>
  );
}

type CourseLike = {
  slug: string;
  title: string;
  shortDescription: string;
  coverImage: string | null;
  isFree: boolean;
  priceRub: number;
  duration: string | null;
};

/** Шапка курса: обложка во всю ширину, название и объём. */
function CourseHero({
  course,
  moduleCount,
  lessonCount,
}: {
  course: CourseLike;
  moduleCount: number;
  lessonCount: number;
}) {
  return (
    <section className="relative -mt-[88px] flex min-h-[max(56svh,440px)] flex-col overflow-hidden border-b-2 border-[var(--color-ink)] sm:-mt-[104px]">
      <MediaSlot
        spec={courseCoverSpec(course)}
        preload
        sizes="100vw"
        devHint={false}
        className="absolute inset-0"
      />
      {/* Сильное затемнение нужно только настоящему фото: на фирменной
          заглушке белый текст читается и так, а тёмный слой делает её грязной. */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 bg-gradient-to-t ${
          course.coverImage
            ? "from-black/85 via-black/55 to-black/35"
            : "from-[var(--color-primary-deep)]/70 via-transparent to-transparent"
        }`}
      />

      <Container className="relative flex flex-1 flex-col justify-end pb-12 pt-[120px] sm:pb-16 sm:pt-[140px]">
        <Reveal immediate>
          <Link
            href="/courses"
            className="group inline-flex items-center gap-2 text-caption font-semibold text-white/70 transition-colors hover:text-white"
          >
            <Icon
              name="arrowRight"
              className="h-4 w-4 rotate-180 transition-transform duration-300 group-hover:-translate-x-1"
            />
            Все курсы
          </Link>
        </Reveal>

        <Reveal immediate delay={0.08}>
          <div className="mt-5">
            <Badge tone="accent">{course.isFree ? "Бесплатный курс" : "Платный курс"}</Badge>
          </div>
        </Reveal>

        <Reveal immediate delay={0.14}>
          <h1 className="mt-5 max-w-3xl text-balance text-h1 text-white">{course.title}</h1>
        </Reveal>

        <Reveal immediate delay={0.2}>
          <p className="mt-4 max-w-2xl text-lead text-white/75">{course.shortDescription}</p>
        </Reveal>

        <Reveal immediate delay={0.26}>
          <dl className="mt-8 flex flex-wrap gap-3">
            <HeroStat label="Модулей" value={String(moduleCount)} />
            <HeroStat label="Уроков" value={String(lessonCount)} />
            {course.duration && <HeroStat label="Доступ" value={course.duration} />}
            <HeroStat
              label="Стоимость"
              value={course.isFree ? "Бесплатно" : formatRub(course.priceRub)}
              accent
            />
          </dl>
        </Reveal>
      </Container>
    </section>
  );
}

function HeroStat({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      className={
        accent
          ? "rounded-2xl border-2 border-[var(--color-ink)] bg-[var(--color-accent)] px-5 py-3 text-[var(--color-ink)]"
          : "rounded-2xl border-2 border-white/25 bg-white/10 px-5 py-3 text-white backdrop-blur-sm"
      }
    >
      <dt className="text-eyebrow uppercase opacity-70">{label}</dt>
      <dd className="mt-1 font-bold">{value}</dd>
    </div>
  );
}

/** Панель покупки. Остаётся на экране, пока человек читает программу. */
function PurchasePanel({
  course,
  lessonCount,
  moduleCount,
  isAuthenticated,
  isEnrolled,
}: {
  course: CourseLike;
  lessonCount: number;
  moduleCount: number;
  isAuthenticated: boolean;
  isEnrolled: boolean;
}) {
  return (
    <Reveal from="left" className="lg:sticky lg:top-28 lg:self-start">
      <div className="rounded-panel border-2 border-[var(--color-ink)] bg-[var(--color-surface)] p-7 shadow-hard-lg sm:p-8">
        <p className="font-display text-display leading-none text-[var(--color-ink)] [font-size:clamp(1.875rem,1.5rem+1.2vw,2.5rem)]">
          {course.isFree ? "Бесплатно" : formatRub(course.priceRub)}
        </p>

        {!course.isFree && (
          <p className="mt-2 text-caption text-[var(--color-ink-muted)]">
            Разовая оплата, доступ не ограничен по времени
          </p>
        )}

        <dl className="mt-7 space-y-3 border-t border-[var(--color-border)] pt-6 text-[0.9375rem]">
          <PanelRow label="Модулей" value={String(moduleCount)} />
          <PanelRow label="Уроков" value={String(lessonCount)} />
          {course.duration && <PanelRow label="Доступ" value={course.duration} />}
        </dl>

        <div className="mt-7">
          <CourseActionButton
            courseSlug={course.slug}
            isFree={course.isFree}
            isAuthenticated={isAuthenticated}
            isEnrolled={isEnrolled}
          />
        </div>

        <p className="mt-5 flex items-start gap-2 text-caption text-[var(--color-ink-muted)]">
          <Icon name="lock" className="mt-0.5 h-4 w-4 shrink-0" />
          Видео открываются только в личном кабинете и не скачиваются.
        </p>
      </div>
    </Reveal>
  );
}

function PanelRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-[var(--color-ink-muted)]">{label}</dt>
      <dd className="text-right font-semibold text-[var(--color-ink)]">{value}</dd>
    </div>
  );
}

/** Выход со страницы: другие курсы вместо тупика. */
function OtherCourses({ courses }: { courses: CourseLike[] }) {
  if (courses.length === 0) return null;

  return (
    <Section tone="default">
      <Reveal>
        <SectionHeading eyebrow="Ещё" title="Другие курсы" />
      </Reveal>

      <RevealGroup stagger={0.1} className="mt-12 grid gap-6 sm:grid-cols-2">
        {courses.map((course) => (
          <RevealItem key={course.slug} className="h-full">
            <Link
              href={`/courses/${course.slug}`}
              className="group flex h-full flex-col overflow-hidden rounded-panel border-2 border-[var(--color-ink)] bg-[var(--color-surface)] shadow-hard transition-[translate,box-shadow] duration-150 ease-out hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-hard-lg"
            >
              <MediaSlot
                spec={courseCoverSpec(course)}
                sizes="(max-width: 640px) 100vw, 45vw"
                className="aspect-[16/9] w-full border-b-2 border-[var(--color-ink)]"
                imageClassName="transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-105"
              />
              <div className="flex flex-1 flex-col p-6 sm:p-7">
                <Badge tone={course.isFree ? "accent" : "primary"}>
                  {course.isFree ? "Бесплатно" : formatRub(course.priceRub)}
                </Badge>
                <h3 className="mt-4 text-h4 text-[var(--color-ink)]">{course.title}</h3>
                <p className="mt-2 flex-1 text-caption text-[var(--color-ink-soft)]">
                  {course.shortDescription}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 font-semibold text-[var(--color-primary)]">
                  Подробнее
                  <Icon
                    name="arrowRight"
                    className="h-4 w-4 transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:translate-x-1"
                  />
                </span>
              </div>
            </Link>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
