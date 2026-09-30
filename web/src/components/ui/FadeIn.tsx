"use client";

import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Старый компонент появления. Оставлен, чтобы уже сделанные страницы
 * продолжали работать без правок — внутри это тот же <Reveal>.
 *
 * В новом коде используй <Reveal> напрямую: он умеет направление,
 * масштаб и работу в группе.
 */
export default function FadeIn({
  children,
  delay = 0,
  y = 24,
  className,
  once = true,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
}) {
  return (
    <Reveal from="up" distance={y} delay={delay} once={once} className={className}>
      {children}
    </Reveal>
  );
}
