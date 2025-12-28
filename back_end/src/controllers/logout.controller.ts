// ======================================================
// CONTROLLER: Logout
// ======================================================
//
// RESPONSABILIDADE:
// - Encerrar a sessão do usuário
// - Remover o cookie de autenticação
// ======================================================

import type { Request, Response } from "express";
import { clearAuthCookie } from "../../src/utils/authCookie.util.js";

export function logoutController(req: Request, res: Response) {
  // Remove o cookie JWT
  clearAuthCookie(res);

  // Retorna sucesso
  return res.status(200).json({
    message: "Logout realizado com sucesso",
  });
}
