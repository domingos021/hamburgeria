// ======================================================
// ARQUIVO: src/services/auth.service.ts
// ======================================================
//
// COMPONENTE: Auth Service
//
// DESCRIÇÃO:
// Service responsável por centralizar TODA a lógica de negócio
// relacionada à autenticação e gerenciamento de usuários.
//
// FUNÇÃO:
// Implementar as regras de negócio, validações e orquestração
// entre diferentes repositories, mantendo os controllers simples.
//
// OBJETIVOS:
// - Separar lógica de negócio dos controllers
// - Facilitar testes unitários (mock de repositories)
// - Permitir reutilização de lógica em diferentes controllers
// - Centralizar regras de autenticação complexas
// - Melhorar manutenibilidade e escalabilidade
// ======================================================

import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt.util.js";
import * as userRepository from "../repositories/user.repository.js";

// ======================================================
// TIPOS DO SERVICE
// ======================================================
export interface RegisterUserInput {
  name?: string | undefined;
  email: string;
  password: string;
  cep: string;
  telefone: string;
}

export interface LoginUserInput {
  email: string;
  password: string;
}

export interface UpdatePasswordInput {
  email: string;
  newPassword: string;
}

// ======================================================
// SERVICE: REGISTRO DE USUÁRIO
// ======================================================
export async function registerUser(input: RegisterUserInput) {
  const { email, password, name, cep, telefone } = input;

  console.log("📝 Tentando registrar:", email);

  // ======================================================
  // PASSO Nº 1 — VERIFICAÇÃO DE USUÁRIO JÁ EXISTENTE
  // ======================================================
  // Verifica se já existe um usuário cadastrado com o email fornecido.
  // Se existir, lança um erro para impedir o cadastro duplicado.
  const existingUser = await userRepository.findUserByEmail(email);

  if (existingUser) {
    throw new Error("EMAIL_ALREADY_EXISTS");
  }

  // ======================================================
  // PASSO Nº 2 — GERAÇÃO DO HASH DA SENHA
  // ======================================================
  // Gera um hash seguro da senha informada pelo usuário antes de salvar no banco.
  // O bcrypt aplica múltiplas rodadas de processamento para dificultar ataques de força bruta.
  const hashedPassword = await bcrypt.hash(
    password, // Senha em texto puro enviada pelo usuário no cadastro
    12 // Número de rounds (custo): 12 é um bom equilíbrio entre segurança e performance
  );

  console.log("🔐 Senha hasheada com sucesso");

  // ======================================================
  // PASSO Nº 3 — CRIAÇÃO DO NOVO USUÁRIO NO BANCO DE DADOS
  // ======================================================
  // Delega a criação do usuário para o repository, que gerencia
  // a comunicação com o banco de dados (Prisma).
  let newUser;

  try {
    newUser = await userRepository.createUser({
      name: name ?? null,
      email,
      password: hashedPassword,
      cep,
      telefone,
    });

    console.log("✅ Usuário criado:", newUser.email);
  } catch (error: any) {
    // ------------------------------------------------------
    // TRATAMENTO DE ERRO DE CONSTRAINT ÚNICA (EMAIL DUPLICADO)
    // ------------------------------------------------------
    // O Prisma lança o erro P2002 quando uma constraint UNIQUE
    // é violada (ex: email já existente no banco).
    if (error.code === "P2002") {
      throw new Error("EMAIL_ALREADY_EXISTS");
    }

    // Repassa qualquer outro erro inesperado
    throw error;
  }

  // ======================================================
  // PASSO Nº 4 — GERAÇÃO DO TOKEN JWT
  // ======================================================
  // Gera um token JWT para autenticar o usuário imediatamente após o registro.
  const token = generateToken(newUser.id, newUser.email);

  console.log("🔑 Token JWT gerado com sucesso");

  // ======================================================
  // PASSO Nº 5 — REMOÇÃO DA SENHA DA RESPOSTA
  // ======================================================
  // Aqui estamos criando um objeto chamado "userWithoutPassword":
  // - Estamos usando destructuring para separar a senha (password)
  // - O "_" indica que estamos ignorando esse valor (não vamos usá-lo)
  // - O operador "..." copia o restante das propriedades do usuário
  // Resultado: um objeto com todos os dados do usuário, exceto a senha
  //
  // Isso é importante para:
  // - Evitar expor a senha mesmo que seja hashada
  // - Garantir que a resposta enviada ao frontend não contenha dados sensíveis
  const { password: _, ...userWithoutPassword } = newUser;

  return {
    user: userWithoutPassword,
    token,
  };
}

