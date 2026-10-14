import { Suspense } from "react";
import { AuthModalProvider } from "@/components/auth/AuthModalContext";
import AuthModal from "@/components/auth/AuthModal";
import AuthQueryOpener from "@/components/auth/AuthQueryOpener";
import LandingHeader from "@/components/landing/LandingHeader";
import LandingFooter from "@/components/landing/LandingFooter";
import { getCurrentUser } from "@/lib/auth";
import { getCourseAccess } from "@/lib/course-access";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [user, access] = await Promise.all([getCurrentUser(), getCourseAccess()]);

  return (
    <AuthModalProvider>
      <LandingHeader access={access} userName={user ? user.studentName || user.name : null} />
      <main id="main" className="flex flex-1 flex-col pt-[88px] sm:pt-[104px]">
        {children}
      </main>
      <LandingFooter />
      <AuthModal />
      {/*
        AuthQueryOpener читает параметры адреса (?auth=1), чтобы открыть окно входа.
        Next требует обернуть такие компоненты в Suspense: иначе страницу нельзя
        собрать заранее и сборка падает. Компонент ничего не рисует,
        поэтому запасной вариант пустой.
      */}
      <Suspense fallback={null}>
        <AuthQueryOpener />
      </Suspense>
    </AuthModalProvider>
  );
}
