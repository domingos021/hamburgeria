// ======================================================
// COMPONENTE: PasswordController
// ======================================================
//
// ARQUIVO:
// src/controllers/password.controller.ts
//
// DESCRIÇÃO:
// Controller responsável por todo o fluxo de recuperação
// e redefinição de senha de usuários da aplicação.
//
// FUNÇÃO:
// Gerenciar solicitações de reset de senha, incluindo:
// - Validação de entrada com Zod
// - Geração segura de tokens temporários
// - Envio de emails de redefinição
// - Validação de token e expiração
// - Atualização segura da nova senha no banco de dados
//
// OBJETIVOS:
// - Garantir segurança no processo de recuperação de senha
// - Validar dados antes de processar
// - Evitar vazamento de informações sensíveis (email existente)
// - Prevenir abusos com controle de requisições frequentes
// - Centralizar regras críticas de autenticação relacionadas à senha
// - Facilitar manutenção, auditoria e escalabilidade do sistema
//
// ARQUITETURA REFATORADA:
// - Controller: Recebe requisições HTTP e retorna respostas
// - Service: Contém toda a lógica de negócio
// - Repository: Gerencia acesso ao banco de dados
// ======================================================

// ======================================================
// IMPORTAÇÕES E DEPENDÊNCIAS
// ======================================================

// Tipos do Express para tipar request e response
import { Request, Response } from "express";

// Schemas de validação Zod
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  type ForgotPasswordInput,
  type ResetPasswordInput,
} from "../segurança_zod/segurança_zodschema.js";

// Zod para tratamento de erros de validação
import { ZodError } from "zod";

// Importação dos services (lógica de negócio)
import * as passwordService from "../services/password.service.js";

// ======================================================
// FUNÇÃO AUXILIAR: TRATAMENTO DE ERROS DO ZOD
// ======================================================
function handleZodError(error: ZodError, response: Response) {
  return response.status(400).json({
    error: "Dados inválidos",
    details: error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    })),
  });
}

// ======================================================
// FUNÇÃO AUXILIAR: TRATAMENTO DE ERROS DO SERVICE
// ======================================================
function handleServiceError(error: Error, response: Response) {
  // Erro de rate limit (solicitações muito frequentes)
  if (error.message.startsWith("RATE_LIMIT:")) {
    const timeLeft = error.message.split(":")[1];
    return response.status(429).json({
      error: `Aguarde ${timeLeft} minutos antes de solicitar novo link`,
    });
  }

  // Token inválido ou expirado
  if (error.message === "INVALID_TOKEN") {
    return response.status(401).json({
      error: "Token inválido ou expirado",
    });
  }

  // Erro genérico (não esperado)
  console.error("❌ Erro inesperado:", error);
  return response.status(500).json({
    error: "Erro ao processar solicitação. Tente novamente mais tarde.",
  });
}

// ======================================================
// CONTROLLER: SOLICITAÇÃO DE RESET DE SENHA
// ======================================================
export async function forgotPassword(request: Request, response: Response) {
  try {
    // --------------------------------------------------
    // VALIDAÇÃO DE ENTRADA COM ZOD
    // --------------------------------------------------
    const validatedData: ForgotPasswordInput = forgotPasswordSchema.parse(
      request.body
    );

    // --------------------------------------------------
    // DELEGAÇÃO PARA O SERVICE
    // --------------------------------------------------
    // O controller apenas orquestra: valida dados e chama o service.
    // Toda a lógica de negócio está no service.
    const result = await passwordService.requestPasswordReset(validatedData);

    return response.json({
      message: result.message,
    });
  } catch (error) {
    // --------------------------------------------------
    // TRATAMENTO DE ERROS DE VALIDAÇÃO ZOD
    // --------------------------------------------------
    if (error instanceof ZodError) {
      return handleZodError(error, response);
    }

    // --------------------------------------------------
    // TRATAMENTO DE ERROS DE NEGÓCIO (SERVICE)
    // --------------------------------------------------
    if (error instanceof Error) {
      return handleServiceError(error, response);
    }

    // --------------------------------------------------
    // TRATAMENTO DE ERRO GLOBAL
    // --------------------------------------------------
    console.error("❌ Erro ao processar forgot-password:", error);
    return response.status(500).json({
      error: "Erro ao processar solicitação. Tente novamente mais tarde.",
    });
  }
}

// ======================================================
// CONTROLLER: REDEFINIÇÃO DE SENHA
// ======================================================
export async function resetPassword(request: Request, response: Response) {
  try {
    // --------------------------------------------------
    // VALIDAÇÃO DE ENTRADA COM ZOD
    // --------------------------------------------------
    const validatedData: ResetPasswordInput = resetPasswordSchema.parse(
      request.body
    );

    // --------------------------------------------------
    // DELEGAÇÃO PARA O SERVICE
    // --------------------------------------------------
    // O service contém toda a lógica de validação de token,
    // criptografia e atualização no banco.
    const result = await passwordService.resetPasswordWithToken(validatedData);

    return response.json({
      message: result.message,
    });
  } catch (error) {
    // --------------------------------------------------
    // TRATAMENTO DE ERROS DE VALIDAÇÃO ZOD
    // --------------------------------------------------
    if (error instanceof ZodError) {
      return handleZodError(error, response);
    }

    // --------------------------------------------------
    // TRATAMENTO DE ERROS DE NEGÓCIO (SERVICE)
    // --------------------------------------------------
    if (error instanceof Error) {
      return handleServiceError(error, response);
    }

    // --------------------------------------------------
    // TRATAMENTO DE ERRO GLOBAL
    // --------------------------------------------------
    console.error("❌ Erro ao resetar senha:", error);
    return response.status(500).json({
      error: "Erro ao processar solicitação. Tente novamente mais tarde.",
    });
  }
}

/*
```

---

## **📊 Estrutura Completa Agora**
```
src/
├── controllers/
│   ├── auth.controller.ts           ✅ Refatorado
│   └── password.controller.ts       ✅ Refatorado
├── services/
│   ├── auth.service.ts              ✅ Criado
│   └── password.service.ts          ✅ Criado
├── repositories/
│   ├── user.repository.ts           ✅ Criado
│   └── password.repository.ts       ✅ Criado
├── utils/
│   └── jwt.util.ts                  ✅ Criado
└── segurança_zod/
    ├── auntentication_schema.ts     ✅ Mantido
    └── segurança_zodschema.ts       ✅ Mantido

    */
