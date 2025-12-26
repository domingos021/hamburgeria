import { createContext } from "react";
import type { UserInterface } from "../../types/userTypes/user";

// ======================================================
// TIPAGEM DO CONTEXTO DE USUÁRIO
// ======================================================

export interface UserContextType {
  user: UserInterface | null;
  setUser: (user: UserInterface | null) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

// ======================================================
// CONTEXTO GLOBAL DO USUÁRIO
// ======================================================

export const UserContext = createContext<UserContextType | undefined>(
  undefined,
);
