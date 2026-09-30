"use client";

import { motion, useReducedMotion } from "framer-motion";
import { DURATION, EASE } from "@/lib/motion";

/**
 * Круговой индикатор прогресса.
 *
 * Дуга дорисовывается при появлении: процент читается как достижение,
 * а не как очередная цифра в строке. При системной настройке
 * «уменьшить движение» сразу показывается конечное состояние.
 */
export default function ProgressRing({
  percent,
  size = 116,
  strokeWidth = 9,
  label,
}: {
  percent: number;
  size?: number;
  strokeWidth?: number;
  /** Подпись под числом. */
  label?: string;
}) {
  const reduced = useReducedMotion();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const safePercent = Math.min(100, Math.max(0, percent));

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className="stroke-[var(--color-primary)]/12"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className="stroke-[var(--color-primary)]"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: reduced ? circumference * (1 - safePercent / 100) : circumference }}
          animate={{ strokeDashoffset: circumference * (1 - safePercent / 100) }}
          transition={{ duration: reduced ? 0 : DURATION.slow, ease: EASE.out, delay: 0.15 }}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-h3 leading-none text-[var(--color-ink)]">{safePercent}%</span>
        {label && (
          <span className="mt-1 text-[11px] uppercase tracking-wider text-[var(--color-ink-muted)]">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
