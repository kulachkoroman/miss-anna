import type { Metadata } from "next";
import { Caveat, Inter, Unbounded } from "next/font/google";
import "./globals.css";
import MotionProvider from "@/components/ui/MotionProvider";
import { COURSE_SEO } from "@/content/course";

/*
  Inter — тот же шрифт, что на лендинге Давида. Вариативный: любые
  начертания от обычного до сверхжирного без отдельных файлов.
*/
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

/*
  Unbounded — широкий гротеск для крупных заголовков (h1, h2), задаёт
  характер нового стиля. Caveat — рукописный, для пометок «на полях».
*/
const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const SITE_NAME = COURSE_SEO.title;
const DESCRIPTION = COURSE_SEO.description;

/**
 * metadataBase нужен, чтобы ссылки на картинку превью были абсолютными.
 * Без него при отправке ссылки в мессенджер превью не подтянется.
 * Адрес берётся из .env — на боевом домене его нужно заменить.
 */
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: SITE_NAME,
    template: "%s — Анна Паршукова",
  },
  description: DESCRIPTION,
  applicationName: "Русичка Анна Евгеньевна",
  authors: [{ name: "Анна Паршукова" }],
  keywords: [
    "итоговое сочинение",
    "бесплатный курс итоговое сочинение",
    "подготовка к итоговому сочинению",
    "итоговое сочинение 11 класс",
    "литературный аргумент",
  ],
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ru"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${unbounded.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-[var(--color-bg)] text-[var(--color-ink)]">
        {/*
          Ссылка для тех, кто перемещается по сайту с клавиатуры: позволяет
          перепрыгнуть меню и сразу попасть к содержимому. Видна только
          при переходе на неё клавишей Tab.
        */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-[var(--color-primary)] focus:px-5 focus:py-3 focus:font-semibold focus:text-white"
        >
          Перейти к содержимому
        </a>

        {/* Один переключатель движения на весь сайт: уважает системную
            настройку «уменьшить движение». */}
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
