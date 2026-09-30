"use client";

import Link from "next/link";
import type { Course } from "@prisma/client";
import { useRef } from "react";
import MediaSlot from "@/components/ui/MediaSlot";
import Icon from "@/components/ui/Icon";
import { courseCoverSpec } from "@/content/media";
import { formatRub } from "@/lib/format";

/**
 * Горизонтальная карточка курса с наклоном за курсором.
 *
 * Карточка слегка поворачивается в сторону курсора, а по стеклу идёт блик —
 * это главный интерактивный приём каталога, и он намеренно сохранён.
 *
 * Два режима:
 *   onOpen не задан — карточка ведёт на страницу курса (главная);
 *   onOpen задан    — карточка открывает фрейм с подробностями (каталог).
 */

const MAX_TILT = 3.5;

export default function CourseCard({
  course,
  meta,
  onOpen,
}: {
  course: Course;
  /** Короткая строка поверх карточки: объём курса. */
  meta?: string;
  onOpen?: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    card.style.transform = `perspective(1200px) rotateX(${(0.5 - y) * MAX_TILT * 2}deg) rotateY(${
      (x - 0.5) * MAX_TILT * 2
    }deg) scale3d(1.008, 1.008, 1.008)`;
    card.style.setProperty("--glare-x", `${x * 100}%`);
    card.style.setProperty("--glare-y", `${y * 100}%`);
    card.style.setProperty("--glare-opacity", "0.7");
  }

  function handleMouseLeave() {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    card.style.setProperty("--glare-opacity", "0");
  }

  const inner = (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative aspect-[16/10] w-full overflow-hidden rounded-[1.75rem] border-2 border-[var(--color-ink)] shadow-hard-lg will-change-transform sm:aspect-[16/9]"
      style={{
        transform: "perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
        transitionProperty: "transform, box-shadow",
        transitionDuration: "300ms",
        transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      <MediaSlot
        spec={courseCoverSpec(course)}
        overlay="bottom"
        sizes="(max-width: 640px) 100vw, 45vw"
        devHint={false}
        className="absolute inset-0"
      />

      {/* Блик по стеклу, идущий за курсором. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[var(--glare-opacity,0)] transition-opacity duration-300"
        style={{
          background:
            "radial-gradient(circle at var(--glare-x, 50%) var(--glare-y, 50%), rgba(255,255,255,0.4), transparent 45%)",
          mixBlendMode: "soft-light",
        }}
      />

      <div className="relative flex h-full flex-col justify-between p-5 text-left sm:p-7">
        <div className="flex items-start justify-between gap-3">
          <span
            className={`w-fit rounded-full border-2 border-[var(--color-ink)] px-3 py-0.5 text-caption font-bold text-[var(--color-ink)] ${
              course.isFree ? "bg-[var(--color-accent)]" : "bg-white"
            }`}
          >
            {course.isFree ? "Бесплатно" : formatRub(course.priceRub)}
          </span>
          {meta && (
            <span className="w-fit rounded-full border-2 border-[var(--color-ink)] bg-white px-3 py-0.5 text-caption font-semibold text-[var(--color-ink)]">
              {meta}
            </span>
          )}
        </div>

        <div className="flex items-end justify-between gap-4">
          <div className="max-w-[80%]">
            <h3 className="text-h3 text-white">{course.title}</h3>
            <p className="mt-1.5 line-clamp-2 text-caption text-white/75">
              {course.shortDescription}
            </p>
          </div>
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-[var(--color-ink)] bg-[var(--color-accent)] text-[var(--color-ink)] transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:translate-x-1 group-hover:-translate-y-1">
            <Icon name={onOpen ? "plus" : "arrowUpRight"} className="h-5 w-5" strokeWidth={2} />
          </span>
        </div>
      </div>
    </div>
  );

  if (onOpen) {
    return (
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Подробнее о курсе «${course.title}»`}
        className="block w-full [perspective:1200px]"
      >
        {inner}
      </button>
    );
  }

  return (
    <Link href={`/courses/${course.slug}`} className="block [perspective:1200px]">
      {inner}
    </Link>
  );
}
