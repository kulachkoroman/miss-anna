import type { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

/**
 * Карта сайта для поисковиков. Сайт — одностраничный лендинг бесплатного
 * курса, поэтому в карте главная и политика. Кабинет и админка закрыты
 * авторизацией и сюда не попадают.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: baseUrl, changeFrequency: "monthly", priority: 1 },
    { url: `${baseUrl}/privacy`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
