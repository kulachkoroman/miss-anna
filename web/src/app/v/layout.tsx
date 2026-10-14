import { Suspense } from "react";
import type { Metadata } from "next";
import { AuthModalProvider } from "@/components/auth/AuthModalContext";
import AuthModal from "@/components/auth/AuthModal";
import AuthQueryOpener from "@/components/auth/AuthQueryOpener";
import LandingHeader from "@/components/landing/LandingHeader";
import LandingFooter from "@/components/landing/LandingFooter";
import PreviewSwitcher from "@/components/landing/PreviewSwitcher";
import StickyCta from "@/components/landing/StickyCta";
import { COURSE_HERO } from "@/content/course";
import { getCurrentUser } from "@/lib/auth";
import { getCourseAccess } from "@/lib/course-access";

/** Черновики вариантов лендинга. Не для поиска; удаляются после выбора. */
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function PreviewLayout({ children }: { children: React.ReactNode }) {
  const [user, access] = await Promise.all([getCurrentUser(), getCourseAccess()]);
  return (
    <AuthModalProvider>
      <LandingHeader access={access} userName={user ? user.studentName || user.name : null} />
      <main id="main" className="flex flex-1 flex-col pt-[88px] sm:pt-[104px]">
        {children}
      </main>
      <LandingFooter />
      <AuthModal />
      <Suspense fallback={null}>
        <AuthQueryOpener />
      </Suspense>
      <StickyCta access={access} label={access.isEnrolled ? "Продолжить курс" : COURSE_HERO.button} />
      <PreviewSwitcher />
    </AuthModalProvider>
  );
}
