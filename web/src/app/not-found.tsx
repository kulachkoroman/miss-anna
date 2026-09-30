import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Страница не найдена",
  robots: { index: false, follow: false },
};

/**
 * Страница 404.
 *
 * Показывается вне основной оболочки сайта, поэтому шапки и подвала здесь нет —
 * вместо них прямые ссылки на разделы, чтобы человек не оказался в тупике.
 * «404», исправленное красной ручкой, — шутка в тон сайту учителя русского.
 */
export default function NotFound() {
  const links = [
    { href: "/", label: "На главную" },
    { href: "/courses", label: "Курсы" },
    { href: "/classes", label: "Занятия" },
    { href: "/contacts", label: "Контакты" },
  ];

  return (
    <main className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-20">
      <div
        aria-hidden
        className="bg-dots pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]"
      />

      <div className="relative mx-auto w-full max-w-xl text-center">
        <p className="relative inline-block text-[clamp(6rem,4rem+10vw,11rem)] font-extrabold leading-none tracking-[-0.06em] text-[var(--color-ink)]">
          404
          {/* Зачёркнуто и подписано на полях, как в тетради. */}
          <span
            aria-hidden
            className="absolute left-[-4%] right-[-4%] top-1/2 h-[0.06em] -rotate-6 rounded-full bg-[#e5372f]"
          />
          <span
            aria-hidden
            className="absolute -right-6 -top-5 rotate-12 font-serif text-[0.22em] font-bold italic tracking-normal text-[#e5372f]"
          >
            нет такой!
          </span>
        </p>

        <p className="eyebrow mt-8">Ошибка в адресе</p>
        <h1 className="mt-4 text-balance text-h2 text-[var(--color-ink)]">Такой страницы нет</h1>
        <p className="mx-auto mt-4 max-w-md text-lead text-[var(--color-ink-soft)]">
          Возможно, ссылка устарела или в адресе опечатка. Вот куда можно пойти дальше.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {links.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              className={
                i === 0
                  ? "btn-shine inline-flex items-center rounded-full bg-[var(--color-primary)] px-6 py-3 font-bold text-white shadow-primary transition-transform duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-0.5"
                  : "inline-flex items-center rounded-full border border-[var(--color-border-strong)] bg-white/70 px-6 py-3 font-semibold text-[var(--color-ink-soft)] transition-all duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-0.5 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
              }
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
