"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

/**
 * Число, которое «докручивается» до значения, когда доезжает до экрана.
 *
 * Считает один раз. Если в системе включено «уменьшить движение» —
 * показывает конечное значение сразу, без анимации.
 */
export default function Counter({
  value,
  prefix = "",
  suffix = "",
  duration = 1.3,
  className,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(0);

  /** Дробные значения вроде 4,5 показываем с одним знаком после запятой. */
  const decimals = Number.isInteger(value) ? 0 : 1;

  useEffect(() => {
    if (!inView || reduced) return;

    let frame = 0;
    const start = performance.now();

    function tick(now: number) {
      const progress = Math.min((now - start) / (duration * 1000), 1);
      /* та же кривая, что у остальных анимаций: быстро стартует, мягко тормозит */
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(value * eased);

      if (progress < 1) frame = requestAnimationFrame(tick);
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value, duration, reduced]);

  /* При отключённых анимациях сразу показываем конечное значение. */
  const shown = reduced ? value : display;

  return (
    <span ref={ref} className={className}>
      {prefix}
      {shown.toLocaleString("ru-RU", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}
