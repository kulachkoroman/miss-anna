"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import Icon from "@/components/ui/Icon";
import { EASE } from "@/lib/motion";

type Page = { src: string; width: number; height: number; alt: string };

/**
 * Диплом: две страницы веером, по клику — просмотр во весь экран.
 *
 * Серийный и регистрационный номера бланка размыты ещё в файле:
 * для доверия хватает вуза, специальности и имени, а номера лучше
 * не раздавать всем подряд.
 */
export default function DiplomaViewer({ pages }: { pages: readonly Page[] }) {
  const [open, setOpen] = useState<number | null>(null);

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback(
    (delta: number) =>
      setOpen((current) =>
        current === null ? current : (current + delta + pages.length) % pages.length
      ),
    [pages.length]
  );

  /* Esc закрывает, стрелки листают; прокрутка страницы под окном блокируется. */
  useEffect(() => {
    if (open === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    }
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close, step]);

  return (
    <>
      {/* Веер из двух страниц */}
      <div className="relative mx-auto flex h-[22rem] w-full max-w-md items-center justify-center sm:h-[26rem]">
        {pages.map((page, i) => (
          <button
            key={page.src}
            type="button"
            onClick={() => setOpen(i)}
            aria-label={`Открыть: ${page.alt}`}
            className={clsx(
              "group absolute w-[52%] overflow-hidden rounded-xl bg-white p-1.5 shadow-lift ring-1 ring-black/5",
              "transition-transform duration-500 ease-[var(--ease-out-expo)] hover:z-20 hover:scale-[1.04]",
              i === 0
                ? "left-[6%] top-[6%] -rotate-6 hover:-rotate-3"
                : "right-[6%] top-[14%] z-10 rotate-[5deg] hover:rotate-2"
            )}
          >
            <Image
              src={page.src}
              alt={page.alt}
              width={page.width}
              height={page.height}
              sizes="(max-width: 640px) 50vw, 240px"
              className="h-auto w-full rounded-lg"
            />
            <span className="absolute inset-0 flex items-center justify-center bg-[var(--color-primary-deep)]/0 transition-colors duration-300 group-hover:bg-[var(--color-primary-deep)]/25">
              <span className="flex h-11 w-11 scale-75 items-center justify-center rounded-full bg-white text-[var(--color-ink)] opacity-0 shadow-lift transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
                <Icon name="plus" className="h-5 w-5" strokeWidth={2.2} />
              </span>
            </span>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {open !== null && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Просмотр диплома"
            className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0b0818]/85 p-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={close}
          >
            <motion.div
              key={open}
              className="relative max-h-full"
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35, ease: EASE.out }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={pages[open].src}
                alt={pages[open].alt}
                width={pages[open].width}
                height={pages[open].height}
                sizes="(max-width: 768px) 92vw, 640px"
                className="h-auto max-h-[86svh] w-auto rounded-xl shadow-2xl"
              />
              <p className="mt-3 text-center text-caption text-white/60">
                {open + 1} / {pages.length} · номера бланка скрыты
              </p>
            </motion.div>

            <button
              type="button"
              onClick={close}
              aria-label="Закрыть"
              className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/20 transition-colors hover:bg-white/20"
            >
              <Icon name="plus" className="h-5 w-5 rotate-45" strokeWidth={2.2} />
            </button>

            {pages.length > 1 && (
              <>
                <NavButton
                  side="left"
                  onClick={(e) => {
                    e.stopPropagation();
                    step(-1);
                  }}
                />
                <NavButton
                  side="right"
                  onClick={(e) => {
                    e.stopPropagation();
                    step(1);
                  }}
                />
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function NavButton({
  side,
  onClick,
}: {
  side: "left" | "right";
  onClick: (e: React.MouseEvent) => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === "left" ? "Предыдущая страница" : "Следующая страница"}
      className={clsx(
        "absolute top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/20 transition-colors hover:bg-white/20",
        side === "left" ? "left-3 sm:left-6" : "right-3 sm:right-6"
      )}
    >
      <Icon name="arrowRight" className={clsx("h-5 w-5", side === "left" && "rotate-180")} />
    </button>
  );
}
