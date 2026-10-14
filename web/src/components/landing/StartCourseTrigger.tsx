"use client";

import Link from "next/link";
import { useAuthModal } from "@/components/auth/AuthModalContext";
import { enrollFreeAction } from "@/lib/actions/enrollment";
import { FREE_COURSE_SLUG } from "@/content/course";
import type { CourseAccess } from "@/lib/course-access";

/**
 * Та же логика, что у StartCourseButton, но без оформления кнопки:
 * для кликабельных обложек, строк программы и т. п.
 */
export default function StartCourseTrigger({
  isAuthenticated,
  isEnrolled,
  className,
  ariaLabel,
  children,
}: CourseAccess & { className?: string; ariaLabel?: string; children: React.ReactNode }) {
  const { openRegister } = useAuthModal();

  if (isEnrolled) {
    return (
      <Link href={`/cabinet/courses/${FREE_COURSE_SLUG}`} className={className} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }
  if (!isAuthenticated) {
    return (
      <button
        type="button"
        className={className}
        aria-label={ariaLabel}
        onClick={() => openRegister({ type: "enroll", courseSlug: FREE_COURSE_SLUG })}
      >
        {children}
      </button>
    );
  }
  return (
    <form action={enrollFreeAction.bind(null, FREE_COURSE_SLUG)} className="contents">
      <button type="submit" className={className} aria-label={ariaLabel}>
        {children}
      </button>
    </form>
  );
}
