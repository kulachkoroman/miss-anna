"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { createPaidRequestAction, type PaidRequestState } from "@/lib/actions/paid-request";
import { COURSE_FINISH, PAID_REQUEST } from "@/content/course";

const inputClasses =
  "w-full rounded-xl border-2 border-[var(--color-ink)] bg-white px-4 py-3 outline-none transition-shadow focus:shadow-[3px_3px_0_var(--color-accent)]";

/**
 * Финал курса: «Продолжить подготовку со мной» → кнопка открывает форму
 * заявки (имя и почта). «Заявка получена» показывается только после
 * ответа сервера, что заявка сохранена.
 */
export default function PaidRequestForm({ defaultName, defaultEmail }: { defaultName: string; defaultEmail: string }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState<PaidRequestState, FormData>(createPaidRequestAction, { ok: false });

  if (state.ok) {
    return (
      <p className="flex items-center gap-3 rounded-card border-2 border-[var(--color-ink)] bg-white p-5 font-semibold text-[var(--color-ink)]">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-[var(--color-ink)] bg-[var(--color-success)] text-white">
          <Icon name="check" className="h-4 w-4" strokeWidth={2.8} />
        </span>
        {PAID_REQUEST.success}
      </p>
    );
  }

  if (!open) {
    return (
      <div>
        <Button type="button" variant="light" size="lg" onClick={() => setOpen(true)}>
          {COURSE_FINISH.button}
          <Icon name="arrowRight" className="h-5 w-5" />
        </Button>
        <p className="mt-3 text-caption text-white/65">{COURSE_FINISH.underButton}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="rounded-card border-2 border-[var(--color-ink)] bg-white p-5 text-[var(--color-ink)] sm:p-6">
      <p className="font-semibold">{PAID_REQUEST.title}</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">{PAID_REQUEST.nameLabel}</span>
          <input name="name" required maxLength={80} defaultValue={defaultName} className={inputClasses} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">{PAID_REQUEST.emailLabel}</span>
          <input name="email" type="email" required maxLength={120} defaultValue={defaultEmail} className={inputClasses} />
        </label>
      </div>
      {state.error && <p className="mt-4 text-sm font-medium text-[var(--color-danger)]">{state.error}</p>}
      <div className="mt-5">
        <Button type="submit" variant="accent" disabled={pending} className="w-full sm:w-auto">
          {pending ? "Отправляю…" : PAID_REQUEST.button}
        </Button>
      </div>
      <p className="mt-3 text-caption text-[var(--color-ink-muted)]">
        Отправляя заявку, ты соглашаешься с{" "}
        <Link href="/privacy" className="underline underline-offset-2">
          политикой обработки персональных данных
        </Link>
        .
      </p>
    </form>
  );
}
