"use client";

import { useState } from "react";
import type { Course } from "@prisma/client";
import CourseCard from "@/components/courses/CourseCard";
import CourseQuickView, { type CourseQuickInfo } from "@/components/courses/CourseQuickView";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";

/**
 * Каталог курсов.
 *
 * Держит состояние открытого фрейма: клик по карточке показывает подробности
 * поверх страницы, список при этом не теряется и не перезагружается.
 */

export type CatalogItem = {
  course: Course;
  quick: CourseQuickInfo;
  /** Короткая строка объёма курса для угла карточки. */
  meta: string;
};

export default function CoursesCatalog({ items }: { items: CatalogItem[] }) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  const openCourse = items.find((item) => item.quick.slug === openSlug)?.quick ?? null;

  return (
    <>
      <RevealGroup stagger={0.12} className="grid gap-7 sm:grid-cols-2">
        {items.map((item) => (
          <RevealItem key={item.quick.slug}>
            <CourseCard
              course={item.course}
              meta={item.meta}
              onOpen={() => setOpenSlug(item.quick.slug)}
            />
          </RevealItem>
        ))}
      </RevealGroup>

      <CourseQuickView course={openCourse} onClose={() => setOpenSlug(null)} />
    </>
  );
}
