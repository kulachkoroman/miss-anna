"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import clsx from "clsx";
import Icon from "@/components/ui/Icon";
import { toggleLessonProgressAction } from "@/lib/actions/cabinet";

/**
 * Отметка о прохождении урока.
 *
 * Состояние переключается: отмеченный урок можно снять обратно, если
 * человек решил вернуться к теме.
 */
export default function CompleteButton({
  lessonId,
  completed,
}: {
  lessonId: string;
  completed: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await toggleLessonProgressAction(lessonId, !completed);
          router.refresh();
        })
      }
      className={clsx(
        "inline-flex items-center gap-2.5 rounded-full border-2 border-[var(--color-ink)] px-6 py-2.5 font-bold",
        "transition-[translate,box-shadow,background-color] duration-150 ease-out disabled:opacity-60",
        completed
          ? "bg-[var(--color-accent-soft)] text-[var(--color-ink)] hover:bg-white"
          : "bg-[var(--color-primary)] text-white shadow-hard hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-hard-sm active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
      )}
    >
      <Icon
        name="check"
        className={clsx("h-5 w-5 transition-transform duration-300", pending && "animate-pulse")}
        strokeWidth={2.6}
      />
      {completed ? "Урок пройден" : "Отметить как пройденный"}
    </button>
  );
}
