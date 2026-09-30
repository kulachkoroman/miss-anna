"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import Container from "@/components/ui/Container";
import { confirmPasswordResetAction, type ResetConfirmState } from "@/lib/actions/password-reset";

const initialState: ResetConfirmState = { ok: false };

export default function ResetPasswordConfirmPage() {
  const params = useSearchParams();
  const token = params.get("token") ?? "";
  const [state, formAction, pending] = useActionState(confirmPasswordResetAction, initialState);

  return (
    <section className="flex min-h-[60vh] items-center py-16">
      <Container className="max-w-md">
        <h1 className="text-2xl font-extrabold text-[var(--color-ink)]">Новый пароль</h1>

        {state.ok ? (
          <p className="mt-4 text-sm text-[var(--color-ink-soft)]">
            Пароль изменён. Теперь вы можете войти с новым паролем.
          </p>
        ) : (
          <form action={formAction} className="mt-6 space-y-4">
            <input type="hidden" name="token" value={token} />
            <input
              type="password"
              name="password"
              placeholder="Новый пароль"
              className="w-full rounded-xl border-2 border-[var(--color-ink)] bg-white px-4 py-2.5 text-sm outline-none transition-shadow focus:shadow-[3px_3px_0_var(--color-accent)]"
            />
            <input
              type="password"
              name="passwordConfirm"
              placeholder="Повторите пароль"
              className="w-full rounded-xl border-2 border-[var(--color-ink)] bg-white px-4 py-2.5 text-sm outline-none transition-shadow focus:shadow-[3px_3px_0_var(--color-accent)]"
            />
            {state.error && <p className="text-sm font-medium text-red-600">{state.error}</p>}
            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-full border-2 border-[var(--color-ink)] bg-[var(--color-primary)] py-2.5 text-sm font-bold text-white shadow-hard transition-[translate,box-shadow] duration-150 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-hard-sm active:translate-x-[4px] active:translate-y-[4px] active:shadow-none disabled:opacity-60"
            >
              {pending ? "Сохраняем…" : "Сохранить пароль"}
            </button>
          </form>
        )}
      </Container>
    </section>
  );
}
