import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

/**
 * Курс для страниц кабинета: проверяет вход и запись на курс,
 * отдаёт уроки по порядку, тексты курса и пройденные уроки.
 * Один запрос на страницу — чтобы курс, урок и текст считали
 * одно и то же одинаково.
 */
export async function getEnrolledCourse(slug: string) {
  const user = await getCurrentUser();
  if (!user) redirect("/?auth=1");

  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: { lessons: { orderBy: { order: "asc" }, include: { materials: true } } },
      },
      docs: { orderBy: { order: "asc" } },
    },
  });
  if (!course) notFound();

  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: user.id, courseId: course.id } },
  });
  /* Админу курс открыт без записи — чтобы проверять, как его видят ученики. */
  if (!enrollment && user.role !== "ADMIN") redirect("/");

  const progressRows = await prisma.lessonProgress.findMany({
    where: { userId: user.id, completed: true, lesson: { module: { courseId: course.id } } },
    select: { lessonId: true },
  });

  return {
    user,
    course,
    lessons: course.modules.flatMap((m) => m.lessons),
    completedIds: new Set(progressRows.map((r) => r.lessonId)),
  };
}

export type EnrolledCourse = Awaited<ReturnType<typeof getEnrolledCourse>>;
