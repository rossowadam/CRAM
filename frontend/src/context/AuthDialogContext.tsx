// src/context/AuthDialogContext.tsx
import { createContext, useContext, useState, type ReactNode } from "react";
import AuthDialog from "@/components/auth/AuthDialog";

type AuthMode = "login" | "signup";

interface AuthDialogContextValue {
  openAuthDialog: (mode?: AuthMode) => void;
}

const AuthDialogContext = createContext<AuthDialogContextValue | undefined>(undefined);

export function AuthDialogProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>("login");

  const openAuthDialog = (newMode: AuthMode = "login") => {
    setMode(newMode);
    setOpen(true);
  };

  return (
    <AuthDialogContext.Provider value={{ openAuthDialog }}>
      {children}
      <AuthDialog open={open} mode={mode} setOpen={setOpen} setMode={setMode} />
    </AuthDialogContext.Provider>
  );
}

export function useAuthDialog() {
  const ctx = useContext(AuthDialogContext);
  if (!ctx) throw new Error("useAuthDialog must be used within AuthDialogProvider");
  return ctx;
}