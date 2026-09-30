"use client";

import { useActionState } from "react";
import { adminLoginAction } from "@/lib/actions/auth";
import type { AuthActionState } from "@/lib/actions/auth";

const initialState: AuthActionState = { ok: false };

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(adminLoginAction, initialState);

  return (
    <div className="bg-grid-light flex min-h-screen items-center justify-center bg-[var(--color-ink)] px-4">
      <div className="w-full max-w-sm rounded-3xl border-2 border-[var(--color-ink)] bg-white p-8 shadow-[6px_6px_0_var(--color-accent)]">
        <h1 className="text-xl font-extrabold text-[var(--color-ink)]">Админ-панель</h1>
        <p className="mt-1 text-sm text-[var(--color-ink-soft)]">Вход только для Анны</p>

        <form action={formAction} className="mt-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--color-ink)]">
              Телефон или email
            </label>
            <input
              name="login"
              className="w-full rounded-xl border-2 border-[var(--color-ink)] bg-white px-4 py-2.5 text-sm outline-none transition-shadow focus:shadow-[3px_3px_0_var(--color-accent)]"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--color-ink)]">Пароль</label>
            <input
              type="password"
              name="password"
              className="w-full rounded-xl border-2 border-[var(--color-ink)] bg-white px-4 py-2.5 text-sm outline-none transition-shadow focus:shadow-[3px_3px_0_var(--color-accent)]"
            />
          </div>
          {state.error && <p className="text-sm font-medium text-red-600">{state.error}</p>}
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-full border-2 border-[var(--color-ink)] bg-[var(--color-primary)] py-2.5 text-sm font-bold text-white shadow-hard transition-[translate,box-shadow] duration-150 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-hard-sm active:translate-x-[4px] active:translate-y-[4px] active:shadow-none disabled:opacity-60"
          >
            {pending ? "Входим…" : "Войти"}
          </button>
        </form>
      </div>
    </div>
  );
}
