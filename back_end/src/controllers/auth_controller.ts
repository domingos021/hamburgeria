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
// ARQUITETURA REFATORADA:
// - Controller: Recebe requisições HTTP e retorna respostas
// - Service: Contém toda a lógica de negócio
// - Repository: Gerencia acesso ao banco de dados
// - Utils: Funções auxiliares reutilizáveis (JWT, etc)
// ======================================================

import { Request, Response } from "express";
import { ZodError } from "zod";

// Importação dos schemas de validação
import {
  registerSchema,
  loginSchema,
  updatePasswordSchema,
  type RegisterInput,
  type LoginInput,
  type UpdatePasswordInput,
} from "../segurança_zod/auntentication_schema.js";

// Importação dos services (lógica de negócio)
import * as authService from "../services/auth.service.js";

// ======================================================
// FUNÇÃO AUXILIAR: TRATAMENTO DE ERROS DO ZOD
// ======================================================
// Centraliza a formatação das respostas de erro de validação
// para manter um padrão consistente na API.
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
// Mapeia os erros lançados pelos services para respostas HTTP adequadas.
// Centraliza o tratamento de erros de negócio.
function handleServiceError(error: Error, response: Response) {
  // Erros conhecidos da lógica de negócio
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

  // Erro genérico (não esperado)
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
    // Valida os dados enviados no body da requisição usando o schema do Zod.
    // Se algum campo estiver inválido ou faltando, o Zod lança um erro automaticamente.
    const validatedData: RegisterInput = registerSchema.parse(request.body);

    // Desestrutura os dados já validados, extraindo apenas os campos necessários
    // para o processo de registro do usuário.
    const { email, password, name, cep, telefone } = validatedData;

    // ======================================================
    // PASSO Nº 2 — DELEGAÇÃO PARA O SERVICE
    // ======================================================
    // O controller apenas orquestra: valida dados e chama o service.
    // Toda a lógica de negócio (verificação de email, hash, criação)
    // está no service, mantendo o controller limpo e focado.
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
      token: result.token, // Token JWT para autenticação imediata
    });
  } catch (error) {
    // ======================================================
    // TRATAMENTO DE ERROS DE VALIDAÇÃO ZOD
    // ======================================================
    if (error instanceof ZodError) {
      return handleZodError(error, response);
    }

    // ======================================================
    // TRATAMENTO DE ERROS DE NEGÓCIO (SERVICE)
    // ======================================================
    if (error instanceof Error) {
      return handleServiceError(error, response);
    }

    // ======================================================
    // TRATAMENTO DE ERROS INESPERADOS
    // ======================================================
    console.error("❌ Erro no registro:", error);
    return response.status(500).json({
      error: "Erro interno do servidor",
    });
  }
}

// ======================================================
// CONTROLLER: LOGIN DE USUÁRIO
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
    // O service contém toda a lógica de busca, validação de senha,
    // e geração de token. O controller apenas orquestra.
    const result = await authService.loginUser({
      email,
      password,
    });

    // ======================================================
    // PASSO Nº 3 — RETORNO DA RESPOSTA DE SUCESSO
    // ======================================================
    return response.status(200).json({
      success: true,
      user: result.user,
      token: result.token, // Token JWT para autenticação nas próximas requisições
    });
  } catch (error) {
    // ======================================================
    // TRATAMENTO DE ERROS DE VALIDAÇÃO ZOD
    // ======================================================
    if (error instanceof ZodError) {
      return handleZodError(error, response);
    }

    // ======================================================
    // TRATAMENTO DE ERROS DE NEGÓCIO (SERVICE)
    // ======================================================
    if (error instanceof Error) {
      return handleServiceError(error, response);
    }

    // ======================================================
    // TRATAMENTO DE ERROS INESPERADOS
    // ======================================================
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
    // ======================================================
    // DELEGAÇÃO PARA O SERVICE
    // ======================================================
    // Busca todos os usuários através do service.
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
    // ======================================================
    // VALIDAÇÃO DOS DADOS COM ZOD
    // ======================================================
    const validatedData: UpdatePasswordInput = updatePasswordSchema.parse(
      request.body
    );
    const { email, newPassword } = validatedData;

    // ======================================================
    // DELEGAÇÃO PARA O SERVICE
    // ======================================================
    // O service cuida do hash e da atualização no banco.
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
    // ======================================================
    // TRATAMENTO DE ERROS DE VALIDAÇÃO ZOD
    // ======================================================
    if (error instanceof ZodError) {
      return handleZodError(error, response);
    }

    // ======================================================
    // TRATAMENTO DE ERROS INESPERADOS
    // ======================================================
    console.error("❌ Erro ao atualizar senha:", error);
    return response.status(500).json({
      error: "Erro ao atualizar senha",
    });
  }
}

/*
```

---

## **📊 Resumo da Refatoração**

### **Estrutura Criada:**
```
src/
├── controllers/
│   └── auth.controller.ts      ✅ Refatorado (apenas orquestração)
├── services/
│   └── auth.service.ts         ✅ NOVO (lógica de negócio)
├── repositories/
│   └── user.repository.ts      ✅ NOVO (acesso ao banco)
├── utils/
│   └── jwt.util.ts             ✅ NOVO (utilitário JWT)
└── segurança_zod/
    └── auntentication_schema.ts ✅ Mantido (validação)


  */
