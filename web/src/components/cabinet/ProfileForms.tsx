"use client";

import { useActionState } from "react";
import { updateProfileAction, changePasswordAction, type ProfileActionState } from "@/lib/actions/cabinet";

const initialState: ProfileActionState = { ok: false };

const inputClasses =
  "w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-2.5 text-sm outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-soft)]";
const labelClasses = "block text-sm font-medium text-[var(--color-ink)] mb-1.5";

export function ProfileForm({
  name,
  phone,
  email,
}: {
  name: string;
  phone: string;
  email: string;
}) {
  const [state, formAction, pending] = useActionState(updateProfileAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className={labelClasses}>Имя</label>
        <input name="name" defaultValue={name} className={inputClasses} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClasses}>Телефон</label>
          <input name="phone" defaultValue={phone} className={inputClasses} />
        </div>
        <div>
          <label className={labelClasses}>Email</label>
          <input name="email" type="email" defaultValue={email} className={inputClasses} />
        </div>
      </div>
      {state.error && <p className="text-sm font-medium text-red-600">{state.error}</p>}
      {state.success && <p className="text-sm font-medium text-green-600">{state.success}</p>}
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.02] disabled:opacity-60"
      >
        {pending ? "Сохраняем…" : "Сохранить"}
      </button>
    </form>
  );
}

export function PasswordForm() {
  const [state, formAction, pending] = useActionState(changePasswordAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className={labelClasses}>Текущий пароль</label>
        <input type="password" name="currentPassword" className={inputClasses} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClasses}>Новый пароль</label>
          <input type="password" name="newPassword" className={inputClasses} />
        </div>
        <div>
          <label className={labelClasses}>Повторите новый пароль</label>
          <input type="password" name="newPasswordConfirm" className={inputClasses} />
        </div>
      </div>
      {state.error && <p className="text-sm font-medium text-red-600">{state.error}</p>}
      {state.success && <p className="text-sm font-medium text-green-600">{state.success}</p>}
      <button
        type="submit"
        disabled={pending}
        className="rounded-full border-2 border-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-[var(--color-primary)] transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.02] hover:bg-[var(--color-primary-soft)] disabled:opacity-60"
      >
        {pending ? "Сохраняем…" : "Изменить пароль"}
      </button>
    </form>
  );
}
