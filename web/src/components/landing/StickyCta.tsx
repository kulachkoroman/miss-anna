"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import StartCourseButton from "@/components/landing/StartCourseButton";
import type { CourseAccess } from "@/lib/course-access";

/**
 * Кнопка курса, закреплённая внизу экрана на телефоне.
 * Появляется, когда первый экран (#top) ушёл вверх, и прячется
 * у финального блока, чтобы не дублировать его кнопку.
 */
export default function StickyCta({ access, label }: { access: CourseAccess; label: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      const hero = document.getElementById("top");
      const heroGone = hero ? hero.getBoundingClientRect().bottom < 0 : window.scrollY > 400;
      const nearEnd = window.innerHeight + window.scrollY > document.body.scrollHeight - 520;
      setVisible(heroGone && !nearEnd);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden={!visible}
      className={clsx(
        "fixed inset-x-0 bottom-0 z-30 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-6 transition-[translate,opacity] duration-300 md:hidden",
        "bg-gradient-to-t from-[var(--color-bg)] via-[var(--color-bg)]/90 to-transparent",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0"
      )}
    >
      <StartCourseButton {...access} label={label} className="w-full" />
    </div>
  );
}
