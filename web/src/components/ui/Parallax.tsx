"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

/**
 * Сдвиг содержимого при прокрутке страницы.
 *
 * Внешний блок остаётся на месте и служит точкой отсчёта, двигается только
 * внутренний. Если бы измерялся сам движущийся элемент, расчёт бы «плыл».
 *
 * Применяется к фоновым изображениям: фон уезжает медленнее текста,
 * отчего первый экран кажется объёмным. При системной настройке
 * «уменьшить движение» сдвиг отключается.
 */
export default function Parallax({
  children,
  /** На сколько пикселей уезжает содержимое за весь проход. */
  distance = 90,
  className,
  innerClassName,
}: {
  children: React.ReactNode;
  distance?: number;
  className?: string;
  innerClassName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    /* от «верх блока у верха экрана» до «низ блока у верха экрана» */
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : distance]);

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }} className={innerClassName}>
        {children}
      </motion.div>
    </div>
  );
}
