import { ImageResponse } from "next/og";
import { join } from "node:path";
import { readFile } from "node:fs/promises";

/**
 * Картинка превью для ссылок.
 *
 * Когда ссылку на сайт кидают в Telegram, ВКонтакте или отправляют в поиск,
 * подтягивается это изображение. Слева — заголовок с главной, справа —
 * Анна без фона на фирменной арке, как на первом экране сайта.
 *
 * Важно: движок требует явный display у любого блока с несколькими детьми,
 * иначе картинка не соберётся. Фото — PNG: WebP движок не читает.
 */

export const alt = "Анна Паршукова — подготовка к ЕГЭ и ОГЭ по русскому языку";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/* Файл не зависит от запроса — читаем один раз при загрузке модуля. */
const photo = await readFile(join(process.cwd(), "public/images/og-anna.png"), "base64");
const photoSrc = `data:image/png;base64,${photo}`;

/* Inter — тот же шрифт, что на сайте. Полные файлы: латиница и кириллица вместе,
   иначе движок берёт кириллицу не того начертания. Лицензия — SIL OFL. */
const fontDir = join(process.cwd(), "assets/fonts");
const fonts = [
  { name: "Inter", data: await readFile(join(fontDir, "Inter-Medium.woff")), weight: 500 as const, style: "normal" as const },
  { name: "Inter", data: await readFile(join(fontDir, "Inter-ExtraBold.woff")), weight: 800 as const, style: "normal" as const },
];

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "#fffaf3",
          color: "#17142a",
          fontFamily: "Inter",
        }}
      >
        {/* Арка за спиной */}
        <div
          style={{
            position: "absolute",
            right: 90,
            bottom: 0,
            width: 380,
            height: 470,
            display: "flex",
            borderTopLeftRadius: 190,
            borderTopRightRadius: 190,
            background: "linear-gradient(135deg, #1f1747 0%, #4a3aff 60%, #6a45f0 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 380,
            top: 110,
            width: 110,
            height: 110,
            display: "flex",
            borderRadius: 999,
            border: "4px solid #ff8fd4",
          }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element -- next/og рисует обычный img */}
        <img
          src={photoSrc}
          alt=""
          height={600}
          style={{ position: "absolute", right: 110, bottom: 0 }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "64px 0 60px 68px",
            width: 700,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 20,
              fontWeight: 800,
              letterSpacing: 3,
              color: "#4a3aff",
            }}
          >
            РУССКИЙ ЯЗЫК · ЕГЭ И ОГЭ
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 72, fontWeight: 800, letterSpacing: -2.5, lineHeight: 1.02 }}>
              Подготовка
            </div>
            <div style={{ display: "flex", fontSize: 72, fontWeight: 800, letterSpacing: -2.5, lineHeight: 1.02 }}>
              к ЕГЭ и ОГЭ
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 72,
                fontWeight: 800,
                letterSpacing: -2.5,
                lineHeight: 1.02,
                color: "#4a3aff",
              }}
            >
              по русскому языку
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 28, fontWeight: 800 }}>Анна Паршукова</div>
            <div style={{ display: "flex", marginTop: 8, fontSize: 24, fontWeight: 500, color: "#57536b" }}>
              Трижды 100 баллов на ЕГЭ · готовлю с 2015 года
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts }
  );
}
