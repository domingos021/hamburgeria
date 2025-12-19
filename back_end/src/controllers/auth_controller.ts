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
// - Validar dados de entrada antes de interagir com o banco
// - Centralizar regras de autenticação em um único controller
// - Facilitar manutenção, testes e escalabilidade do sistema
// ======================================================

import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../lib/db.js";

// ======================================================
// CONTROLLER: REGISTRO DE USUÁRIO
// ======================================================

export async function register(request: Request, response: Response) {
  try {
    const { email, password, name, cep } = request.body;

    console.log("📝 Tentando registrar:", email);

    // Validação de campos obrigatórios
    if (!email || !password) {
      return response.status(400).json({
        error: "Email e senha são obrigatórios",
      });
    }

    // Verifica se o usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return response.status(409).json({
        error: "Email já cadastrado",
      });
    }

    // Geração do hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("🔐 Senha hasheada com sucesso");

    // Criação do usuário no banco de dados
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        cep,
      },
    });

    console.log("✅ Usuário criado:", user.email);

    // Remove a senha da resposta
    const { password: _, ...userWithoutPassword } = user;

    return response.status(201).json({
      success: true,
      message: "Usuário criado com sucesso",
      user: userWithoutPassword,
    });
  } catch (error) {
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
    const { email, password } = request.body;

    console.log("🔍 Tentando login:", email);

    // Validação de campos obrigatórios
    if (!email || !password) {
      return response.status(400).json({
        error: "Email e senha são obrigatórios",
      });
    }

    // Busca do usuário no banco
    const user = await prisma.user.findFirst({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        name: true,
        cep: true,
      },
    });

    console.log("📦 Usuário encontrado:", user ? "Sim" : "Não");

    if (!user) {
      return response.status(404).json({
        error: "Credenciais inválidas",
      });
    }

    // Comparação do hash da senha
    const isPasswordValid = await bcrypt.compare(password, user.password);

    console.log("🔐 Senha válida:", isPasswordValid ? "Sim" : "Não");

    if (!isPasswordValid) {
      return response.status(401).json({
        error: "Credenciais inválidas",
      });
    }

    // Remove a senha da resposta
    const { password: _, ...userWithoutPassword } = user;

    console.log("✅ Login bem-sucedido");

    return response.status(200).json({
      success: true,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("❌ Erro no login:", error);
    return response.status(500).json({
      error: "Erro interno do servidor",
    });
  }
}

// ======================================================
// CONTROLLER: LISTAGEM DE USUÁRIOS (TESTE)
// ======================================================

export async function listUsers(request: Request, response: Response) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        cep: true,
      },
    });

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
    const { email, newPassword } = request.body;

    // Validação de campos obrigatórios
    if (!email || !newPassword) {
      return response.status(400).json({
        error: "Email e newPassword são obrigatórios",
      });
    }

    // Geração do hash da nova senha
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Atualização da senha no banco
    const user = await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    console.log("✅ Senha atualizada para:", email);

    return response.json({
      success: true,
      message: "Senha atualizada com sucesso",
      email: user.email,
    });
  } catch (error) {
    console.error("❌ Erro ao atualizar senha:", error);
    return response.status(500).json({
      error: "Erro ao atualizar senha",
    });
  }
}
