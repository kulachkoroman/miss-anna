"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import clsx from "clsx";
import Icon from "@/components/ui/Icon";
import { useAuthModal } from "@/components/auth/AuthModalContext";
import StartCourseButton from "@/components/landing/StartCourseButton";
import { BLOG_NAME } from "@/content/site";
import type { CourseAccess } from "@/lib/course-access";

const anchors = [
  { href: "/#program", label: "Программа" },
  { href: "/#anna", label: "Об Анне" },
  { href: "/#faq", label: "Вопросы" },
];

/**
 * Шапка лендинга: та же белая «таблетка», что была у сайта, но без меню
 * разделов и без «Записаться» — у Анны нет мест на занятия.
 * Слева имя блога, по центру три якоря по странице, справа вход и кнопка курса.
 */
export default function LandingHeader({
  access,
  userName,
}: {
  access: CourseAccess;
  userName: string | null;
}) {
  const { openLogin } = useAuthModal();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 12);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const accountClass =
    "inline-flex items-center gap-2 rounded-full px-3 py-2.5 text-[0.875rem] font-semibold text-[var(--color-ink)] transition-colors duration-300 hover:bg-black/[0.05]";

  return (
    <header className="fixed inset-x-0 top-3 z-40 px-3 sm:top-4 sm:px-6 lg:px-8">
      <div
        className={clsx(
          "mx-auto max-w-[76rem] rounded-full border-2 border-[var(--color-ink)] bg-white transition-shadow duration-300",
          scrolled ? "shadow-hard" : "shadow-hard-sm"
        )}
      >
        <div className="flex h-16 items-center justify-between gap-2 pl-5 pr-2 sm:h-[4.25rem] sm:pl-6 sm:pr-2.5">
          <Link href="/" className="flex min-w-0 flex-col leading-tight">
            <span className="truncate font-display text-[0.875rem] font-bold tracking-[-0.02em] text-[var(--color-ink)] sm:text-[0.9375rem]">
              {BLOG_NAME}
              <span className="text-[var(--color-accent)]">.</span>
            </span>
            <span className="mt-0.5 truncate text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
              Бесплатный курс
            </span>
          </Link>

          <nav aria-label="По странице" className="hidden items-center gap-0.5 lg:flex">
            {anchors.map((a) => (
              <a
                key={a.href}
                href={a.href}
                className="rounded-full px-3.5 py-2 text-[0.875rem] font-medium text-[var(--color-ink-soft)] transition-colors duration-300 hover:bg-[var(--color-accent-tint)] hover:text-[var(--color-ink)]"
              >
                {a.label}
              </a>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-1">
            {userName ? (
              <Link href="/cabinet" className={accountClass} aria-label="Личный кабинет">
                <Icon name="user" className="h-[1.125rem] w-[1.125rem]" />
                <span className="hidden sm:inline">Кабинет</span>
              </Link>
            ) : (
              <button type="button" onClick={() => openLogin()} className={accountClass} aria-label="Войти">
                <Icon name="user" className="h-[1.125rem] w-[1.125rem]" />
                <span className="hidden sm:inline">Войти</span>
              </button>
            )}
            {/* На телефоне кнопку курса держит закреплённая полоса внизу (StickyCta). */}
            <div className="hidden sm:block">
              <StartCourseButton
                {...access}
                label={access.isEnrolled ? "К урокам" : "Смотреть курс"}
                size="md"
                bare
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
