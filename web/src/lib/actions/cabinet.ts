"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser, getSessionPayload, hashPassword, verifyPassword } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export type ProfileActionState = { ok: boolean; error?: string; success?: string };

export async function updateProfileAction(
  _prev: ProfileActionState,
  formData: FormData
): Promise<ProfileActionState> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Не авторизован" };

  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();

  if (!name) return { ok: false, error: "Укажите имя" };
  if (!phone && !email) return { ok: false, error: "Укажите телефон или email" };

  if (phone) {
    const clash = await prisma.user.findFirst({ where: { phone, NOT: { id: user.id } } });
    if (clash) return { ok: false, error: "Этот телефон уже используется другим аккаунтом" };
  }
  if (email) {
    const clash = await prisma.user.findFirst({ where: { email, NOT: { id: user.id } } });
    if (clash) return { ok: false, error: "Этот email уже используется другим аккаунтом" };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { name, phone: phone || null, email: email || null },
  });

  revalidatePath("/cabinet/profile");
  return { ok: true, success: "Данные обновлены" };
}

export async function changePasswordAction(
  _prev: ProfileActionState,
  formData: FormData
): Promise<ProfileActionState> {
  const session = await getSessionPayload();
  if (!session) return { ok: false, error: "Не авторизован" };
  const fullUser = await prisma.user.findUnique({ where: { id: session.sub } });
  if (!fullUser) return { ok: false, error: "Не авторизован" };

  const current = String(formData.get("currentPassword") ?? "");
  const next = String(formData.get("newPassword") ?? "");
  const confirm = String(formData.get("newPasswordConfirm") ?? "");

  const valid = await verifyPassword(current, fullUser.passwordHash);
  if (!valid) return { ok: false, error: "Текущий пароль неверен" };
  if (next.length < 6) return { ok: false, error: "Новый пароль должен быть не короче 6 символов" };
  if (next !== confirm) return { ok: false, error: "Пароли не совпадают" };

  await prisma.user.update({
    where: { id: fullUser.id },
    data: { passwordHash: await hashPassword(next) },
  });

  return { ok: true, success: "Пароль изменён" };
}

export async function toggleLessonProgressAction(lessonId: string, completed: boolean) {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHORIZED");

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { module: true },
  });
  if (!lesson) throw new Error("NOT_FOUND");

  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: user.id, courseId: lesson.module.courseId } },
  });
  if (!enrollment) throw new Error("FORBIDDEN");

  await prisma.lessonProgress.upsert({
    where: { userId_lessonId: { userId: user.id, lessonId } },
    update: { completed, completedAt: completed ? new Date() : null },
    create: { userId: user.id, lessonId, completed, completedAt: completed ? new Date() : null },
  });

  revalidatePath(`/cabinet/courses`);
}
