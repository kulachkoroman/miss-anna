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
      <header className="border-b-2 border-[var(--color-ink)] bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="flex flex-col leading-tight">
            <span className="whitespace-nowrap font-display text-base font-bold tracking-tight">Личный кабинет<span className="text-[var(--color-accent)]">.</span></span>
            <span className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--color-ink-soft)]">
              Русичка Анна Евгеньевна
            </span>
          </Link>
          {/* На телефоне меню уходит второй строкой под название и не распирает шапку. */}
          <nav className="-mx-2 flex w-full items-center gap-1 overflow-x-auto whitespace-nowrap text-[0.8125rem] font-medium sm:text-sm sm:mx-0 sm:w-auto">
            <Link
              href="/cabinet"
              className="rounded-full px-2 py-2 text-[var(--color-ink-soft)] sm:px-3.5 transition-colors hover:bg-[var(--color-accent-tint)] hover:text-[var(--color-ink)]"
            >
              Мои курсы
            </Link>
            <Link
              href="/cabinet/profile"
              className="rounded-full px-2 py-2 text-[var(--color-ink-soft)] sm:px-3.5 transition-colors hover:bg-[var(--color-accent-tint)] hover:text-[var(--color-ink)]"
            >
              Профиль
            </Link>
            <a
              href={supportHref()}
              {...(isExternal(supportHref()) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="rounded-full px-2 py-2 text-[var(--color-ink-soft)] sm:px-3.5 transition-colors hover:bg-[var(--color-accent-tint)] hover:text-[var(--color-ink)]"
            >
              Поддержка
            </a>
            <form action={logoutAction} className="ml-auto sm:ml-0">
              <button
                type="submit"
                className="ml-1 rounded-full border-2 border-[var(--color-ink)] px-3 py-1.5 font-semibold text-[var(--color-ink)] transition-colors hover:bg-[#ffd6d6]"
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
