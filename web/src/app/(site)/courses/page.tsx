import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import CoursesCatalog, { type CatalogItem } from "@/components/courses/CoursesCatalog";
import LearningFormat from "@/components/courses/LearningFormat";
import { courseVolume } from "@/lib/format";

export const metadata: Metadata = {
  title: "Курсы",
  description:
    "Онлайн-курсы подготовки к ЕГЭ и ОГЭ по русскому языку: видеоуроки, материалы и доступ, который не сгорает после экзамена.",
};

/**
 * Каталог курсов.
 *
 * Карточки горизонтальные, с наклоном за курсором — тот же приём, что на главной.
 * Клик открывает фрейм с подробностями: состав, программа и объём курса
 * без ухода со страницы. Полная страница курса остаётся, на неё ведёт
 * кнопка из фрейма.
 */
export default async function CoursesPage() {
  const courses = await prisma.course.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
    include: {
      modules: {
        orderBy: { order: "asc" },
        select: { id: true, title: true, _count: { select: { lessons: true } } },
      },
    },
  });

  const items: CatalogItem[] = courses.map((course) => {
    const modules = course.modules.map((module) => ({
      id: module.id,
      title: module.title,
      lessonCount: module._count.lessons,
    }));
    const lessonCount = modules.reduce((sum, module) => sum + module.lessonCount, 0);

    return {
      course,
      meta: courseVolume(modules.length, lessonCount),
      quick: {
        slug: course.slug,
        title: course.title,
        shortDescription: course.shortDescription,
        description: course.description,
        isFree: course.isFree,
        priceRub: course.priceRub,
        duration: course.duration,
        coverImage: course.coverImage,
        whatsIncluded: course.whatsIncluded,
        forWhom: course.forWhom,
        moduleCount: modules.length,
        lessonCount,
        modules,
      },
    };
  });

  return (
    <>
      <Section tone="default" size="md">
        <Reveal>
          <SectionHeading
            as="h1"
            eyebrow="Курсы"
            title="Разбираем то, за что чаще всего теряют баллы"
            highlight="чаще всего теряют баллы"
            marker
            description="Курсы собраны вокруг заданий, которые приносят больше всего баллов и вызывают больше всего сложностей. Нажмите на курс, чтобы посмотреть программу."
          />
        </Reveal>

        {items.length > 0 ? (
          <div className="mt-14">
            <CoursesCatalog items={items} />
          </div>
        ) : (
          <p className="mt-12 text-[var(--color-ink-soft)]">
            Курсы скоро появятся. Пока можно записаться на индивидуальное занятие.
          </p>
        )}
      </Section>

      <Section tone="tint">
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow="Формат"
            title="Как устроено обучение"
            description="Одинаково для бесплатного и платного курса."
          />
        </Reveal>
        <LearningFormat className="mt-14" />
      </Section>

      <Section tone="dark" size="lg">
        <div className="relative mx-auto max-w-2xl text-center">
          <Reveal>
            <SectionHeading
              align="center"
              onDark
              eyebrow="Если курса мало"
              title="Курс объясняет тему. Занятия разбирают ваши ошибки"
              description="Если непонятно, что именно не получается, одного курса может не хватить: нужен человек, который посмотрит конкретно ваши работы."
            />
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-9 flex justify-center">
              <Button href="/classes" variant="accent" size="lg">
                Об индивидуальных занятиях
                <Icon name="arrowRight" className="h-5 w-5" />
              </Button>
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
