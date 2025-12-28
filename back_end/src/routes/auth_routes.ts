// ======================================================
// ARQUIVO: src/routes/auth.routes.ts
// ======================================================
//
// COMPONENTE: AuthRoutes
//
// DESCRIÇÃO:
// Define as rotas relacionadas à autenticação e gerenciamento
// de usuários na aplicação.
//
// FUNÇÃO:
// Mapear endpoints HTTP para os controllers correspondentes,
// aplicando middlewares de autenticação onde necessário.
//
// OBJETIVOS:
// - Organizar rotas de autenticação de forma clara
// - Proteger rotas que exigem autenticação
// - Facilitar manutenção e escalabilidade
// ======================================================

import { Router } from "express";
import {
  register,
  login,
  listUsers,
  updatePassword,
} from "../controllers/auth_controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

// 🔽 ROTAS DE LOGOUT (ARQUIVO SEPARADO)
import logoutRoutes from "./auth.routes.logOut.js";

const router = Router();

// ======================================================
// ROTAS PÚBLICAS (SEM AUTENTICAÇÃO)
// ======================================================

// POST /auth/register - Registra um novo usuário
router.post("/register", register);

// POST /auth/login - Realiza login e cria cookie JWT
router.post("/login", login);

// ======================================================
// ROTAS PROTEGIDAS (REQUEREM AUTENTICAÇÃO)
// ======================================================

// GET /auth/users - Lista usuários
router.get("/users", authenticateToken, listUsers);

// PATCH /auth/update-password - Atualiza senha
router.patch("/update-password", authenticateToken, updatePassword);

// ======================================================
// ROTAS DE LOGOUT
// ======================================================
//
// Aqui conectamos o arquivo auth.routes.logOut.ts
// Sem isso, a rota NÃO existe em runtime
//
router.use(logoutRoutes);

// ======================================================
// EXPORTAÇÃO DO ROUTER
// ======================================================
export default router;
