import clsx from "clsx";

/**
 * Бегущая строка.
 *
 * Узкая полоса движения между крупными блоками: разбивает страницу
 * и не даёт ей выглядеть однородной лентой карточек.
 *
 * Движется всегда, в том числе под курсором. Полностью отключается,
 * только если в системе выбрано «уменьшить движение».
 */
export default function Marquee({
  items,
  /** Длительность одного полного прохода. Больше значение — медленнее. */
  duration = 38,
  className,
}: {
  items: string[];
  duration?: number;
  className?: string;
}) {
  if (items.length === 0) return null;

  /* Дублируем список: пока первая копия уходит влево, вторая занимает её место. */
  const track = [...items, ...items];

  return (
    <div
      className={clsx(
        "relative flex overflow-hidden",
        /* растушёвка по краям, чтобы строка не обрубалась резко */
        "[mask-image:linear-gradient(to_right,transparent,black_7%,black_93%,transparent)]",
        className
      )}
    >
      <div
        className="animate-marquee flex w-max shrink-0 items-center gap-7 pr-7"
        style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}
      >
        {track.map((item, i) => (
          <span
            key={`${item}-${i}`}
            aria-hidden={i >= items.length}
            className="flex items-center gap-7 whitespace-nowrap"
          >
            <span className="font-display text-[0.8125rem] font-bold tracking-[-0.01em] sm:text-[0.875rem]">
              {item}
            </span>
            <span aria-hidden className="text-[0.75rem]">
              ✦
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
