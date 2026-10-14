"use client";

import { useFormStatus } from "react-dom";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { useAuthModal } from "@/components/auth/AuthModalContext";
import { enrollFreeAction } from "@/lib/actions/enrollment";
import { FREE_COURSE_SLUG } from "@/content/course";
import type { CourseAccess } from "@/lib/course-access";

type Props = CourseAccess & {
  label: string;
  size?: "md" | "lg";
  variant?: "primary" | "accent" | "light";
  className?: string;
  /** Без стрелки — для узких мест вроде шапки. */
  bare?: boolean;
};

/**
 * Главная кнопка лендинга. Одна на всю страницу, в разных местах.
 *
 *   гость              → окно регистрации; после неё сразу запись на курс
 *                        и переход в первый урок (AuthModal сам доводит намерение);
 *   вошёл, не записан  → запись на курс и переход в него;
 *   уже записан        → сразу в курс.
 */
export default function StartCourseButton({
  isAuthenticated,
  isEnrolled,
  label,
  size = "lg",
  variant = "accent",
  className,
  bare = false,
}: Props) {
  const { openRegister } = useAuthModal();
  const arrow = bare ? null : <Icon name="arrowRight" className="h-5 w-5" />;

  if (isEnrolled) {
    return (
      <Button href={`/cabinet/courses/${FREE_COURSE_SLUG}`} size={size} variant={variant} className={className}>
        {label}
        {arrow}
      </Button>
    );
  }

  if (!isAuthenticated) {
    return (
      <Button
        type="button"
        size={size}
        variant={variant}
        className={className}
        onClick={() => openRegister({ type: "enroll", courseSlug: FREE_COURSE_SLUG })}
      >
        {label}
        {arrow}
      </Button>
    );
  }

  return (
    <form action={enrollFreeAction.bind(null, FREE_COURSE_SLUG)} className="contents">
      <Submit size={size} variant={variant} className={className} label={label} arrow={arrow} />
    </form>
  );
}

function Submit({
  label,
  arrow,
  ...rest
}: {
  label: string;
  arrow: React.ReactNode;
  size: "md" | "lg";
  variant: "primary" | "accent" | "light";
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} {...rest}>
      {pending ? "Секунду…" : label}
      {!pending && arrow}
    </Button>
  );
}
