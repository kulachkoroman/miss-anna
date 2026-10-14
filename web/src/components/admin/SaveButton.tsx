"use client";

import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";

/** Кнопка «Сохранить» с состоянием: «Сохраняю…», затем на пару секунд «Сохранено ✓». */
export default function SaveButton({ label = "Сохранить" }: { label?: string }) {
  const { pending } = useFormStatus();
  const [saved, setSaved] = useState(false);
  const wasPending = useRef(false);

  useEffect(() => {
    if (wasPending.current && !pending) {
      setSaved(true);
      const t = setTimeout(() => setSaved(false), 2500);
      wasPending.current = false;
      return () => clearTimeout(t);
    }
    if (pending) wasPending.current = true;
  }, [pending]);

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full border-2 border-[var(--color-ink)] bg-[var(--color-primary)] px-4 py-1.5 text-sm font-bold text-white shadow-hard-sm transition-[translate,box-shadow] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none disabled:opacity-60"
    >
      {pending ? "Сохраняю…" : saved ? "Сохранено ✓" : label}
    </button>
  );
}
