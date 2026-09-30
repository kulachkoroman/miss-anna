"use server";

import { prisma } from "@/lib/prisma";
import {
  createSessionCookie,
  destroySessionCookie,
  hashPassword,
  verifyPassword,
} from "@/lib/auth";
import { loginSchema, parentRegisterSchema, studentRegisterSchema } from "@/lib/validation";
import { redirect } from "next/navigation";

export type AuthActionState = {
  ok: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
};

function firstFieldErrors(issues: { path: PropertyKey[]; message: string }[]) {
  const out: Record<string, string> = {};
  for (const issue of issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

async function assertUnique(phone: string, email: string) {
  if (phone) {
    const existing = await prisma.user.findUnique({ where: { phone } });
    if (existing) return "Пользователь с таким телефоном уже зарегистрирован";
  }
  if (email) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return "Пользователь с таким email уже зарегистрирован";
  }
  return null;
}

export async function registerAction(
  _prev: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const role = formData.get("role");

  if (role === "PARENT") {
    const parsed = parentRegisterSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) {
      return { ok: false, fieldErrors: firstFieldErrors(parsed.error.issues) };
    }
    const data = parsed.data;
    const phone = data.phone || "";
    const email = data.email || "";
    const uniqueError = await assertUnique(phone, email);
    if (uniqueError) return { ok: false, error: uniqueError };

    const user = await prisma.user.create({
      data: {
        role: "PARENT",
        accountType: "PARENT",
        name: data.parentName,
        phone: phone || null,
        email: email || null,
        passwordHash: await hashPassword(data.password),
        studentName: data.studentName,
        studentAge: data.studentAge,
        consentPersonalData: true,
      },
    });
    await createSessionCookie({ sub: user.id, role: "PARENT" });
    return { ok: true };
  }

  const parsed = studentRegisterSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false, fieldErrors: firstFieldErrors(parsed.error.issues) };
  }
  const data = parsed.data;
  const phone = data.phone || "";
  const email = data.email || "";
  const uniqueError = await assertUnique(phone, email);
  if (uniqueError) return { ok: false, error: uniqueError };

  const user = await prisma.user.create({
    data: {
      role: "STUDENT",
      accountType: "STUDENT_SELF",
      name: data.studentName,
      phone: phone || null,
      email: email || null,
      passwordHash: await hashPassword(data.password),
      studentName: data.studentName,
      studentAge: data.studentAge,
      parentContact: data.parentContact || null,
      consentPersonalData: true,
    },
  });
  await createSessionCookie({ sub: user.id, role: "STUDENT" });
  return { ok: true };
}

export async function loginAction(
  _prev: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false, fieldErrors: firstFieldErrors(parsed.error.issues) };
  }
  const { login, password } = parsed.data;
  const user = await prisma.user.findFirst({
    where: { OR: [{ email: login }, { phone: login }] },
  });
  if (!user) return { ok: false, error: "Неверный логин или пароль" };

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) return { ok: false, error: "Неверный логин или пароль" };

  await createSessionCookie({
    sub: user.id,
    role: user.role as "STUDENT" | "PARENT" | "ADMIN",
  });
  return { ok: true };
}

export async function logoutAction() {
  await destroySessionCookie();
  redirect("/");
}

export async function adminLoginAction(
  _prev: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false, fieldErrors: firstFieldErrors(parsed.error.issues) };
  }
  const { login, password } = parsed.data;
  const user = await prisma.user.findFirst({
    where: { OR: [{ email: login }, { phone: login }] },
  });
  if (!user || user.role !== "ADMIN") {
    return { ok: false, error: "Неверный логин или пароль" };
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) return { ok: false, error: "Неверный логин или пароль" };

  await createSessionCookie({ sub: user.id, role: "ADMIN" });
  redirect("/admin");
}
