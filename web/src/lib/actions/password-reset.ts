"use server";

import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import crypto from "node:crypto";

export type ResetRequestState = { ok: boolean; error?: string; devLink?: string };
export type ResetConfirmState = { ok: boolean; error?: string };

export async function requestPasswordResetAction(
  _prev: ResetRequestState,
  formData: FormData
): Promise<ResetRequestState> {
  const login = String(formData.get("login") ?? "").trim();
  if (!login) return { ok: false, error: "Укажите телефон или email" };

  const user = await prisma.user.findFirst({
    where: { OR: [{ email: login }, { phone: login }] },
  });

  // Always report success even if the user doesn't exist, to avoid leaking which contacts are registered.
  if (!user) return { ok: true };

  const token = crypto.randomBytes(24).toString("hex");
  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      token,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60), // 1 hour
    },
  });

  const link = `${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/reset-password/confirm?token=${token}`;

  // NOTE: no email/SMS provider is configured yet — in production this link must be sent
  // to the user's phone/email instead of being shown on screen.
  return { ok: true, devLink: link };
}

export async function confirmPasswordResetAction(
  _prev: ResetConfirmState,
  formData: FormData
): Promise<ResetConfirmState> {
  const token = String(formData.get("token") ?? "");
  const password = String(formData.get("password") ?? "");
  const passwordConfirm = String(formData.get("passwordConfirm") ?? "");

  if (password.length < 6) return { ok: false, error: "Пароль должен быть не короче 6 символов" };
  if (password !== passwordConfirm) return { ok: false, error: "Пароли не совпадают" };

  const resetToken = await prisma.passwordResetToken.findUnique({ where: { token } });
  if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
    return { ok: false, error: "Ссылка недействительна или устарела. Запросите новую." };
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: resetToken.userId },
      data: { passwordHash: await hashPassword(password) },
    }),
    prisma.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { usedAt: new Date() },
    }),
  ]);

  return { ok: true };
}
