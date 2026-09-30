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
        "inline-flex items-center gap-2.5 rounded-full px-6 py-3 font-semibold",
        "transition-all duration-300 ease-[var(--ease-out-expo)] disabled:opacity-60",
        completed
          ? "border-2 border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary)] hover:bg-white"
          : "bg-[var(--color-primary)] text-white shadow-primary hover:-translate-y-0.5 hover:bg-[var(--color-primary-dark)]"
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
