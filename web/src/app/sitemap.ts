import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

/**
 * Карта сайта для поисковиков.
 *
 * Страницы курсов подтягиваются из базы: добавила Анна новый курс —
 * он появится в карте сам, руками ничего дописывать не нужно.
 *
 * Личный кабинет и админка сюда не попадают намеренно: они закрыты
 * авторизацией, индексировать там нечего.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: "monthly", priority: 1 },
    { url: `${baseUrl}/about`, changeFrequency: "yearly", priority: 0.8 },
    { url: `${baseUrl}/courses`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/classes`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/contacts`, changeFrequency: "yearly", priority: 0.6 },
    { url: `${baseUrl}/offer`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${baseUrl}/privacy`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const courses = await prisma.course.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
  });

  return [
    ...staticPages,
    ...courses.map((course) => ({
      url: `${baseUrl}/courses/${course.slug}`,
      lastModified: course.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
