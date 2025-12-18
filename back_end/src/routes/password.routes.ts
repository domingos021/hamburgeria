// ======================================================
// IMPORTAÇÕES E DEPENDÊNCIAS
// ======================================================

// Router do Express para criação de rotas modularizadas
import { Router } from "express";

// Controllers responsáveis pela lógica de senha
import {
  forgotPassword,
  resetPassword,
} from "../controllers/password.controller.js";

// Middleware de rate limiting (proteção contra abuso)
import { passwordResetLimiter } from "../middleware/rateLimiter.js";

// Middlewares de validação dos dados recebidos
import {
  validateForgotPassword,
  validateResetPassword,
} from "../middleware/validation.js";

// ======================================================
// INICIALIZAÇÃO DO ROUTER
// ======================================================
const router = Router();

// ======================================================
// ROTA: SOLICITAR RESET DE SENHA
// ======================================================
// Ordem dos middlewares:
// 1. Rate limiter (evita muitas requisições)
// 2. Validação dos dados (email)
// 3. Controller (lógica principal)
router.post(
  "/forgot-password",
  passwordResetLimiter,
  validateForgotPassword,
  forgotPassword
);

// ======================================================
// ROTA: REDEFINIR SENHA
// ======================================================
// Ordem dos middlewares:
// 1. Rate limiter (protege contra força bruta)
// 2. Validação dos dados (token e senha)
// 3. Controller (atualiza a senha)
router.post(
  "/reset-password",
  passwordResetLimiter,
  validateResetPassword,
  resetPassword
);

// ======================================================
// EXPORTAÇÃO DAS ROTAS
// ======================================================
export default router;
