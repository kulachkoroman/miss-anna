import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { FREE_COURSE_SLUG } from "@/content/course";

export type CourseAccess = {
  isAuthenticated: boolean;
  isEnrolled: boolean;
};

/**
 * Что видит посетитель на кнопке «Начать первый урок»: гость — регистрацию,
 * вошедший — запись на курс, записанный — переход в курс.
 * cache — шапка, первый экран и финальный блок спрашивают одно и то же
 * за один запрос страницы, в базу идём один раз.
 */
export const getCourseAccess = cache(async (): Promise<CourseAccess> => {
  const user = await getCurrentUser();
  if (!user) return { isAuthenticated: false, isEnrolled: false };

  const enrollment = await prisma.enrollment.findFirst({
    where: { userId: user.id, course: { slug: FREE_COURSE_SLUG } },
    select: { id: true },
  });
  return { isAuthenticated: true, isEnrolled: Boolean(enrollment) };
});
