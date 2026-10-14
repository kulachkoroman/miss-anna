import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /*
      Современные форматы: браузер получает AVIF или WebP вместо JPEG.
      На фотографиях это обычно вдвое меньший вес при том же качестве —
      заметно на телефоне с медленным интернетом.
    */
    formats: ["image/avif", "image/webp"],
  },
  /*
    Дополнительные файлы к урокам (PDF и т. п.) загружаются через Server Action,
    у которого по умолчанию лимит 1 МБ. 10 МБ — столько же пропускает proxy
    на /admin. Видео грузится отдельным маршрутом и этим лимитом не ограничено.
  */
  experimental: {
    serverActions: { bodySizeLimit: "10mb" },
  },
  /*
    Сайт стал одностраничным лендингом бесплатного курса (октябрь 2026).
    Старые адреса ведут на главную, чтобы сохранённые ссылки не упирались в 404.
  */
  async redirects() {
    return ["/about", "/classes", "/contacts", "/courses", "/courses/:slug"].map((source) => ({
      source,
      destination: "/",
      permanent: false,
    }));
  },
};

export default nextConfig;
