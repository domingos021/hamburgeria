// ======================================================
// ARQUIVO: src/controllers/auth.controller.ts
// ======================================================
//
// COMPONENTE: AuthController
//
// DESCRIÇÃO:
// Controller responsável por centralizar todas as operações
// relacionadas à autenticação e gerenciamento básico de usuários
// no backend da aplicação.
//
// FUNÇÃO:
// Gerenciar o fluxo de registro, login, listagem e atualização
// de senha de usuários, atuando como intermediário entre as
// requisições HTTP, a lógica de segurança e o banco de dados.
//
// OBJETIVOS:
// - Garantir autenticação segura utilizando hash de senha (bcrypt)
// - Implementar autenticação JWT (JSON Web Token)
// - Validar dados de entrada com Zod antes de processar
// - Centralizar regras de autenticação em um único controller
// - Facilitar manutenção, testes e escalabilidade do sistema
//
// ARQUITETURA:
// - Controller: Orquestra requisições e respostas HTTP
// - Service: Contém toda a lógica de negócio
// - Repository: Gerencia acesso ao banco de dados
// - Utils: Funções auxiliares reutilizáveis (JWT, etc)
// ======================================================

import { Request, Response } from "express";
import { ZodError } from "zod";
import { setAuthCookie } from "../utils/authCookie.util.js";

// ======================================================
// IMPORTAÇÃO DOS SCHEMAS DE VALIDAÇÃO (ZOD)
// ======================================================
import {
  registerSchema,
  loginSchema,
  updatePasswordSchema,
  type RegisterInput,
  type LoginInput,
  type UpdatePasswordInput,
} from "../segurança_zod/auntentication_schema.js";

// ======================================================
// IMPORTAÇÃO DOS SERVICES (LÓGICA DE NEGÓCIO)
// ======================================================
import * as authService from "../services/auth.service.js";

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
  if (error.message === "EMAIL_ALREADY_EXISTS") {
    return response.status(409).json({
      error: "Email já cadastrado, por favor use outro Email",
    });
  }

  if (error.message === "INVALID_CREDENTIALS") {
    return response.status(401).json({
      error: "Credenciais inválidas",
    });
  }

  console.error("❌ Erro inesperado:", error);
  return response.status(500).json({
    error: "Erro interno do servidor",
  });
}

// ======================================================
// CONTROLLER: REGISTRO DE USUÁRIO
// ======================================================
export async function register(request: Request, response: Response) {
  try {
    // ======================================================
    // PASSO Nº 1 — VALIDAÇÃO DOS DADOS COM ZOD
    // ======================================================
    const validatedData: RegisterInput = registerSchema.parse(request.body);

    const { email, password, name, cep, telefone } = validatedData;

    // ======================================================
    // PASSO Nº 2 — DELEGAÇÃO PARA O SERVICE
    // ======================================================
    const result = await authService.registerUser({
      name,
      email,
      password,
      cep,
      telefone,
    });

    // ======================================================
    // PASSO Nº 3 — RETORNO DA RESPOSTA DE SUCESSO
    // ======================================================
    return response.status(201).json({
      success: true,
      message: "Usuário criado com sucesso",
      user: result.user,
      token: result.token, // Mantido para compatibilidade atual
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return handleZodError(error, response);
    }

    if (error instanceof Error) {
      return handleServiceError(error, response);
    }

    console.error("❌ Erro no registro:", error);
    return response.status(500).json({
      error: "Erro interno do servidor",
    });
  }
}

// ======================================================
// CONTROLLER: LOGIN DE USUÁRIO (JWT EM HTTPONLY COOKIE)
// ======================================================
export async function login(request: Request, response: Response) {
  try {
    // ======================================================
    // PASSO Nº 1 — VALIDAÇÃO DOS DADOS COM ZOD
    // ======================================================
    const validatedData: LoginInput = loginSchema.parse(request.body);
    const { email, password } = validatedData;

    // ======================================================
    // PASSO Nº 2 — DELEGAÇÃO PARA O SERVICE
    // ======================================================
    const result = await authService.loginUser({
      email,
      password,
    });

    // ======================================================
    // PASSO Nº 3 — ARMAZENAMENTO DO JWT EM COOKIE HTTPONLY
    // ======================================================
    //
    // A criação do cookie foi extraída para um util
    // para manter o controller limpo e focado apenas
    // na orquestração da requisição.
    //
    setAuthCookie(response, result.token);

    // ======================================================
    // PASSO Nº 4 — RETORNO DA RESPOSTA DE SUCESSO
    // ======================================================
    // O token NÃO é enviado no body, apenas os dados do usuário
    return response.status(200).json({
      success: true,
      user: result.user,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return handleZodError(error, response);
    }

    if (error instanceof Error) {
      return handleServiceError(error, response);
    }

    console.error("❌ Erro no login:", error);
    return response.status(500).json({
      error: "Erro interno do servidor",
    });
  }
}

// ======================================================
// CONTROLLER: LISTAGEM DE USUÁRIOS (TESTE)
// ======================================================
export async function listUsers(_request: Request, response: Response) {
  try {
    const users = await authService.getAllUsers();

    return response.json({
      total: users.length,
      users,
    });
  } catch (error) {
    console.error("❌ Erro ao listar usuários:", error);
    return response.status(500).json({
      error: "Erro ao listar usuários",
    });
  }
}

// ======================================================
// CONTROLLER: ATUALIZAÇÃO DE SENHA (TEMPORÁRIA)
// ======================================================
export async function updatePassword(request: Request, response: Response) {
  try {
    const validatedData: UpdatePasswordInput = updatePasswordSchema.parse(
      request.body
    );

    const { email, newPassword } = validatedData;

    const result = await authService.updatePassword({
      email,
      newPassword,
    });

    return response.json({
      success: true,
      message: "Senha atualizada com sucesso",
      email: result.email,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return handleZodError(error, response);
    }

    console.error("❌ Erro ao atualizar senha:", error);
    return response.status(500).json({
      error: "Erro ao atualizar senha",
    });
  }
}
