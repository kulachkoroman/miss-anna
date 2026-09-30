"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Один переключатель движения на весь сайт.
 *
 * reducedMotion="user" — если в системе включено «уменьшить движение»,
 * Framer Motion сам гасит все сдвиги и масштабирования, оставляя прозрачность.
 * Это требование доступности: части людей от анимаций становится физически плохо.
 */
export default function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
