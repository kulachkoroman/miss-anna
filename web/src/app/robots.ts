import type { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

/**
 * Правила для поисковых роботов.
 *
 * Закрываем личный кабинет, админку и служебные маршруты: там нет
 * публичного содержимого, а ссылки на видео и файлы вообще не должны
 * попадать в поисковую выдачу.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/cabinet", "/admin", "/api"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
