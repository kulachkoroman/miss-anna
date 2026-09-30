import { getCurrentUser } from "@/lib/auth";
import { formatDate } from "@/lib/format";
import { ProfileForm, PasswordForm } from "@/components/cabinet/ProfileForms";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) return null;

  return (
    <div className="max-w-xl space-y-8">
      <div className="flex flex-col gap-4 rounded-3xl border-2 border-[var(--color-ink)] bg-white p-6 shadow-hard sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--color-ink)]">Профиль</h1>
          <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
            {user.role === "PARENT"
              ? `Аккаунт родителя. Ученик: ${user.studentName}${user.studentAge ? `, ${user.studentAge} лет` : ""}`
              : `Аккаунт ученика${user.studentAge ? `, ${user.studentAge} лет` : ""}`}
          </p>
        </div>
        <div className="flex gap-2">
          <span className="rounded-full bg-[var(--color-accent)] px-3 py-1 text-xs font-semibold text-[var(--color-ink)]">
            {user.role === "PARENT" ? "Родитель" : "Ученик"}
          </span>
          <span className="rounded-full bg-black/5 px-3 py-1 text-xs font-semibold text-[var(--color-ink-soft)]">
            С нами с {formatDate(user.createdAt)}
          </span>
        </div>
      </div>

      <div className="rounded-3xl border-2 border-[var(--color-ink)] bg-white p-6 shadow-hard">
        <h2 className="mb-4 font-sans text-sm font-semibold uppercase tracking-wide text-[var(--color-primary)]">
          Контактные данные
        </h2>
        <ProfileForm name={user.name} phone={user.phone ?? ""} email={user.email ?? ""} />
      </div>

      <div className="rounded-3xl border-2 border-[var(--color-ink)] bg-white p-6 shadow-hard">
        <h2 className="mb-4 font-sans text-sm font-semibold uppercase tracking-wide text-[var(--color-primary)]">
          Смена пароля
        </h2>
        <PasswordForm />
      </div>
    </div>
  );
}