// ======================================================
// SERVICE: LOGIN DE USUÁRIO
// ======================================================
export async function loginUser(input: LoginUserInput) {
  const { email, password } = input;

  console.log("🔍 Tentando login:", email);

  // ======================================================
  // PASSO Nº 1 — BUSCA DO USUÁRIO NO BANCO DE DADOS
  // ======================================================
  // Busca o usuário pelo email, incluindo a senha hasheada
  // para poder validar as credenciais.
  const user = await userRepository.findUserByEmailWithPassword(email);

  console.log("📦 Usuário encontrado:", user ? "Sim" : "Não");

  // ======================================================
  // PASSO Nº 2 — VERIFICAÇÃO DA EXISTÊNCIA DO USUÁRIO
  // ======================================================
  // Se o usuário não for encontrado, lança um erro genérico
  // para não revelar se o email existe ou não (segurança).
  if (!user) {
    throw new Error("INVALID_CREDENTIALS");
  }

  // ======================================================
  // PASSO Nº 3 — COMPARAÇÃO DA SENHA COM O HASH
  // ======================================================
  // Compara a senha fornecida com o hash armazenado no banco.
  // O bcrypt faz isso de forma segura, aplicando o mesmo processo
  // de hashing e comparando os resultados.
  const isPasswordValid = await bcrypt.compare(password, user.password);

  console.log("🔐 Senha válida:", isPasswordValid ? "Sim" : "Não");

  // ======================================================
  // PASSO Nº 4 — VALIDAÇÃO DO RESULTADO
  // ======================================================
  // Se a senha não for válida, lança o mesmo erro genérico
  // para manter a consistência e não revelar informações.
  if (!isPasswordValid) {
    throw new Error("INVALID_CREDENTIALS");
  }

  // ======================================================
  // PASSO Nº 5 — GERAÇÃO DO TOKEN JWT
  // ======================================================
  // Gera um token JWT para autenticar o usuário nas próximas requisições.
  const token = generateToken(user.id, user.email);

  console.log("🔑 Token JWT gerado com sucesso");

  // ======================================================
  // PASSO Nº 6 — REMOÇÃO DA SENHA DA RESPOSTA
  // ======================================================
  const { password: _, ...userWithoutPassword } = user;

  console.log("✅ Login bem-sucedido");

  return {
    user: userWithoutPassword,
    token,
  };
}

// ======================================================
// SERVICE: LISTAR TODOS OS USUÁRIOS
// ======================================================
export async function getAllUsers() {
  return await userRepository.listAllUsers();
}

// ======================================================
// SERVICE: ATUALIZAR SENHA
// ======================================================
export async function updatePassword(input: UpdatePasswordInput) {
  const { email, newPassword } = input;

  // ======================================================
  // PASSO Nº 1 — GERAÇÃO DO HASH DA NOVA SENHA
  // ======================================================
  // Gera o hash da nova senha antes de atualizar no banco.
  const hashedPassword = await bcrypt.hash(newPassword, 12);

  // ======================================================
  // PASSO Nº 2 — ATUALIZAÇÃO DA SENHA NO BANCO
  // ======================================================
  // Delega a atualização para o repository.
  const user = await userRepository.updateUserPassword({
    email,
    password: hashedPassword,
  });

  console.log("✅ Senha atualizada para:", email);

  return {
    email: user.email,
  };
}
