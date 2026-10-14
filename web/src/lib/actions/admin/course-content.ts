"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

/** Название курса и публикация — всё, что нужно менять у бесплатного курса. */
export async function updateCourseBasicsAction(courseId: string, formData: FormData) {
  await requireAdmin();
  const title = String(formData.get("title") ?? "").trim();
  if (!title) throw new Error("Название курса обязательно");

  const course = await prisma.course.update({
    where: { id: courseId },
    data: { title, published: formData.get("published") === "on" },
  });
  revalidatePath(`/admin/courses/${courseId}`);
  revalidatePath(`/cabinet/courses/${course.slug}`, "layout");
}

/** Текст курса: конспект, ответы, темы пробника или маршрут. */
export async function updateCourseDocAction(docId: string, formData: FormData) {
  await requireAdmin();
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").replace(/\r\n/g, "\n").trim();
  if (!title || !body) throw new Error("Название и текст не могут быть пустыми");

  const doc = await prisma.courseDoc.update({
    where: { id: docId },
    data: { title, body },
    include: { course: { select: { slug: true } } },
  });
  revalidatePath(`/admin/courses/${doc.courseId}`);
  revalidatePath(`/cabinet/courses/${doc.course.slug}`, "layout");
}
