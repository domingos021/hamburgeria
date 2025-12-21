// ======================================================
// COMPONENTE: ValidationMiddleware (Password Flow)
// ======================================================
//
// ARQUIVO:
// src/middleware/validation.ts
//
// DESCRIÇÃO:
// Middleware responsável pela validação de dados de entrada
// relacionados ao fluxo de recuperação e redefinição de senha.
//
// FUNÇÃO:
// - Validar formato e consistência dos dados recebidos
// - Garantir integridade antes da execução dos controllers
// - Centralizar regras de validação do fluxo de senha
//
// OBJETIVOS:
// - Prevenir dados inválidos ou malformados na API
// - Reforçar segurança no processo de redefinição de senha
// - Melhorar experiência do usuário com mensagens claras
// - Separar validação da lógica de negócio
// ======================================================

// ======================================================
// IMPORTAÇÕES E DEPENDÊNCIAS
// ======================================================

// Funções do express-validator para validar e capturar erros
import { body, validationResult } from "express-validator";

// Tipos do Express
import { Request, Response, NextFunction } from "express";

// ======================================================
// VALIDAÇÃO: ESQUECI MINHA SENHA
// ======================================================
export const validateForgotPassword = [
  // --------------------------------------------------
  // VALIDA EMAIL
  // --------------------------------------------------
  body("email")
    .isEmail() // verifica se é um email válido
    .withMessage("Email inválido")
    .normalizeEmail() // normaliza o formato do email
    .trim(), // remove espaços extras

  // --------------------------------------------------
  // TRATAMENTO DOS ERROS DE VALIDAÇÃO
  // --------------------------------------------------
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: errors.array()[0]?.msg || "Erro de validação",
      });
    }

    return next();
  },
];

// ======================================================
// VALIDAÇÃO: RESET DE SENHA
// ======================================================
export const validateResetPassword = [
  // --------------------------------------------------
  // VALIDA TOKEN
  // --------------------------------------------------
  body("token")
    .isLength({ min: 64, max: 64 }) // token deve ter tamanho fixo
    .withMessage("Token inválido"),

  // --------------------------------------------------
  // VALIDA NOVA SENHA
  // --------------------------------------------------
  body("newPassword")
    .isLength({ min: 8 }) // tamanho mínimo da senha
    .withMessage("Senha deve ter no mínimo 8 caracteres")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/) // regras de força da senha
    .withMessage("Senha deve conter letras maiúsculas, minúsculas e números"),

  // --------------------------------------------------
  // CONFIRMAÇÃO DE SENHA
  // --------------------------------------------------
  body("confirmPassword")
    .custom((value, { req }) => value === req.body.newPassword) // compara as senhas
    .withMessage("As senhas não coincidem"),

  // --------------------------------------------------
  // TRATAMENTO DOS ERROS DE VALIDAÇÃO
  // --------------------------------------------------
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: errors.array()[0]?.msg || "Erro de validação",
      });
    }

    return next();
  },
];
