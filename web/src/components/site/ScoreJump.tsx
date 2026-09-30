"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { EASE } from "@/lib/motion";

/**
 * Шкала 0–100 баллов: точка «было» и точка «стало», между ними —
 * полоса, которая прорастает при появлении на экране.
 * Наглядно показывает скачок результата без лишних слов.
 */
export default function ScoreJump({
  before,
  after,
  beforeLabel = "Пробник",
  afterLabel = "Результат",
}: {
  before: number;
  after: number;
  beforeLabel?: string;
  afterLabel?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });

  return (
    <div ref={ref} className="relative mt-6 pb-2 pt-14">
      {/* Подписи над точками */}
      <Marker value={before} label={beforeLabel} tone="muted" shown={inView} delay={0.1} />
      <Marker value={after} label={afterLabel} tone="accent" shown={inView} delay={1.1} />

      {/* Дорожка */}
      <div className="relative h-2.5 rounded-full bg-white/10">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-white/25"
          initial={{ width: 0 }}
          animate={{ width: inView ? `${before}%` : 0 }}
          transition={{ duration: 0.9, ease: EASE.out }}
        />
        <motion.div
          className="absolute inset-y-0 rounded-full bg-[var(--color-accent)]"
          style={{ left: `${before}%` }}
          initial={{ width: 0 }}
          animate={{ width: inView ? `${after - before}%` : 0 }}
          transition={{ duration: 1.1, ease: EASE.out, delay: 0.7 }}
        />
      </div>

      {/* Шкала */}
      <div className="mt-3 flex justify-between text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-white/35">
        <span>0</span>
        <span>50</span>
        <span>100 баллов</span>
      </div>
    </div>
  );
}

function Marker({
  value,
  label,
  tone,
  shown,
  delay,
}: {
  value: number;
  label: string;
  tone: "muted" | "accent";
  shown: boolean;
  delay: number;
}) {
  return (
    <motion.div
      className="absolute top-0 -translate-x-1/2 text-center"
      style={{ left: `${value}%` }}
      initial={{ opacity: 0, y: 8 }}
      animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
      transition={{ duration: 0.5, ease: EASE.out, delay }}
    >
      <p
        className={
          tone === "accent"
            ? "font-display text-2xl font-extrabold leading-none tracking-[-0.03em] text-[var(--color-accent)]"
            : "font-display text-2xl font-extrabold leading-none tracking-[-0.03em] text-white/70"
        }
      >
        {value}
      </p>
      <p className="mt-1 whitespace-nowrap text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-white/45">
        {label}
      </p>
    </motion.div>
  );
}
