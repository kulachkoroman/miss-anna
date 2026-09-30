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
              className="w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-2.5 text-sm outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-soft)]"
            />
            <input
              type="password"
              name="passwordConfirm"
              placeholder="Повторите пароль"
              className="w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-2.5 text-sm outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-soft)]"
            />
            {state.error && <p className="text-sm font-medium text-red-600">{state.error}</p>}
            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-full bg-[var(--color-primary)] py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.02] hover:bg-[var(--color-primary-dark)] disabled:opacity-60"
            >
              {pending ? "Сохраняем…" : "Сохранить пароль"}
            </button>
          </form>
        )}
      </Container>
    </section>
  );
}
