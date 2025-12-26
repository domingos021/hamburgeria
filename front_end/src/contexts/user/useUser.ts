import { useContext } from "react";
import { UserContext } from "./UserContext";

/**
 * Hook customizado: useUser
 *
 * RESPONSABILIDADE:
 * - Fornecer acesso seguro ao contexto global do usuário
 * - Garantir que o hook seja usado dentro do UserProvider
 */
export const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser deve ser usado dentro do UserProvider");
  }

  return context;
};
