"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import { useAuthModal } from "@/components/auth/AuthModalContext";
import BrandIcon from "@/components/ui/BrandIcon";
import Icon from "@/components/ui/Icon";
import SocialButton from "@/components/site/SocialButton";
import { EASE } from "@/lib/motion";
import { BLOG_NAME, MESSENGERS, TELEGRAM } from "@/content/site";

// How far below the top of the viewport a section must cross before it
// counts as "current" — keeps the highlight in sync with what's actually
// visible under the floating header, instead of flickering between tabs.
const ACTIVE_LINE_PX = 140;

const navItems = [
  { href: "/", label: "Главная" },
  { href: "/about", label: "Обо мне", scrollId: "about" },
  { href: "/courses", label: "Курсы", scrollId: "courses" },
  { href: "/classes", label: "Занятия", scrollId: "classes" },
  { href: "/#reviews", label: "Отзывы", scrollId: "reviews" },
  { href: "/contacts", label: "Контакты", scrollId: "contacts" },
];

/**
 * Шапка сайта — плавающая белая «таблетка» с обводкой и жёсткой тенью.
 *
 * На главной подсвечивает раздел, до которого долистал человек.
 * Справа — вход в кабинет и главная кнопка «Записаться», которая сразу
 * открывает Telegram для записи. На телефоне меню раскрывается плашкой
 * с крупными пунктами и кнопками мессенджеров.
 */
