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
// - Geração segura de tokens temporários
// - Envio de emails de redefinição
// - Validação de token e expiração
// - Atualização segura da nova senha no banco de dados
//
// OBJETIVOS:
// - Garantir segurança no processo de recuperação de senha
// - Evitar vazamento de informações sensíveis (email existente)
// - Prevenir abusos com controle de requisições frequentes
// - Centralizar regras críticas de autenticação relacionadas à senha
// - Facilitar manutenção, auditoria e escalabilidade do sistema
// ======================================================

// ======================================================
// IMPORTAÇÕES E DEPENDÊNCIAS
// ======================================================

// Tipos do Express para tipar request e response
import { Request, Response } from "express";

// Instância do Prisma para acesso ao banco de dados
import { prisma } from "../lib/db.js";

// Crypto: usado para gerar tokens seguros
import crypto from "crypto";

// Bcrypt: usado para criptografar senhas
import bcrypt from "bcrypt";

// Função responsável por enviar o email de redefinição de senha
import { sendPasswordResetEmail } from "../lib/mail.js";

// ======================================================
// CONTROLLER: SOLICITAÇÃO DE RESET DE SENHA
// ======================================================
export async function forgotPassword(request: Request, response: Response) {
  try {
    // --------------------------------------------------
    // EXTRAÇÃO DE DADOS DO BODY
    // --------------------------------------------------
    const { email } = request.body;

    // --------------------------------------------------
    // BUSCA USUÁRIO PELO EMAIL
    // --------------------------------------------------
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // --------------------------------------------------
    // SEGURANÇA: NÃO REVELA SE O EMAIL EXISTE
    // --------------------------------------------------
    if (!user) {
      // Delay artificial para dificultar ataques de timing
      await new Promise((resolve) => setTimeout(resolve, 100));

      return response.json({
        message: "Se o email existir, enviaremos instruções",
      });
    }

    // --------------------------------------------------
    // BLOQUEIO DE SOLICITAÇÕES FREQUENTES
    // --------------------------------------------------
    // Verifica se já existe um token válido (últimos 5 minutos)
    if (user.resetTokenExpiry && user.resetTokenExpiry > new Date()) {
      const timeLeft = Math.ceil(
        (user.resetTokenExpiry.getTime() - Date.now()) / 1000 / 60
      );

      return response.status(429).json({
        error: `Aguarde ${timeLeft} minutos antes de solicitar novo link`,
      });
    }

    // --------------------------------------------------
    // GERAÇÃO DO TOKEN DE RESET
    // --------------------------------------------------
    // Token aleatório e seguro
    const token = crypto.randomBytes(32).toString("hex");

    // Tempo de expiração: 15 minutos
    const expires = new Date(Date.now() + 15 * 60 * 1000);

    // --------------------------------------------------
    // ATUALIZA USUÁRIO COM TOKEN E EXPIRAÇÃO
    // --------------------------------------------------
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: token,
        resetTokenExpiry: expires,
      },
    });

    // --------------------------------------------------
    // ENVIO DO EMAIL DE RESET
    // --------------------------------------------------
    const frontendUrl = process.env["FRONTEND_URL"] || "http://localhost:5173";

    await sendPasswordResetEmail(email, token, frontendUrl);

    console.log(`✅ Email de reset enviado para: ${email}`);

    return response.json({
      message: "Email enviado com sucesso",
    });
  } catch (error) {
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
    // EXTRAÇÃO DE DADOS DO BODY
    // --------------------------------------------------
    const { token, newPassword, confirmPassword } = request.body;

    // --------------------------------------------------
    // BUSCA USUÁRIO PELO TOKEN VÁLIDO
    // --------------------------------------------------
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gte: new Date(), // garante que o token não expirou
        },
      },
    });

    // --------------------------------------------------
    // VALIDA TOKEN
    // --------------------------------------------------
    if (!user) {
      return response.status(401).json({
        error: "Token inválido ou expirado",
      });
    }

    // --------------------------------------------------
    // CRIPTOGRAFIA DA NOVA SENHA
    // --------------------------------------------------
    // Bcrypt com 12 rounds (bom equilíbrio entre segurança e performance)
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // --------------------------------------------------
    // ATUALIZA SENHA E LIMPA TOKEN
    // --------------------------------------------------
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    console.log(`✅ Senha redefinida para o usuário: ${user.email}`);

    return response.json({
      message: "Senha redefinida com sucesso",
    });
  } catch (error) {
    // --------------------------------------------------
    // TRATAMENTO DE ERRO GLOBAL
    // --------------------------------------------------
    console.error("❌ Erro ao resetar senha:", error);

    return response.status(500).json({
      error: "Erro ao processar solicitação. Tente novamente mais tarde.",
    });
  }
}
