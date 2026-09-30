import { Suspense } from "react";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import { AuthModalProvider } from "@/components/auth/AuthModalContext";
import AuthModal from "@/components/auth/AuthModal";
import AuthQueryOpener from "@/components/auth/AuthQueryOpener";
import PageTransition from "@/components/ui/PageTransition";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthModalProvider>
      <Header />
      <main id="main" className="flex flex-1 flex-col pt-[88px] sm:pt-[104px]">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
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
