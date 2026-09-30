"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function grantCourseAction(userId: string, courseId: string) {
  await requireAdmin();
  await prisma.enrollment.upsert({
    where: { userId_courseId: { userId, courseId } },
    update: {},
    create: { userId, courseId, source: "ADMIN_GRANT" },
  });
  revalidatePath("/admin/students");
}

export async function revokeCourseAction(userId: string, courseId: string) {
  await requireAdmin();
  await prisma.enrollment.delete({
    where: { userId_courseId: { userId, courseId } },
  });
  revalidatePath("/admin/students");
}
