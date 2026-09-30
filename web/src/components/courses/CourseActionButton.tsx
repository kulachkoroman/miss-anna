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
      className="w-full rounded-full bg-[var(--color-accent)] px-6 py-3.5 text-base font-semibold text-white shadow-[0_8px_20px_-8px_rgba(255,138,61,0.6)] transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.03] hover:bg-[var(--color-accent-dark)] disabled:opacity-60 sm:w-auto"
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
        className="inline-flex w-full items-center justify-center rounded-full bg-[var(--color-primary)] px-6 py-3.5 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.03] hover:bg-[var(--color-primary-dark)] sm:w-auto"
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
        className="w-full rounded-full bg-[var(--color-accent)] px-6 py-3.5 text-base font-semibold text-white shadow-[0_8px_20px_-8px_rgba(255,138,61,0.6)] transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.03] hover:bg-[var(--color-accent-dark)] sm:w-auto"
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
