"use client";

import { useActionState } from "react";
import { adminLoginAction } from "@/lib/actions/auth";
import type { AuthActionState } from "@/lib/actions/auth";

const initialState: AuthActionState = { ok: false };

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(adminLoginAction, initialState);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-ink)] px-4">
      <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl">
        <h1 className="text-xl font-extrabold text-[var(--color-ink)]">Админ-панель</h1>
        <p className="mt-1 text-sm text-[var(--color-ink-soft)]">Вход только для Анны</p>

        <form action={formAction} className="mt-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--color-ink)]">
              Телефон или email
            </label>
            <input
              name="login"
              className="w-full rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-soft)]"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--color-ink)]">Пароль</label>
            <input
              type="password"
              name="password"
              className="w-full rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-soft)]"
            />
          </div>
          {state.error && <p className="text-sm font-medium text-red-600">{state.error}</p>}
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-full bg-[var(--color-primary)] py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.02] disabled:opacity-60"
          >
            {pending ? "Входим…" : "Войти"}
          </button>
        </form>
      </div>
    </div>
  );
}
