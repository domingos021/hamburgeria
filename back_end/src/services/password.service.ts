// ======================================================
// ARQUIVO: src/services/password.service.ts
// ======================================================
//
// COMPONENTE: Password Service
//
// DESCRIÇÃO:
// Service responsável por toda a lógica de negócio
// relacionada ao fluxo de recuperação de senha.
//
// FUNÇÃO:
// Implementar regras de negócio, validações e orquestração
// do processo de reset de senha.
//
// OBJETIVOS:
// - Separar lógica de negócio dos controllers
// - Centralizar regras de segurança de senha
// - Facilitar testes unitários
// - Melhorar manutenibilidade
// ======================================================

import crypto from "crypto";
import bcrypt from "bcrypt";
import { sendPasswordResetEmail } from "../lib/mail.js";
import * as passwordRepository from "../repositories/password.repository.js";

// ======================================================
// TIPOS DO SERVICE
// ======================================================
export interface ForgotPasswordInput {
  email: string;
}

export interface ResetPasswordInput {
  token: string;
  newPassword: string;
}

// ======================================================
// SERVICE: SOLICITAÇÃO DE RESET DE SENHA
// ======================================================
export async function requestPasswordReset(input: ForgotPasswordInput) {
  const { email } = input;

  // --------------------------------------------------
  // BUSCA USUÁRIO PELO EMAIL
  // --------------------------------------------------
  const user = await passwordRepository.findUserByEmailForReset(email);

  // --------------------------------------------------
  // SEGURANÇA: NÃO REVELA SE O EMAIL EXISTE
  // --------------------------------------------------
  if (!user) {
    // Delay artificial para dificultar ataques de timing
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Retorna sucesso mesmo que o email não exista
    return {
      success: true,
      message: "Se o email existir, enviaremos instruções",
    };
  }

  // --------------------------------------------------
  // BLOQUEIO DE SOLICITAÇÕES FREQUENTES
  // --------------------------------------------------
  // Verifica se já existe um token válido (últimos 15 minutos)
  if (user.resetTokenExpiry && user.resetTokenExpiry > new Date()) {
    const timeLeft = Math.ceil(
      (user.resetTokenExpiry.getTime() - Date.now()) / 1000 / 60
    );

    throw new Error(`RATE_LIMIT:${timeLeft}`);
  }

  // --------------------------------------------------
  // GERAÇÃO DO TOKEN DE RESET
  // --------------------------------------------------
  // Token aleatório e seguro (64 caracteres hex)
  const token = crypto.randomBytes(32).toString("hex");

  // Tempo de expiração: 15 minutos
  const expires = new Date(Date.now() + 15 * 60 * 1000);

  // --------------------------------------------------
  // ATUALIZA USUÁRIO COM TOKEN E EXPIRAÇÃO
  // --------------------------------------------------
  await passwordRepository.updateResetToken({
    userId: user.id,
    token,
    expires,
  });

  // --------------------------------------------------
  // ENVIO DO EMAIL DE RESET
  // --------------------------------------------------
  const frontendUrl = process.env["FRONTEND_URL"] || "http://localhost:5173";

  await sendPasswordResetEmail(email, token, frontendUrl);

  console.log(`✅ Email de reset enviado para: ${email}`);

  return {
    success: true,
    message: "Email enviado com sucesso",
  };
}

// ======================================================
// SERVICE: REDEFINIÇÃO DE SENHA
// ======================================================
export async function resetPasswordWithToken(input: ResetPasswordInput) {
  const { token, newPassword } = input;

  // --------------------------------------------------
  // BUSCA USUÁRIO PELO TOKEN VÁLIDO
  // --------------------------------------------------
  const user = await passwordRepository.findUserByValidToken(token);

  // --------------------------------------------------
  // VALIDA TOKEN
  // --------------------------------------------------
  if (!user) {
    throw new Error("INVALID_TOKEN");
  }

  // --------------------------------------------------
  // CRIPTOGRAFIA DA NOVA SENHA
  // --------------------------------------------------
  // Bcrypt com 12 rounds (bom equilíbrio entre segurança e performance)
  const hashedPassword = await bcrypt.hash(newPassword, 12);

  // --------------------------------------------------
  // ATUALIZA SENHA E LIMPA TOKEN
  // --------------------------------------------------
  await passwordRepository.updatePasswordAndClearToken({
    userId: user.id,
    hashedPassword,
  });

  console.log(`✅ Senha redefinida para o usuário: ${user.email}`);

  return {
    success: true,
    message: "Senha redefinida com sucesso",
  };
}
