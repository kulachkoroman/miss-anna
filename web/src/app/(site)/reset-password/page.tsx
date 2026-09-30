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
            className="w-full rounded-xl border-2 border-[var(--color-ink)] bg-white px-4 py-2.5 text-sm outline-none transition-shadow focus:shadow-[3px_3px_0_var(--color-accent)]"
          />
          {state.error && <p className="text-sm font-medium text-red-600">{state.error}</p>}
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-full border-2 border-[var(--color-ink)] bg-[var(--color-primary)] py-2.5 text-sm font-bold text-white shadow-hard transition-[translate,box-shadow] duration-150 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-hard-sm active:translate-x-[4px] active:translate-y-[4px] active:shadow-none disabled:opacity-60"
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
