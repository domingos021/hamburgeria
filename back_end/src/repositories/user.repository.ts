// ======================================================
// ARQUIVO: src/repositories/user.repository.ts
// ======================================================
//
// COMPONENTE: User Repository
//
// DESCRIÇÃO:
// Repository responsável por centralizar TODAS as operações
// de acesso ao banco de dados relacionadas à entidade User.
//
// FUNÇÃO:
// Isolar a lógica de acesso ao banco de dados (Prisma) do
// resto da aplicação, seguindo o padrão Repository.
//
// OBJETIVOS:
// - Separar a lógica de acesso a dados da lógica de negócio
// - Facilitar testes (mock do repository ao invés do Prisma)
// - Permitir troca de ORM sem afetar services/controllers
// - Centralizar queries complexas em um único lugar
// - Melhorar manutenibilidade e escalabilidade
// ======================================================

import { prisma } from "../lib/db.js";

// ======================================================
// TIPOS DO REPOSITORY
// ======================================================
// Define os tipos de dados que o repository pode receber
// para criar ou atualizar usuários.

export interface CreateUserData {
  name?: string | null;
  email: string;
  password: string;
  cep: string;
  telefone: string;
}

export interface UpdateUserPasswordData {
  email: string;
  password: string;
}

// ======================================================
// REPOSITORY: BUSCAR USUÁRIO POR EMAIL
// ======================================================
// Busca um usuário no banco de dados usando o email como critério.
// Retorna null se o usuário não for encontrado.
export async function findUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email },
  });
}

// ======================================================
// REPOSITORY: BUSCAR USUÁRIO POR EMAIL COM SENHA
// ======================================================
// Busca um usuário incluindo a senha hasheada.
// Usado principalmente no processo de login para validar credenciais.
export async function findUserByEmailWithPassword(email: string) {
  return await prisma.user.findFirst({
    where: { email },
    select: {
      id: true,
      email: true,
      password: true,
      name: true,
      cep: true,
      telefone: true,
    },
  });
}

// ======================================================
// REPOSITORY: CRIAR NOVO USUÁRIO
// ======================================================
// Cria um novo usuário no banco de dados com os dados fornecidos.
// A senha já deve estar hasheada antes de chamar esta função.
export async function createUser(data: CreateUserData) {
  return await prisma.user.create({
    data: {
      name: data.name ?? null,
      email: data.email,
      password: data.password,
      cep: data.cep,
      telefone: data.telefone,
    },
  });
}

// ======================================================
// REPOSITORY: LISTAR TODOS OS USUÁRIOS
// ======================================================
// Retorna todos os usuários do banco de dados sem a senha.
// Usado para fins de teste e administração.
export async function listAllUsers() {
  return await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      cep: true,
      telefone: true,
    },
  });
}

// ======================================================
// REPOSITORY: ATUALIZAR SENHA DO USUÁRIO
// ======================================================
// Atualiza a senha de um usuário existente.
// A nova senha já deve estar hasheada antes de chamar esta função.
export async function updateUserPassword(data: UpdateUserPasswordData) {
  return await prisma.user.update({
    where: { email: data.email },
    data: { password: data.password },
  });
}
