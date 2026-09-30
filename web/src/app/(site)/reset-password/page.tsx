"use client";

import { useActionState } from "react";
import Container from "@/components/ui/Container";
import { requestPasswordResetAction, type ResetRequestState } from "@/lib/actions/password-reset";

const initialState: ResetRequestState = { ok: false };

export default function ResetPasswordPage() {
  const [state, formAction, pending] = useActionState(requestPasswordResetAction, initialState);

  return (
    <section className="flex min-h-[60vh] items-center py-16">
      <Container className="max-w-md">
        <h1 className="text-2xl font-extrabold text-[var(--color-ink)]">Восстановление пароля</h1>
        <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
          Укажите телефон или email, с которым вы регистрировались — пришлём ссылку для сброса пароля.
        </p>

        <form action={formAction} className="mt-6 space-y-4">
          <input
            name="login"
            placeholder="Телефон или email"
            className="w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-2.5 text-sm outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-soft)]"
          />
          {state.error && <p className="text-sm font-medium text-red-600">{state.error}</p>}
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-full bg-[var(--color-primary)] py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.02] hover:bg-[var(--color-primary-dark)] disabled:opacity-60"
          >
            {pending ? "Отправляем…" : "Получить ссылку"}
          </button>
        </form>

        {state.ok && (
          <div className="mt-6 rounded-2xl bg-[var(--color-primary-soft)] p-4 text-sm text-[var(--color-ink)]">
            {state.devLink ? (
              <>
                <p className="font-semibold">
                  Почтовый/SMS-сервис ещё не подключён — на этапе разработки ссылка для сброса
                  показана прямо здесь:
                </p>
                <a href={state.devLink} className="mt-2 block break-all underline">
                  {state.devLink}
                </a>
              </>
            ) : (
              <p>Если такой аккаунт существует, мы отправили ссылку для восстановления пароля.</p>
            )}
          </div>
        )}
      </Container>
    </section>
  );
}
