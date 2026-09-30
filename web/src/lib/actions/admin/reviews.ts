"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createReviewAction(formData: FormData) {
  await requireAdmin();
  const studentName = String(formData.get("studentName") ?? "").trim();
  const text = String(formData.get("text") ?? "").trim();
  if (!studentName || !text) throw new Error("Заполните имя и текст отзыва");

  const count = await prisma.review.count();
  await prisma.review.create({
    data: {
      studentName,
      studentGrade: String(formData.get("studentGrade") ?? "") || null,
      text,
      published: formData.get("published") === "on",
      order: count + 1,
    },
  });
  revalidatePath("/admin/reviews");
  revalidatePath("/");
}

export async function updateReviewAction(reviewId: string, formData: FormData) {
  await requireAdmin();
  await prisma.review.update({
    where: { id: reviewId },
    data: {
      studentName: String(formData.get("studentName") ?? ""),
      studentGrade: String(formData.get("studentGrade") ?? "") || null,
      text: String(formData.get("text") ?? ""),
      published: formData.get("published") === "on",
    },
  });
  revalidatePath("/admin/reviews");
  revalidatePath("/");
}

export async function deleteReviewAction(reviewId: string) {
  await requireAdmin();
  await prisma.review.delete({ where: { id: reviewId } });
  revalidatePath("/admin/reviews");
  revalidatePath("/");
}
