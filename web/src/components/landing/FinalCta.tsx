import Section from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import StartCourseButton from "@/components/landing/StartCourseButton";
import { COURSE_START } from "@/content/course";
import type { CourseAccess } from "@/lib/course-access";

/** Последний экран: «С чего начать» и та же кнопка. Тёмный, чтобы закрыть страницу. */
export default function FinalCta({ access }: { access: CourseAccess }) {
  return (
    <Section tone="dark" size="md">
      <div aria-hidden className="bg-grid-light pointer-events-none absolute inset-0" />
      <Reveal className="relative mx-auto max-w-2xl text-center">
        <p className="eyebrow eyebrow-on-dark">Бесплатно · в своём темпе</p>
        <h2 className="mt-4 text-h2 text-white">{COURSE_START.title}</h2>
        <p className="mx-auto mt-5 max-w-[34rem] text-lead text-white/75">{COURSE_START.text}</p>
        <div className="mt-9 flex justify-center">
          <StartCourseButton
            {...access}
            variant="light"
            label={access.isEnrolled ? "Продолжить курс" : COURSE_START.button}
          />
        </div>
      </Reveal>
    </Section>
  );
}
