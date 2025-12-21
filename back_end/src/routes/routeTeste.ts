// ======================================================
// ARQUIVO: src/routes/test.routes.ts
// ======================================================
//
// DESCRIÇÃO:
// Rotas de teste para validar o funcionamento do JWT
//
// OBJETIVO:
// Testar se o middleware de autenticação está funcionando
// corretamente em diferentes cenários
// ======================================================

import { Router, Request, Response } from "express";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = Router();

// ======================================================
// ROTA PÚBLICA (SEM AUTENTICAÇÃO)
// ======================================================
// Esta rota pode ser acessada sem token
router.get("/public", (_req: Request, res: Response) => {
  console.log("✅ Rota pública acessada");

  res.status(200).json({
    success: true,
    message: "Esta é uma rota pública - não precisa de autenticação",
    timestamp: new Date().toISOString(),
  });
});

// ======================================================
// ROTA PROTEGIDA (COM AUTENTICAÇÃO JWT)
// ======================================================
// Esta rota SÓ pode ser acessada com token válido
router.get("/protected", authenticateToken, (req: Request, res: Response) => {
  console.log("✅ Rota protegida acessada por:", req.user?.email);

  res.status(200).json({
    success: true,
    message: "Você está autenticado! 🎉",
    user: {
      userId: req.user?.userId,
      email: req.user?.email,
    },
    timestamp: new Date().toISOString(),
  });
});

// ======================================================
// ROTA DE DEBUG - MOSTRA INFORMAÇÕES DO TOKEN
// ======================================================
// Útil para debugar problemas com o token
router.get("/debug", authenticateToken, (req: Request, res: Response) => {
  console.log("🔍 Debug do token:");
  console.log("- User ID:", req.user?.userId);
  console.log("- Email:", req.user?.email);
  console.log("- IAT (Issued At):", req.user?.iat);
  console.log("- EXP (Expires):", req.user?.exp);

  // Calcula quanto tempo falta para expirar
  const now = Math.floor(Date.now() / 1000);
  const expiresIn = req.user?.exp ? req.user.exp - now : 0;
  const expiresInMinutes = Math.floor(expiresIn / 60);
  const expiresInHours = Math.floor(expiresInMinutes / 60);

  res.status(200).json({
    success: true,
    message: "Informações detalhadas do token",
    token_info: {
      user: {
        userId: req.user?.userId,
        email: req.user?.email,
      },
      issued_at: req.user?.iat
        ? new Date(req.user.iat * 1000).toISOString()
        : null,
      expires_at: req.user?.exp
        ? new Date(req.user.exp * 1000).toISOString()
        : null,
      expires_in: {
        seconds: expiresIn,
        minutes: expiresInMinutes,
        hours: expiresInHours,
      },
      is_valid: expiresIn > 0,
    },
    timestamp: new Date().toISOString(),
  });
});

// ======================================================
// ROTA DE TESTE - SIMULA OPERAÇÃO DE USUÁRIO
// ======================================================
// Simula uma operação real que um usuário autenticado faria
router.post(
  "/user-action",
  authenticateToken,
  (req: Request, res: Response) => {
    console.log("🎬 Ação de usuário executada por:", req.user?.email);
    console.log("📦 Dados recebidos:", req.body);

    res.status(200).json({
      success: true,
      message: "Ação executada com sucesso!",
      executed_by: {
        userId: req.user?.userId,
        email: req.user?.email,
      },
      action_data: req.body,
      timestamp: new Date().toISOString(),
    });
  }
);

// ======================================================
// EXPORTAÇÃO DAS ROTAS
// ======================================================
export default router;
