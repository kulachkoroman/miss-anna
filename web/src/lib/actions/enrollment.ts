"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function enrollFreeAction(courseSlug: string) {
  const user = await getCurrentUser();
  if (!user) redirect(`/?auth=1`);

  const course = await prisma.course.findUnique({ where: { slug: courseSlug } });
  if (!course || !course.published) redirect("/");
  if (!course.isFree) redirect("/");

  await prisma.enrollment.upsert({
    where: { userId_courseId: { userId: user.id, courseId: course.id } },
    update: {},
    create: { userId: user.id, courseId: course.id, source: "FREE" },
  });

  revalidatePath("/cabinet");
  redirect(`/cabinet/courses/${courseSlug}`);
}
