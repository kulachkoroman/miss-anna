import type { Variants, Transition } from "framer-motion";

/**
 * Единая система движения сайта.
 *
 * Правило: любая анимация берётся отсюда, а не пишется на месте.
 * Тогда весь сайт двигается в одном ритме, и скорость правится в одной точке.
 *
 * Системную настройку «уменьшить движение» гасит <MotionProvider> в layout —
 * здесь об этом думать не нужно.
 */

/** Кривые. out-expo — основная: быстрый старт, мягкая остановка. */
type Bezier = [number, number, number, number];

export const EASE: Record<"out" | "soft" | "inOut", Bezier> = {
  out: [0.22, 1, 0.36, 1],
  soft: [0.32, 0.72, 0, 1],
  inOut: [0.65, 0, 0.35, 1],
};

/** Длительности. Держим короткими: «плавно» ≠ «медленно». */
export const DURATION = {
  fast: 0.28,
  base: 0.55,
  slow: 0.8,
} as const;

export const transition: Transition = {
  duration: DURATION.base,
  ease: EASE.out,
};

/**
 * Когда запускать появление при прокрутке. margin растягивает «экран» вниз
 * на 15%: блок начинает проявляться чуть раньше, чем въедет в экран, —
 * при быстрой прокрутке не видно пустых мест на месте ещё не появившихся блоков.
 */
export const VIEWPORT = { once: true, amount: 0.1, margin: "0px 0px 15% 0px" } as const;

type Direction = "up" | "down" | "left" | "right" | "none";

const offset: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 24 },
  down: { x: 0, y: -24 },
  left: { x: 32, y: 0 },
  right: { x: -32, y: 0 },
  none: { x: 0, y: 0 },
};

/** Появление со сдвигом. Базовый приём всего сайта. */
export function reveal(direction: Direction = "up", distance?: number): Variants {
  const base = offset[direction];
  const scale = distance != null && base.x + base.y !== 0 ? distance / Math.abs(base.x || base.y) : 1;

  return {
    hidden: { opacity: 0, x: base.x * scale, y: base.y * scale },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration: DURATION.base, ease: EASE.out },
    },
  };
}

/** Появление с лёгким приближением — для карточек и картинок. */
export const revealScale: Variants = {
  hidden: { opacity: 0, scale: 0.94, y: 16 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: DURATION.slow, ease: EASE.out },
  },
};

/**
 * Родитель для эффекта «друг за другом».
 * Дети должны использовать staggerItem и НЕ задавать свой delay.
 */
export function staggerContainer(stagger = 0.08, delayChildren = 0): Variants {
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren: stagger, delayChildren },
    },
  };
}

/** Ребёнок внутри staggerContainer. */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.base, ease: EASE.out },
  },
};


