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