export default function HeaderClient({
  user,
}: {
  user: { name: string; role: string } | null;
}) {
  const pathname = usePathname();
  const { openLogin } = useAuthModal();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeAnchor, setActiveAnchor] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 12);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Закрываем меню клавишей Esc. */
  useEffect(() => {
    if (!mobileOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMobileOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  useEffect(() => {
    if (pathname !== "/") {
      const frame = requestAnimationFrame(() => setActiveAnchor(null));
      return () => cancelAnimationFrame(frame);
    }
    const scrollIds = navItems
      .filter((i) => i.scrollId)
      .map((i) => i.scrollId as string);

    // Scroll-position based scrollspy: the active tab is the last tracked
    // section whose top has crossed the active line. Sections that have no
    // nav tab of their own simply keep the previous tab highlighted.
    function computeActive() {
      let current: string | null = null;
      for (const id of scrollIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= ACTIVE_LINE_PX) {
          current = id;
        }
      }
      setActiveAnchor(current);
    }

    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        computeActive();
        ticking = false;
      });
    }

    const initialFrame = requestAnimationFrame(computeActive);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(initialFrame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  function isActive(item: (typeof navItems)[number]) {
    if (pathname === "/") {
      if (item.scrollId) return activeAnchor === item.scrollId;
      return item.href === "/" && !activeAnchor;
    }
    return pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href + "/"));
  }

  const accountButton = user ? (
    <Link
      href="/cabinet"
      className="inline-flex items-center gap-2 rounded-full px-3.5 py-2.5 text-[0.875rem] font-semibold text-[var(--color-ink)] transition-colors duration-300 hover:bg-black/[0.05]"
    >
      <Icon name="user" className="h-[1.125rem] w-[1.125rem]" />
      Кабинет
    </Link>
  ) : (
    <button
      type="button"
      onClick={() => openLogin()}
      className="inline-flex items-center gap-2 rounded-full px-3.5 py-2.5 text-[0.875rem] font-semibold text-[var(--color-ink)] transition-colors duration-300 hover:bg-black/[0.05]"
    >
      <Icon name="user" className="h-[1.125rem] w-[1.125rem]" />
      Войти
    </button>
  );

  return (
    <header className="fixed inset-x-0 top-3 z-40 px-3 sm:top-4 sm:px-6 lg:px-8">
      <div
        className={clsx(
          "mx-auto max-w-[76rem] rounded-full border-2 border-[var(--color-ink)] bg-white transition-shadow duration-300",
          scrolled || mobileOpen ? "shadow-hard" : "shadow-hard-sm"
        )}
      >
        <div className="flex h-16 items-center justify-between gap-3 pl-6 pr-2.5 sm:h-[4.25rem]">
          <Link href="/" className="flex min-w-0 flex-col leading-tight" onClick={() => setMobileOpen(false)}>
            <span className="truncate font-display text-[0.8125rem] font-bold tracking-[-0.02em] text-[var(--color-ink)] sm:text-[0.9375rem]">
              {BLOG_NAME}
              <span className="text-[var(--color-accent)]">.</span>
            </span>
            <span className="mt-0.5 text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
              ЕГЭ · ОГЭ · русский язык
            </span>
          </Link>

          <nav aria-label="Основное меню" className="hidden items-center gap-0.5 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item) ? "page" : undefined}
                className={clsx(
                  "rounded-full px-3.5 py-2 text-[0.875rem] transition-colors duration-300",
                  isActive(item)
                    ? "bg-[var(--color-accent)] font-semibold text-[var(--color-ink)]"
                    : "font-medium text-[var(--color-ink-soft)] hover:bg-[var(--color-accent-tint)] hover:text-[var(--color-ink)]"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-1.5">
            <div className="hidden sm:block">{accountButton}</div>

            <a
              href={TELEGRAM.href}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-2 rounded-full border-2 border-[var(--color-ink)] bg-[var(--color-accent)] px-5 py-2 text-[0.875rem] font-bold text-[var(--color-ink)] shadow-hard-sm transition-[translate,box-shadow] duration-150 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none sm:inline-flex"
            >
              <BrandIcon brand="telegram" mono className="h-4 w-4" />
              <span>Записаться</span>
            </a>

            <button
              type="button"
              className="relative flex h-11 w-11 items-center justify-center rounded-full text-[var(--color-ink)] transition-colors hover:bg-black/[0.05] lg:hidden"
              aria-label={mobileOpen ? "Закрыть меню" : "Открыть меню"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              onClick={() => setMobileOpen((v) => !v)}
            >
              {/* Три полоски превращаются в крестик. */}
              <span
                className={clsx(
                  "absolute h-[2px] w-5 rounded-full bg-current transition-transform duration-300",
                  mobileOpen ? "rotate-45" : "-translate-y-1.5"
                )}
              />
              <span
                className={clsx(
                  "absolute h-[2px] w-5 rounded-full bg-current transition-opacity duration-200",
                  mobileOpen && "opacity-0"
                )}
              />
              <span
                className={clsx(
                  "absolute h-[2px] w-5 rounded-full bg-current transition-transform duration-300",
                  mobileOpen ? "-rotate-45" : "translate-y-1.5"
                )}
              />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            id="mobile-nav"
            aria-label="Меню"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.35, ease: EASE.out }}
            className="mx-auto mt-2 max-w-[76rem] origin-top overflow-hidden rounded-[1.5rem] border-2 border-[var(--color-ink)] bg-white p-3 shadow-hard lg:hidden"
          >
            <ul className="flex flex-col">
              {navItems.map((item, i) => (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i + 0.05, duration: 0.3, ease: EASE.out }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={clsx(
                      "flex items-center justify-between rounded-2xl px-4 py-3.5 text-lg font-bold tracking-[-0.02em] transition-colors",
                      isActive(item)
                        ? "bg-[var(--color-accent)] text-[var(--color-ink)]"
                        : "text-[var(--color-ink)] active:bg-[var(--color-accent-tint)]"
                    )}
                  >
                    {item.label}
                    <Icon name="arrowRight" className="h-5 w-5 opacity-30" />
                  </Link>
                </motion.li>
              ))}
            </ul>

            <div className="mt-3 border-t border-[var(--color-border)] px-1 pt-4">
              <p className="px-3 text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
                Записаться и задать вопрос
              </p>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {MESSENGERS.map((m) => (
                  <SocialButton
                    key={m.id}
                    brand={m.brand}
                    href={m.href}
                    label={m.id === "vk" ? "VK" : m.label}
                    className="px-3"
                  />
                ))}
              </div>
              <div className="mt-3 sm:hidden" onClick={() => setMobileOpen(false)}>
                {accountButton}
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
