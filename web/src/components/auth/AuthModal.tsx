"use client";

import { useActionState, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import { useAuthModal } from "./AuthModalContext";
import { loginAction, registerAction, type AuthActionState } from "@/lib/actions/auth";
import { enrollFreeAction } from "@/lib/actions/enrollment";
import { createPaymentAction } from "@/lib/actions/payments";

const initialState: AuthActionState = { ok: false };

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs font-medium text-red-600">{message}</p>;
}

const inputClasses =
  "w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-2.5 text-sm text-[var(--color-ink)] " +
  "outline-none transition-colors focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-soft)]";

const labelClasses = "block text-sm font-medium text-[var(--color-ink)] mb-1.5";

export default function AuthModal() {
  const { state, close, setMode } = useAuthModal();
  const { isOpen, mode, intent } = state;

  const [loginState, loginFormAction, loginPending] = useActionState(
    loginAction,
    initialState
  );
  const [registerState, registerFormAction, registerPending] = useActionState(
    registerAction,
    initialState
  );
  const [registerRole, setRegisterRole] = useState<"STUDENT" | "PARENT">("STUDENT");
  const [studentAge, setStudentAge] = useState<string>("");

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  async function resolveSuccess() {
    if (intent?.type === "enroll") {
      await enrollFreeAction(intent.courseSlug);
    } else if (intent?.type === "pay") {
      await createPaymentAction(intent.courseSlug);
    } else {
      close();
    }
  }

  useEffect(() => {
    if (loginState.ok) void resolveSuccess();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loginState]);

  useEffect(() => {
    if (registerState.ok) void resolveSuccess();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registerState]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 px-4 py-8 sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <motion.div
            className="w-full max-w-md rounded-3xl bg-[var(--color-surface)] p-6 shadow-2xl sm:p-8"
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mb-6 flex items-center justify-between">
              <div className="flex gap-1 rounded-full bg-black/5 p-1">
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className={clsx(
                    "rounded-full px-4 py-1.5 text-sm font-semibold transition-colors",
                    mode === "login"
                      ? "bg-white text-[var(--color-ink)] shadow"
                      : "text-[var(--color-ink-soft)]"
                  )}
                >
                  Вход
                </button>
                <button
                  type="button"
                  onClick={() => setMode("register")}
                  className={clsx(
                    "rounded-full px-4 py-1.5 text-sm font-semibold transition-colors",
                    mode === "register"
                      ? "bg-white text-[var(--color-ink)] shadow"
                      : "text-[var(--color-ink-soft)]"
                  )}
                >
                  Регистрация
                </button>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Закрыть"
                className="rounded-full p-2 text-[var(--color-ink-soft)] transition-colors hover:bg-black/5"
              >
                ✕
              </button>
            </div>

            {mode === "login" ? (
              <form action={loginFormAction} className="space-y-4">
                <div>
                  <label className={labelClasses}>Телефон или email</label>
                  <input name="login" className={inputClasses} placeholder="you@example.com" />
                  <FieldError message={loginState.fieldErrors?.login} />
                </div>
                <div>
                  <label className={labelClasses}>Пароль</label>
                  <input
                    type="password"
                    name="password"
                    className={inputClasses}
                    placeholder="••••••••"
                  />
                  <FieldError message={loginState.fieldErrors?.password} />
                </div>
                {loginState.error && (
                  <p className="text-sm font-medium text-red-600">{loginState.error}</p>
                )}
                <button
                  type="submit"
                  disabled={loginPending}
                  className="w-full rounded-full bg-[var(--color-primary)] py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.02] hover:bg-[var(--color-primary-dark)] disabled:opacity-60"
                >
                  {loginPending ? "Входим…" : "Войти"}
                </button>
                <p className="text-center text-sm text-[var(--color-ink-soft)]">
                  <a href="/reset-password" className="underline hover:text-[var(--color-primary)]">
                    Забыли пароль?
                  </a>
                </p>
              </form>
            ) : (
              <form action={registerFormAction} className="space-y-4">
                <input type="hidden" name="role" value={registerRole} />
                <div className="flex gap-1 rounded-full bg-black/5 p-1">
                  <button
                    type="button"
                    onClick={() => setRegisterRole("STUDENT")}
                    className={clsx(
                      "flex-1 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors sm:text-sm",
                      registerRole === "STUDENT"
                        ? "bg-white text-[var(--color-ink)] shadow"
                        : "text-[var(--color-ink-soft)]"
                    )}
                  >
                    Я ученик
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegisterRole("PARENT")}
                    className={clsx(
                      "flex-1 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors sm:text-sm",
                      registerRole === "PARENT"
                        ? "bg-white text-[var(--color-ink)] shadow"
                        : "text-[var(--color-ink-soft)]"
                    )}
                  >
                    Я родитель, регистрирую ребёнка
                  </button>
                </div>

                {registerRole === "STUDENT" ? (
                  <>
                    <div>
                      <label className={labelClasses}>Имя ученика</label>
                      <input name="studentName" className={inputClasses} />
                      <FieldError message={registerState.fieldErrors?.studentName} />
                    </div>
                    <div>
                      <label className={labelClasses}>Возраст</label>
                      <input
                        name="studentAge"
                        type="number"
                        min={6}
                        max={25}
                        className={inputClasses}
                        value={studentAge}
                        onChange={(e) => setStudentAge(e.target.value)}
                      />
                      <FieldError message={registerState.fieldErrors?.studentAge} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelClasses}>Телефон</label>
                        <input name="phone" className={inputClasses} />
                      </div>
                      <div>
                        <label className={labelClasses}>Email</label>
                        <input name="email" type="email" className={inputClasses} />
                      </div>
                    </div>
                    <FieldError message={registerState.fieldErrors?.phone} />
                    {studentAge !== "" && Number(studentAge) < 14 && (
                      <div>
                        <label className={labelClasses}>Телефон или email родителя</label>
                        <input name="parentContact" className={inputClasses} />
                        <p className="mt-1 text-xs text-[var(--color-ink-soft)]">
                          Для учеников младше 14 лет требуется согласие родителя на обработку
                          персональных данных.
                        </p>
                        <FieldError message={registerState.fieldErrors?.parentContact} />
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div>
                      <label className={labelClasses}>ФИО родителя</label>
                      <input name="parentName" className={inputClasses} />
                      <FieldError message={registerState.fieldErrors?.parentName} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelClasses}>Телефон</label>
                        <input name="phone" className={inputClasses} />
                      </div>
                      <div>
                        <label className={labelClasses}>Email</label>
                        <input name="email" type="email" className={inputClasses} />
                      </div>
                    </div>
                    <FieldError message={registerState.fieldErrors?.phone} />
                    <div>
                      <label className={labelClasses}>Имя ребёнка</label>
                      <input name="studentName" className={inputClasses} />
                      <FieldError message={registerState.fieldErrors?.studentName} />
                    </div>
                    <div>
                      <label className={labelClasses}>Возраст ребёнка</label>
                      <input name="studentAge" type="number" min={6} max={25} className={inputClasses} />
                      <FieldError message={registerState.fieldErrors?.studentAge} />
                    </div>
                  </>
                )}

                <div>
                  <label className={labelClasses}>Пароль</label>
                  <input type="password" name="password" className={inputClasses} />
                  <FieldError message={registerState.fieldErrors?.password} />
                </div>
                <div>
                  <label className={labelClasses}>Подтверждение пароля</label>
                  <input type="password" name="passwordConfirm" className={inputClasses} />
                  <FieldError message={registerState.fieldErrors?.passwordConfirm} />
                </div>

                <label className="flex items-start gap-2 text-xs text-[var(--color-ink-soft)]">
                  <input type="checkbox" name="consent" className="mt-0.5" required />
                  <span>
                    Даю согласие на обработку персональных данных в соответствии с{" "}
                    <a href="/privacy" target="_blank" className="underline hover:text-[var(--color-primary)]">
                      Политикой обработки персональных данных
                    </a>
                  </span>
                </label>
                <FieldError message={registerState.fieldErrors?.consent} />

                {registerState.error && (
                  <p className="text-sm font-medium text-red-600">{registerState.error}</p>
                )}

                <button
                  type="submit"
                  disabled={registerPending}
                  className="w-full rounded-full bg-[var(--color-primary)] py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.02] hover:bg-[var(--color-primary-dark)] disabled:opacity-60"
                >
                  {registerPending ? "Регистрируем…" : "Зарегистрироваться"}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
