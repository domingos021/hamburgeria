import { useState } from "react";
import type { ReactNode } from "react";

import { UserContext } from "./UserContext";
import type { UserInterface } from "../../types/userTypes/user";

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  // Estado global do usuário
  const [user, setUser] = useState<UserInterface | null>(null);

  // Função para fazer logout
  const logout = () => {
    setUser(null);
  };

  // Verifica se o usuário está autenticado
  const isAuthenticated = user !== null;

  return (
    <UserContext.Provider value={{ user, setUser, logout, isAuthenticated }}>
      {children}
    </UserContext.Provider>
  );
};
