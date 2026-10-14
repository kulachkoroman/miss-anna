/**
 * КОНТЕНТ САЙТА: Анна, контакты, реквизиты.
 *
 * Тексты курса — в content/course.ts. Здесь — то, что про саму Анну.
 * Источник фактов и цитат — её ответы на бриф («Документ (2).docx»,
 * сентябрь 2026) и диплом. Цитаты — её словами, правлена только
 * пунктуация и длина. Ничего сверх этого не добавлено.
 */

import type { BrandId } from "@/components/ui/BrandIcon";

/* ============================================================
   КОНТАКТЫ
   ============================================================ */

export type Messenger = {
  id: "telegram" | "vk" | "max";
  brand: BrandId;
  label: string;
  /** Что показать под названием: ник или адрес. */
  handle: string;
  href: string;
};

/** Куда писать. Telegram — основной канал, его же Анна указывает в описании канала. */
export const MESSENGERS: Messenger[] = [
  {
    id: "telegram",
    brand: "telegram",
    label: "Telegram",
    handle: "@anyaparshukova_support",
    href: "https://t.me/anyaparshukova_support",
  },
  {
    id: "vk",
    brand: "vk",
    label: "ВКонтакте",
    handle: "vk.ru/anya_parshukova",
    href: "https://vk.ru/anya_parshukova",
  },
  {
    id: "max",
    brand: "max",
    label: "Max",
    handle: "Анна Паршукова",
    href: "https://max.ru/u/f9LHodD0cOJhTYLMC73bI21PpCvWcHCJ-_Aa8whn7k0DDjPPpx13T0RF4cs",
  },
];

export const TELEGRAM = MESSENGERS[0];

/** Блог Анны. Название во всех соцсетях — «Русичка Анна Евгеньевна». */
export const BLOG_NAME = "Русичка Анна Евгеньевна";

export type BlogLink = {
  brand: BrandId;
  label: string;
  handle: string;
  href: string;
};

export const BLOG_LINKS: BlogLink[] = [
  { brand: "telegram", label: "Telegram-канал", handle: "@anya_parshukova", href: "https://t.me/anya_parshukova" },
  { brand: "youtube", label: "YouTube", handle: "@anyaparshukova", href: "https://youtube.com/@anyaparshukova" },
  { brand: "tiktok", label: "TikTok", handle: "@anyaparshukova", href: "https://www.tiktok.com/@anyaparshukova" },
];

/** Ссылка на поддержку: Telegram. Используется в личном кабинете. */
export function supportHref(): string {
  return TELEGRAM.href;
}

/** true — ссылка ведёт наружу, нужен target="_blank". */
export function isExternal(href: string): boolean {
  return /^https?:\/\//.test(href);
}

/* ============================================================
   РЕКВИЗИТЫ — для политики и подвала
   ============================================================ */

export const LEGAL = {
  fullName: "Паршукова Анна Евгеньевна",
  /** Творительный падеж: «… самозанятой Паршуковой Анной Евгеньевной». */
  fullNameInstrumental: "Паршуковой Анной Евгеньевной",
  status: "Самозанятая (плательщик налога на профессиональный доход)",
  statusShort: "Самозанятая",
  inn: "253911839869",
  /** TODO(Анна): домен сайта пока не выбран. */
  domain: null as string | null,
};

/* ============================================================
   ОБ АННЕ — блок «Кто ведёт курс» на главной
   ============================================================ */

/** Год, с которого Анна без перерыва готовит к экзаменам. */
export const PRACTICE_SINCE = 2015;

/** Годы, когда Анна сдала ЕГЭ по русскому на 100 баллов. */
export const HUNDRED_YEARS = [2015, 2024, 2025];

export const ABOUT = {
  greeting: "Привет, я Анна",
  role: "Преподаю русский язык и литературу и веду блог «Русичка Анна Евгеньевна».",
  /** Два коротких абзаца от первого лица — пересказ её ответов на бриф. */
  story: [
    `Готовлю ребят к экзаменам с ${PRACTICE_SINCE} года. Четыре года работала в обычной школе во Владивостоке ` +
      "и ушла: если бы там нужно было только учить детей, я бы осталась, но слишком много сил уходило " +
      "на бумажную работу. Теперь занимаюсь только любимым делом.",
    "Меня раздражает, когда школьников пугают экзаменом и заставляют зубрить шаблонные фразы для сочинения. " +
      "Чаще всего баллы теряют не из-за слов, а потому что не поняли текст. Поэтому в этом курсе мы не заучиваем, " +
      "а учимся читать и объяснять свою мысль.",
  ],
  /** Её фраза о подготовке — дословно, без «к ЕГЭ» в конце первого предложения. */
  quote:
    "Нужно поймать общий вайб и с кайфом готовиться. Подготовка должна быть в удовольствие, " +
    "чтобы не отбить интерес к учёбе.",
  facts: [
    { value: "3×100", label: `баллов на ЕГЭ — в ${HUNDRED_YEARS.join(", ")}` },
    { value: `с ${PRACTICE_SINCE}`, label: "готовлю к экзаменам без перерывов" },
    { value: "все", label: "мои ученики сдали итоговое сочинение с первого раза" },
  ],
};
