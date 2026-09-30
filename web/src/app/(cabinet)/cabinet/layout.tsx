import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { logoutAction } from "@/lib/actions/auth";
import { supportHref, isExternal } from "@/content/site";

export default async function CabinetLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/?auth=1");

  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-bg)]">
      <header className="border-b border-[var(--color-border)] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="flex flex-col leading-tight">
            <span className="text-base font-extrabold tracking-tight">Личный кабинет</span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--color-ink-soft)]">
              Русичка Анна Евгеньевна
            </span>
          </Link>
          <nav className="flex items-center gap-1 text-sm font-medium">
            <Link
              href="/cabinet"
              className="rounded-full px-3.5 py-2 text-[var(--color-ink-soft)] transition-colors hover:text-[var(--color-primary)]"
            >
              Мои курсы
            </Link>
            <Link
              href="/cabinet/profile"
              className="rounded-full px-3.5 py-2 text-[var(--color-ink-soft)] transition-colors hover:text-[var(--color-primary)]"
            >
              Профиль
            </Link>
            <a
              href={supportHref()}
              {...(isExternal(supportHref()) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="rounded-full px-3.5 py-2 text-[var(--color-ink-soft)] transition-colors hover:text-[var(--color-primary)]"
            >
              Поддержка
            </a>
            <form action={logoutAction}>
              <button
                type="submit"
                className="ml-1 rounded-full border border-[var(--color-border)] px-3.5 py-2 text-[var(--color-ink-soft)] transition-colors hover:border-red-300 hover:text-red-600"
              >
                Выйти
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
