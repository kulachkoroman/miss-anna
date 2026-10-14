"use client";

import { motion, type Variants } from "framer-motion";
import { VIEWPORT } from "@/lib/motion";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

/* Кружок с номером проявляется на своём месте на пунктирной линии —
   не едет вместе с карточкой, поэтому не «зависает» рядом с линией. */
const dot: Variants = {
  hidden: { opacity: 0, scale: 0.6 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: EASE_OUT } },
};

/* Карточка мягко выезжает сбоку, чуть позже кружка. */
const card: Variants = {
  hidden: { opacity: 0, x: 18 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE_OUT, delay: 0.08 } },
};

/** Шаг маршрута: номер на линии + карточка урока. Появляются вместе, плавно. */
export default function RouteStep({
  number,
  tone = "plain",
  children,
}: {
  number: React.ReactNode;
  /** accent — первый урок (розовый), finish — финиш маршрута (фиолетовый с галочкой). */
  tone?: "plain" | "accent" | "finish";
  children: React.ReactNode;
}) {
  const toneClass =
    tone === "accent"
      ? "bg-[var(--color-accent)] text-[var(--color-ink)]"
      : tone === "finish"
        ? "bg-[var(--color-primary)] text-white"
        : "bg-white text-[var(--color-ink)]";

  return (
    <motion.li
      className="relative pb-6 pl-16 last:pb-0 sm:pl-20"
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
    >
      <motion.span
        variants={dot}
        className={`absolute left-0 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border-2 border-[var(--color-ink)] font-display font-bold sm:h-[3.25rem] sm:w-[3.25rem] sm:text-lg ${toneClass}`}
      >
        {number}
      </motion.span>
      <motion.div variants={card}>{children}</motion.div>
    </motion.li>
  );
}
