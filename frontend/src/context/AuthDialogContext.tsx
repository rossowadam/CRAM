import { createContext } from "react";

export type AuthMode = "login" | "signup";

export interface AuthDialogContextValue {
  openAuthDialog: (mode?: AuthMode) => void;
}

export const AuthDialogContext = createContext<AuthDialogContextValue | undefined>(undefined);