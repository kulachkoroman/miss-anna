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
};

export default nextConfig;
