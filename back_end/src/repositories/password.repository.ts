// ======================================================
// ARQUIVO: src/repositories/password.repository.ts
// ======================================================
//
// COMPONENTE: Password Repository
//
// DESCRIÇÃO:
// Repository responsável por todas as operações de banco
// de dados relacionadas ao fluxo de recuperação de senha.
//
// FUNÇÃO:
// Isolar queries específicas de reset de senha do resto
// da aplicação, seguindo o padrão Repository.
//
// OBJETIVOS:
// - Centralizar queries de reset de senha
// - Facilitar testes e manutenção
// - Permitir troca de ORM sem afetar services
// ======================================================

import { prisma } from "../lib/db.js";

// ======================================================
// TIPOS DO REPOSITORY
// ======================================================
export interface UpdateResetTokenData {
  userId: string;
  token: string;
  expires: Date;
}

export interface UpdatePasswordAndClearTokenData {
  userId: string;
  hashedPassword: string;
}

// ======================================================
// REPOSITORY: BUSCAR USUÁRIO POR EMAIL
// ======================================================
export async function findUserByEmailForReset(email: string) {
  return await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      resetToken: true,
      resetTokenExpiry: true,
    },
  });
}

// ======================================================
// REPOSITORY: BUSCAR USUÁRIO POR TOKEN VÁLIDO
// ======================================================
export async function findUserByValidToken(token: string) {
  return await prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiry: {
        gte: new Date(), // garante que o token não expirou
      },
    },
    select: {
      id: true,
      email: true,
    },
  });
}

// ======================================================
// REPOSITORY: ATUALIZAR TOKEN DE RESET
// ======================================================
export async function updateResetToken(data: UpdateResetTokenData) {
  return await prisma.user.update({
    where: { id: data.userId },
    data: {
      resetToken: data.token,
      resetTokenExpiry: data.expires,
    },
  });
}

// ======================================================
// REPOSITORY: ATUALIZAR SENHA E LIMPAR TOKEN
// ======================================================
export async function updatePasswordAndClearToken(
  data: UpdatePasswordAndClearTokenData
) {
  return await prisma.user.update({
    where: { id: data.userId },
    data: {
      password: data.hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    },
  });
}
