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
// - Proteger rotas que exigem autenticação com middleware JWT
// - Facilitar manutenção e escalabilidade do roteamento
// ======================================================

import { Router } from "express";
import {
  register,
  login,
  listUsers,
  updatePassword,
} from "../controllers/auth_controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";
const router = Router();

// ======================================================
// ROTAS PÚBLICAS (SEM AUTENTICAÇÃO)
// ======================================================
// Estas rotas não exigem token JWT para serem acessadas

// POST /auth/register - Registra um novo usuário
router.post("/register", register);

// POST /auth/login - Realiza login e retorna token JWT
router.post("/login", login);

// ======================================================
// ROTAS PROTEGIDAS (REQUEREM AUTENTICAÇÃO)
// ======================================================
// Estas rotas exigem token JWT válido no header Authorization
// Formato: Authorization: Bearer [seu-token-aqui]

// GET /auth/users - Lista todos os usuários (PROTEGIDA)
// O middleware authenticateToken valida o token antes de executar listUsers
router.get("/users", authenticateToken, listUsers);

// PATCH /auth/update-password - Atualiza senha do usuário (PROTEGIDA)
// O middleware authenticateToken valida o token antes de executar updatePassword
router.patch("/update-password", authenticateToken, updatePassword);

// ======================================================
// EXPORTAÇÃO DO ROUTER
// ======================================================
export default router;

// ======================================================
// INSTRUÇÕES DE USO
// ======================================================
//
// ROTAS PÚBLICAS:
// Podem ser acessadas sem token, apenas enviando o body necessário
//
// Exemplo de requisição para /register:
// POST http://localhost:3000/auth/register
// Content-Type: application/json
// {
//   "email": "usuario@example.com",
//   "password": "senha123",
//   "name": "Nome do Usuário",
//   "cep": "12345678"
// }
//
// ROTAS PROTEGIDAS:
// Devem incluir o token JWT no header Authorization
//
// Exemplo de requisição para /users:
// GET http://localhost:3000/auth/users
// Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
//
// ======================================================
