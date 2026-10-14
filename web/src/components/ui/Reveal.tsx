"use client";

import clsx from "clsx";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { reveal, revealScale, staggerContainer, staggerItem, VIEWPORT } from "@/lib/motion";

type Direction = "up" | "down" | "left" | "right" | "none";

/**
 * Появление блока при прокрутке.
 *
 * <Reveal>            — стандартное появление снизу
 * <Reveal from="left"> — выезд сбоку
 * <Reveal variant="scale"> — с лёгким приближением, для картинок и карточек
 *
 * immediate (первый экран) — анимация на чистом CSS: она стартует, как только
 * браузер нарисовал страницу, не дожидаясь загрузки JavaScript. Через Framer
 * Motion первый экран оставался невидимым до запуска скриптов (на телефоне
 * около двух секунд пустоты).
 */
export function Reveal({
  children,
  from = "up",
  distance,
  delay = 0,
  variant = "slide",
  once = true,
  amount = VIEWPORT.amount,
  immediate = false,
  className,
}: {
  children: ReactNode;
  from?: Direction;
  distance?: number;
  delay?: number;
  variant?: "slide" | "scale";
  once?: boolean;
  amount?: number;
  /** true — анимировать сразу при загрузке, не дожидаясь прокрутки (первый экран). */
  immediate?: boolean;
  className?: string;
}) {
  if (immediate) {
    return (
      <div
        className={clsx(variant === "scale" ? "reveal-now-scale" : "reveal-now", className)}
        style={delay ? { animationDelay: `${delay}s` } : undefined}
      >
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      variants={variant === "scale" ? revealScale : reveal(from, distance)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount, margin: VIEWPORT.margin }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Группа, элементы которой появляются друг за другом.
 * Внутри используй <RevealItem>, свой delay детям не задавай.
 */
export function RevealGroup({
  children,
  stagger = 0.08,
  delayChildren = 0,
  once = true,
  amount = 0.15,
  immediate = false,
  className,
}: {
  children: ReactNode;
  stagger?: number;
  delayChildren?: number;
  once?: boolean;
  amount?: number;
  /** true — анимировать сразу при загрузке, не дожидаясь прокрутки (первый экран). */
  immediate?: boolean;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={staggerContainer(stagger, delayChildren)}
      initial="hidden"
      {...(immediate
        ? { animate: "visible" }
        : { whileInView: "visible", viewport: { once, amount, margin: VIEWPORT.margin } })}
    >
      {children}
    </motion.div>
  );
}

/** Элемент внутри <RevealGroup>. */
export function RevealItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div className={className} variants={staggerItem}>
      {children}
    </motion.div>
  );
}

export default Reveal;
