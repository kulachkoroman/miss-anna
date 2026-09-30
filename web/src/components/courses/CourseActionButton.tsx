"use client";

import Link from "next/link";
import { useFormStatus } from "react-dom";
import { useAuthModal } from "@/components/auth/AuthModalContext";
import { enrollFreeAction } from "@/lib/actions/enrollment";
import { createPaymentAction } from "@/lib/actions/payments";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-full border-2 border-[var(--color-ink)] bg-[var(--color-accent)] px-6 py-3 text-base font-bold text-[var(--color-ink)] shadow-hard transition-[translate,box-shadow] duration-150 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-hard-sm active:translate-x-[4px] active:translate-y-[4px] active:shadow-none disabled:opacity-60 sm:w-auto"
    >
      {pending ? "Секунду…" : label}
    </button>
  );
}

export default function CourseActionButton({
  courseSlug,
  isFree,
  isAuthenticated,
  isEnrolled,
}: {
  courseSlug: string;
  isFree: boolean;
  isAuthenticated: boolean;
  isEnrolled: boolean;
}) {
  const { openLogin } = useAuthModal();
  const label = isFree ? "Начать бесплатно" : "Купить курс";

  if (isEnrolled) {
    return (
      <Link
        href={`/cabinet/courses/${courseSlug}`}
        className="inline-flex w-full items-center justify-center rounded-full border-2 border-[var(--color-ink)] bg-[var(--color-primary)] px-6 py-3 text-base font-bold text-white shadow-hard transition-[translate,box-shadow] duration-150 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-hard-sm active:translate-x-[4px] active:translate-y-[4px] active:shadow-none sm:w-auto"
      >
        Перейти к курсу
      </Link>
    );
  }

  if (!isAuthenticated) {
    return (
      <button
        type="button"
        onClick={() => openLogin({ type: isFree ? "enroll" : "pay", courseSlug })}
        className="w-full rounded-full border-2 border-[var(--color-ink)] bg-[var(--color-accent)] px-6 py-3 text-base font-bold text-[var(--color-ink)] shadow-hard transition-[translate,box-shadow] duration-150 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-hard-sm active:translate-x-[4px] active:translate-y-[4px] active:shadow-none sm:w-auto"
      >
        {label}
      </button>
    );
  }

  const action = isFree
    ? enrollFreeAction.bind(null, courseSlug)
    : createPaymentAction.bind(null, courseSlug);

  return (
    <form action={action}>
      <SubmitButton label={label} />
    </form>
  );
}
