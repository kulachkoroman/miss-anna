"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

/** Заявка на платный курс: «обработана» (Анна ответила) или обратно в новые. */
export async function setRequestStatusAction(requestId: string, status: "NEW" | "DONE") {
  await requireAdmin();
  await prisma.paidCourseRequest.update({ where: { id: requestId }, data: { status } });
  revalidatePath("/admin", "layout");
}
