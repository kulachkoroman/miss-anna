import type { Metadata } from "next";
import Button from "@/components/ui/Button";

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
        className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]"
      />

      <div className="relative mx-auto w-full max-w-xl text-center">
        <p className="relative inline-block font-display text-[clamp(5rem,3.5rem+8vw,9rem)] font-extrabold leading-none tracking-[-0.06em] text-[var(--color-ink)]">
          404
          {/* Зачёркнуто и подписано на полях, как в тетради. */}
          <span
            aria-hidden
            className="absolute left-[-4%] right-[-4%] top-1/2 h-[0.06em] -rotate-6 rounded-full bg-[#e5372f]"
          />
          <span
            aria-hidden
            className="absolute -right-6 -top-6 rotate-12 font-hand text-[0.3em] font-bold tracking-normal text-[#e5372f]"
          >
            нет такой!
          </span>
        </p>

        <p className="eyebrow mt-8">Ошибка в адресе</p>
        <h1 className="mt-4 text-balance text-h2 text-[var(--color-ink)]">Такой страницы нет</h1>
        <p className="mx-auto mt-4 max-w-md text-lead text-[var(--color-ink-soft)]">
          Возможно, ссылка устарела или в адресе опечатка. Вот куда можно пойти дальше.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          {links.map((link, i) => (
            <Button key={link.href} href={link.href} variant={i === 0 ? "primary" : "outline"}>
              {link.label}
            </Button>
          ))}
        </div>
      </div>
    </main>
  );
}
