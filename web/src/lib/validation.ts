import { z } from "zod";

export const studentRegisterSchema = z
  .object({
    role: z.literal("STUDENT"),
    studentName: z.string().trim().min(2, "Укажите имя"),
    studentAge: z.coerce.number().int().min(6).max(25),
    phone: z.string().trim().optional().or(z.literal("")),
    email: z.string().trim().email("Некорректный email").optional().or(z.literal("")),
    parentContact: z.string().trim().optional().or(z.literal("")),
    password: z.string().min(6, "Минимум 6 символов"),
    passwordConfirm: z.string(),
    consent: z.literal("on", { message: "Нужно согласие на обработку персональных данных" }),
  })
  .refine((v) => v.password === v.passwordConfirm, {
    message: "Пароли не совпадают",
    path: ["passwordConfirm"],
  })
  .refine((v) => (v.phone && v.phone.length >= 5) || (v.email && v.email.includes("@")), {
    message: "Укажите телефон или email",
    path: ["phone"],
  })
  .refine((v) => v.studentAge >= 14 || (v.parentContact && v.parentContact.length >= 5), {
    message: "Укажите телефон или email родителя — это обязательно для учеников младше 14 лет",
    path: ["parentContact"],
  });

export const parentRegisterSchema = z
  .object({
    role: z.literal("PARENT"),
    parentName: z.string().trim().min(2, "Укажите ФИО"),
    phone: z.string().trim().optional().or(z.literal("")),
    email: z.string().trim().email("Некорректный email").optional().or(z.literal("")),
    studentName: z.string().trim().min(2, "Укажите имя ребёнка"),
    studentAge: z.coerce.number().int().min(6).max(25),
    password: z.string().min(6, "Минимум 6 символов"),
    passwordConfirm: z.string(),
    consent: z.literal("on", { message: "Нужно согласие на обработку персональных данных" }),
  })
  .refine((v) => v.password === v.passwordConfirm, {
    message: "Пароли не совпадают",
    path: ["passwordConfirm"],
  })
  .refine((v) => (v.phone && v.phone.length >= 5) || (v.email && v.email.includes("@")), {
    message: "Укажите телефон или email",
    path: ["phone"],
  });

export const loginSchema = z.object({
  login: z.string().trim().min(3, "Укажите телефон или email"),
  password: z.string().min(1, "Введите пароль"),
});
