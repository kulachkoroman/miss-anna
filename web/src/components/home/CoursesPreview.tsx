import Link from "next/link";
import type { Course } from "@prisma/client";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Icon from "@/components/ui/Icon";
import CourseCard from "@/components/courses/CourseCard";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";

export default function CoursesPreview({ courses }: { courses: Course[] }) {
  if (courses.length === 0) return null;

  return (
    <Section id="courses" tone="tint">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <Reveal>
          <SectionHeading
            eyebrow="Курсы"
            title="Онлайн-курсы: смотреть можно когда удобно"
            description="Видеоуроки и материалы открываются в личном кабинете и остаются с вами — можно вернуться к теме столько раз, сколько нужно."
          />
        </Reveal>

        <Reveal delay={0.1}>
          <Link
            href="/courses"
            className="group hidden items-center gap-2 font-semibold text-[var(--color-primary)] sm:inline-flex"
          >
            Все курсы
            <Icon
              name="arrowRight"
              className="h-5 w-5 transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:translate-x-1"
            />
          </Link>
        </Reveal>
      </div>

      <RevealGroup stagger={0.12} className="mt-12 grid gap-6 sm:grid-cols-2">
        {courses.map((course) => (
          <RevealItem key={course.id}>
            <CourseCard course={course} />
          </RevealItem>
        ))}
      </RevealGroup>

      <Reveal delay={0.1}>
        <Link
          href="/courses"
          className="group mt-8 inline-flex items-center gap-2 font-semibold text-[var(--color-primary)] sm:hidden"
        >
          Все курсы
          <Icon name="arrowRight" className="h-5 w-5" />
        </Link>
      </Reveal>
    </Section>
  );
}
