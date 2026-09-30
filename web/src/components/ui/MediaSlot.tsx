import Image from "next/image";
import clsx from "clsx";
import type { MediaSpec } from "@/content/media";

/**
 * Слот под изображение.
 *
 * Пока в реестре media.ts у картинки `src: null` — рисует фирменную заглушку.
 * Как только путь к файлу прописан, слот сам подставляет фото: кадрирование,
 * затемнение под текст и адаптив уже настроены и не требуют правок вёрстки.
 */

type Overlay = "none" | "bottom" | "full" | "side";

const overlays: Record<Overlay, string> = {
  none: "",
  /** Затемнение снизу — под подпись поверх картинки. */
  bottom: "bg-gradient-to-t from-black/75 via-black/25 to-transparent",
  /** Общее затемнение — когда поверх идёт крупный текст. */
  full: "bg-black/45",
  /** Затемнение слева — для баннера с заголовком в левой части. */
  side: "bg-gradient-to-r from-black/80 via-black/45 to-transparent sm:via-black/25",
};

const focusToPosition: Record<NonNullable<MediaSpec["focus"]>, string> = {
  center: "center",
  top: "top",
  bottom: "bottom",
  left: "left",
  right: "right",
};

export default function MediaSlot({
  spec,
  overlay = "none",
  preload = false,
  sizes = "100vw",
  devHint = true,
  className,
  imageClassName,
  children,
}: {
  spec: MediaSpec;
  overlay?: Overlay;
  /** true — для картинки на первом экране: грузится раньше остальных. */
  preload?: boolean;
  sizes?: string;
  /** false — не показывать в режиме разработки подпись с нужным размером. */
  devHint?: boolean;
  className?: string;
  imageClassName?: string;
  /** Контент поверх картинки. */
  children?: React.ReactNode;
}) {
  const hasImage = Boolean(spec.src);
  /*
    Если снаружи слот уже спозиционирован (absolute/fixed — например, обложка
    на всю карточку), своё relative не добавляем. Иначе два класса позиции
    спорят, побеждает relative, и слот схлопывается в полоску нулевой высоты —
    так раньше пропадали обложки курсов.
  */
  const positioned = /(^|\s)(absolute|fixed|sticky)(\s|$)/.test(className ?? "");
  const objectPosition = focusToPosition[spec.focus ?? "center"];

  return (
    <div className={clsx(!positioned && "relative", "isolate overflow-hidden", className)}>
      {hasImage ? (
        <Image
          src={spec.src as string}
          alt={spec.alt}
          fill
          preload={preload}
          sizes={sizes}
          className={clsx("object-cover", imageClassName)}
          style={{ objectPosition }}
        />
      ) : (
        <Placeholder spec={spec} devHint={devHint} />
      )}

      {overlay !== "none" && (
        <div aria-hidden className={clsx("pointer-events-none absolute inset-0", overlays[overlay])} />
      )}

      {children && <div className="relative h-full">{children}</div>}
    </div>
  );
}

/**
 * Заглушка: фирменный градиент со световыми пятнами и зернистостью.
 * Выглядит как осознанный фон, а не как «картинка не загрузилась».
 */
function Placeholder({ spec, devHint }: { spec: MediaSpec; devHint: boolean }) {
  return (
    <div aria-hidden className="absolute inset-0">
      <div className="absolute inset-0 bg-brand-gradient" />
      <div
        className="absolute inset-0 opacity-80 [background:radial-gradient(circle_at_18%_12%,rgba(255,255,255,0.24),transparent_46%),radial-gradient(circle_at_88%_8%,rgba(255,143,212,0.42),transparent_44%),radial-gradient(circle_at_70%_95%,rgba(122,79,232,0.5),transparent_50%)]"
      />
      <div className="texture-grain absolute inset-0" />

      {/* Подсказка о нужном размере — только в режиме разработки.
          На опубликованном сайте её не видно. */}
      {devHint && process.env.NODE_ENV !== "production" && (
        <div className="absolute inset-0 flex items-end justify-start p-4">
          <span className="rounded-full bg-black/35 px-3 py-1 font-mono text-[11px] text-white/70 backdrop-blur-sm">
            слот {spec.width}×{spec.height}
          </span>
        </div>
      )}
    </div>
  );
}
