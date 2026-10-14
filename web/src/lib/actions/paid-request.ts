"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { PAID_REQUEST } from "@/content/course";

export type PaidRequestState = { ok: boolean; error?: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Заявка «Узнать о платном курсе» из финала бесплатного курса.
 * Сохраняется в базе — Анна видит её в админке и отвечает на почту сама.
 * Если у ученика уже есть необработанная заявка, она обновляется,
 * а не дублируется (повторное нажатие, исправленная почта).
 */
export async function createPaidRequestAction(
  _prev: PaidRequestState,
  formData: FormData
): Promise<PaidRequestState> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Войди в кабинет, чтобы отправить заявку." };

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (!name || name.length > 80) return { ok: false, error: "Напиши, как к тебе обращаться." };
  if (!EMAIL.test(email) || email.length > 120) return { ok: false, error: "Проверь адрес почты." };

  try {
    const pending = await prisma.paidCourseRequest.findFirst({
      where: { userId: user.id, status: "NEW" },
      select: { id: true },
    });
    if (pending) {
      await prisma.paidCourseRequest.update({ where: { id: pending.id }, data: { name, email } });
    } else {
      await prisma.paidCourseRequest.create({ data: { userId: user.id, name, email } });
    }
    return { ok: true };
  } catch {
    return { ok: false, error: PAID_REQUEST.error };
  }
}
