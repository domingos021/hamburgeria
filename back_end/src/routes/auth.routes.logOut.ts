// ======================================================
// ARQUIVO: src/routes/auth.routes.logOut.ts
// ======================================================
//
// COMPONENTE: LogoutRoutes
//
// DESCRIÇÃO:
// Define a rota responsável por encerrar a sessão do usuário,
// removendo o cookie de autenticação.
//
// ======================================================

import { Router } from "express";
import { logoutController } from "../controllers/logout.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = Router();

// POST /auth/logout (PROTEGIDA)
// Encerra a sessão do usuário autenticado
router.post("/logout", authenticateToken, logoutController);

export default router;
