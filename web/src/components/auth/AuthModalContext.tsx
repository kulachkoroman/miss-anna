"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

export type PendingIntent =
  | { type: "enroll"; courseSlug: string }
  | { type: "pay"; courseSlug: string }
  | null;

type AuthModalState = {
  isOpen: boolean;
  mode: "login" | "register";
  intent: PendingIntent;
};

type AuthModalContextValue = {
  state: AuthModalState;
  openLogin: (intent?: PendingIntent) => void;
  openRegister: (intent?: PendingIntent) => void;
  close: () => void;
  setMode: (mode: "login" | "register") => void;
};

const AuthModalContext = createContext<AuthModalContextValue | null>(null);

export function AuthModalProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthModalState>({
    isOpen: false,
    mode: "login",
    intent: null,
  });

  const openLogin = useCallback((intent: PendingIntent = null) => {
    setState({ isOpen: true, mode: "login", intent });
  }, []);

  const openRegister = useCallback((intent: PendingIntent = null) => {
    setState({ isOpen: true, mode: "register", intent });
  }, []);

  const close = useCallback(() => {
    setState((s) => ({ ...s, isOpen: false }));
  }, []);

  const setMode = useCallback((mode: "login" | "register") => {
    setState((s) => ({ ...s, mode }));
  }, []);

  const value = useMemo(
    () => ({ state, openLogin, openRegister, close, setMode }),
    [state, openLogin, openRegister, close, setMode]
  );

  return <AuthModalContext.Provider value={value}>{children}</AuthModalContext.Provider>;
}

export function useAuthModal() {
  const ctx = useContext(AuthModalContext);
  if (!ctx) throw new Error("useAuthModal must be used within AuthModalProvider");
  return ctx;
}
