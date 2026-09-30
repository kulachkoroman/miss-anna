import Link from "next/link";
import Container from "@/components/ui/Container";
import Icon from "@/components/ui/Icon";
import SocialButton from "@/components/site/SocialButton";
import BrandIcon from "@/components/ui/BrandIcon";
import { BLOG_LINKS, BLOG_NAME, LEGAL, MESSENGERS, PRACTICE_SINCE, TELEGRAM } from "@/content/site";

const sections = [
  { href: "/", label: "Главная" },
  { href: "/about", label: "Обо мне" },
  { href: "/courses", label: "Курсы" },
  { href: "/classes", label: "Занятия" },
  { href: "/contacts", label: "Контакты" },
];

const forStudents = [
  { href: "/cabinet", label: "Личный кабинет" },
  { href: "/classes#tariffs", label: "Стоимость занятий" },
  { href: "/classes#booking", label: "Пробный урок" },
  { href: "/#faq", label: "Вопросы и ответы" },
];

/**
 * Подвал сайта.
 *
 * Тёмный, чтобы визуально закрыть страницу. Здесь всё, что ищут внизу
 * настоящего сайта: разделы, ссылки для учеников, способы связи в цветах
 * приложений, блог и реквизиты самозанятой.
 */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-[#100c22] text-white">
      {/* Мягкое свечение и точки — та же графика, что на первом экране. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="bg-dots-light absolute inset-0 opacity-50 [mask-image:linear-gradient(to_bottom,black,transparent_70%)]" />
        <div className="absolute -top-40 left-1/3 h-80 w-[36rem] rounded-full bg-[var(--color-primary)] opacity-25 blur-[120px]" />
      </div>

      <Container className="relative pt-16 sm:pt-20">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.8fr)_minmax(0,0.9fr)_minmax(0,1.15fr)] lg:gap-10">
          {/* Бренд */}
          <div>
            <Link href="/" className="inline-flex flex-col leading-tight">
              <span className="text-xl font-extrabold tracking-[-0.02em]">
                {BLOG_NAME}
                <span className="text-[var(--color-accent)]">.</span>
              </span>
              <span className="mt-1.5 text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-white/45">
                ЕГЭ и ОГЭ по русскому языку
              </span>
            </Link>
            <p className="mt-5 max-w-xs text-[0.9375rem] leading-relaxed text-white/60">
              Анна Паршукова. Трижды сдала ЕГЭ на 100 баллов и готовлю к экзаменам
              с {PRACTICE_SINCE} года — на курсах и индивидуально.
            </p>

            <p className="mt-7 text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-white/40">
              Блог
            </p>
            <div className="mt-3 flex gap-2.5">
              {BLOG_LINKS.map((link) => (
                <SocialButton
                  key={link.href}
                  variant="icon"
                  brand={link.brand}
                  href={link.href}
                  label={`${link.label} ${link.handle}`}
                />
              ))}
            </div>
          </div>

          <FooterColumn title="Разделы" links={sections} />
          <FooterColumn title="Ученикам" links={forStudents} />

          {/* Связь */}
          <div>
            <h3 className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-white/40">
              Связаться
            </h3>
            <SocialButton
              brand="telegram"
              href={TELEGRAM.href}
              label="Написать в Telegram"
              className="mt-4 w-full sm:w-auto"
            />
            <ul className="mt-5 space-y-3">
              {MESSENGERS.filter((m) => m.id !== "telegram").map((m) => (
                <li key={m.id}>
                  <a
                    href={m.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-3 text-[0.9375rem] text-white/70 transition-colors hover:text-white"
                  >
                    <BrandIcon brand={m.brand} mono className="h-5 w-5 text-white/50 transition-colors group-hover:text-white" />
                    {m.label}
                    <span className="text-caption text-white/35">{m.handle}</span>
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-5 flex items-center gap-2 text-caption text-white/40">
              <Icon name="clock" className="h-4 w-4" />
              Отвечаю обычно в течение дня
            </p>
          </div>
        </div>

        {/* Крупная подпись — графический «замок» страницы. */}
        <p
          aria-hidden
          className="pointer-events-none mt-16 select-none whitespace-nowrap bg-gradient-to-b from-white/[0.14] to-white/0 bg-clip-text text-center text-[clamp(3rem,1rem+9vw,9.5rem)] font-extrabold leading-[0.9] tracking-[-0.05em] text-transparent"
        >
          Анна Паршукова
        </p>

        <div className="relative flex flex-col gap-4 border-t border-white/10 py-7 text-caption text-white/45 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1">
            <p>© {year} Анна Паршукова. Все права защищены.</p>
            <p>
              {LEGAL.statusShort} {LEGAL.fullName}, ИНН {LEGAL.inn}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link href="/offer" className="transition-colors hover:text-white">
              Публичная оферта
            </Link>
            <Link href="/privacy" className="transition-colors hover:text-white">
              Политика обработки персональных данных
            </Link>
            <a
              href="#main"
              className="group inline-flex items-center gap-1.5 font-semibold text-white/70 transition-colors hover:text-white"
            >
              Наверх
              <Icon
                name="arrowRight"
                className="h-4 w-4 -rotate-90 transition-transform duration-300 group-hover:-translate-y-0.5"
              />
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: Array<{ href: string; label: string }>;
}) {
  return (
    <div>
      <h3 className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-white/40">
        {title}
      </h3>
      <ul className="mt-4 space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="group inline-flex items-center text-[0.9375rem] text-white/70 transition-colors hover:text-white"
            >
              <span className="h-px w-0 bg-[var(--color-accent)] transition-all duration-300 ease-[var(--ease-out-expo)] group-hover:mr-2 group-hover:w-3" />
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
