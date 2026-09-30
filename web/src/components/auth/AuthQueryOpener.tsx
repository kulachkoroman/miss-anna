"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useAuthModal } from "./AuthModalContext";

/** Opens the login modal when redirected here with `?auth=1` (e.g. from an auth-gated route). */
export default function AuthQueryOpener() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { openLogin } = useAuthModal();

  useEffect(() => {
    if (params.get("auth") === "1") {
      openLogin();
      router.replace(pathname);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  return null;
}
