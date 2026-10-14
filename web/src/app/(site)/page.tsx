import HeroPlayer from "@/components/landing/HeroPlayer";
import CourseProblem from "@/components/landing/CourseProblem";
import CourseRoute from "@/components/landing/CourseRoute";
import CourseHow from "@/components/landing/CourseHow";
import AboutAnna from "@/components/landing/AboutAnna";
import CourseFAQ from "@/components/landing/CourseFAQ";
import FinalCta from "@/components/landing/FinalCta";
import StickyCta from "@/components/landing/StickyCta";
import { COURSE_HERO } from "@/content/course";
import { getCourseAccess } from "@/lib/course-access";

/**
 * Главная — лендинг бесплатного курса по итоговому сочинению.
 *
 * Одна цель: начать первый урок. Порядок: большой «плеер» урока 1 →
 * «если трудно понять, что писать» → маршрут из шести уроков → как устроено обучение → коротко об Анне
 * с контактами → вопросы → «С чего начать». Записи на занятия нет:
 * мест у Анны нет (её просьба, октябрь 2026).
 */
export default async function HomePage() {
  const access = await getCourseAccess();

  return (
    <>
      <HeroPlayer access={access} />
      <CourseProblem />
      <CourseRoute />
      <CourseHow />
      <AboutAnna />
      <CourseFAQ />
      <FinalCta access={access} />
      <StickyCta access={access} label={access.isEnrolled ? "Продолжить курс" : COURSE_HERO.button} />
    </>
  );
}
