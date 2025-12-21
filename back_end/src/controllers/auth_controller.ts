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
// ======================================================

import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import { prisma } from "../lib/db.js";
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

// ======================================================
// CONFIGURAÇÃO DO JWT
// ======================================================
// JWT (JSON Web Token) é usado para autenticar usuários
// sem precisar enviar email e senha a cada requisição.

// JWT_SECRET:
// - Chave secreta usada para assinar o token
// - Deve ser **mantida em segredo** e nunca exposta publicamente
// - Em produção, sempre use uma chave forte via variáveis de ambiente
const JWT_SECRET =
  process.env["JWT_SECRET"] ?? "your-secret-key-change-in-production";

// JWT_EXPIRES_IN:
// - Define o tempo de validade do token
// - Pode ser em segundos, minutos, horas ou dias (ex: "1d", "12h")
// - O token expira automaticamente após esse período
// - A configuração também pode ser obtida via variável de ambiente
const JWT_EXPIRES_IN = (process.env["JWT_EXPIRES_IN"] ?? "1d") as Exclude<
  SignOptions["expiresIn"],
  undefined
>;

// ======================================================
// FUNÇÃO AUXILIAR: GERAÇÃO DE TOKEN JWT
// ======================================================
function generateToken(userId: string, email: string): string {
  return jwt.sign(
    {
      userId,
      email,
    },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN, // agora o tipo é number | StringValue (sem undefined)
    }
  );
}

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

    console.log("📝 Tentando registrar:", email);

    // ======================================================
    // PASSO Nº 0, VERIFICA SE OS RESPECTIVOS CAMPOS ESTÃO VAZIOS
    // ======================================================
    console.log("📝 Tentando registrar:", email);

    // ======================================================
    // PASSO Nº 1.1 — VERIFICAÇÃO DEFENSIVA EXTRA (REDUNDANTE)
    // ======================================================
    // ⚠️ IMPORTANTE:
    // Esta verificação é tecnicamente REDUNDANTE, pois o Zod já garante
    // que esses campos existam e sejam válidos.
    //
    // Ela foi mantida propositalmente como uma camada defensiva adicional
    // para maior clareza didática e proteção contra alterações futuras
    // no schema de validação.
    //
    // Em aplicações profissionais, normalmente confia-se apenas no Zod.
    if (!name || !email || !password || !cep || !telefone) {
      return response.status(400).json({
        message: "Todos os campos devem estar preenchidos",
      });
    }

    // ======================================================
    // PASSO Nº 2 — VERIFICAÇÃO DE USUÁRIO JÁ EXISTENTE pelo email
    // ======================================================
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });
    //se o email ja existe retorna erro
    if (existingUser) {
      return response.status(409).json({
        error: "Email já cadastrado, por favou use outro Email",
      });
    }

    // ======================================================
    // PASSO Nº 3 — GERAÇÃO DO HASH DA SENHA
    // ======================================================

    // Gera um hash seguro da senha informada pelo usuário antes de salvar no banco.
    // O bcrypt aplica múltiplas rodadas de processamento para dificultar ataques de força bruta.
    const hashedPassword = await bcrypt.hash(
      password, // Senha em texto puro enviada pelo usuário no cadastro
      12 // Número de rounds (custo): 12 é um bom equilíbrio entre segurança e performance
    );

    console.log("🔐 Senha hasheada com sucesso");

    // ======================================================
    // PASSO Nº 4 — CRIAÇÃO DO NOVO USUÁRIO NO BANCO DE DADOS

    // USER=> tabela no banco de dados
    // newUser => criação do novo usuario para o banco de dados
    //CADASTRANDO AS INFORMAÇÃO NO BANCO DE DADOS
    // ======================================================
    const newUser = await prisma.user.create({
      data: {
        name: name ?? null, // Converte undefined para null
        email,
        password: hashedPassword, //criptografa o password
        cep,
        telefone,
      },
    });

    console.log("✅ Usuário criado:", newUser.email);

    // ======================================================
    // PASSO Nº 5 — GERAÇÃO DO TOKEN JWT
    // ======================================================
    // O token JWT serve para:
    // - Autenticar o usuário após o login ou cadastro
    // - Provar que o usuário está autorizado a acessar rotas protegidas
    // - Evitar que o usuário precise enviar email e senha a cada requisição
    // - Transportar de forma segura informações básicas do usuário (ex: id e email)
    // - Permitir o controle de expiração da sessão (ex: token válido por X tempo)
    //
    // Esse token será enviado ao frontend e armazenado (ex: localStorage ou cookies)
    // Em cada requisição protegida, o frontend envia o token no header Authorization
    // Exemplo: Authorization: Bearer <token>
    //
    const token = generateToken(newUser.id, newUser.email);

    console.log("🔑 Token JWT gerado com sucesso");

    // ======================================================
    // PASSO Nº 6 — REMOÇÃO DA SENHA DA RESPOSTA
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
    //
    const { password: _, ...userWithoutPassword } = newUser;

    // ======================================================
    // PASSO Nº 7 — RETORNO DA RESPOSTA DE SUCESSO
    // ======================================================
    return response.status(201).json({
      success: true,
      message: "Usuário criado com sucesso",
      user: userWithoutPassword,
      token, // Token JWT para autenticação imediata
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

    console.log("🔍 Tentando login:", email);

    // ======================================================
    // PASSO Nº 2 — BUSCA DO USUÁRIO NO BANCO DE DADOS
    // ======================================================
    const user = await prisma.user.findFirst({
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

    console.log("📦 Usuário encontrado:", user ? "Sim" : "Não");

    // ======================================================
    // PASSO Nº 3 — VERIFICAÇÃO DA EXISTÊNCIA DO USUÁRIO
    // ======================================================
    if (!user) {
      return response.status(401).json({
        error: "Credenciais inválidas",
      });
    }

    // ======================================================
    // PASSO Nº 4 — COMPARAÇÃO DA SENHA COM O HASH
    // ======================================================
    const isPasswordValid = await bcrypt.compare(password, user.password);

    console.log("🔐 Senha válida:", isPasswordValid ? "Sim" : "Não");

    // ======================================================
    // PASSO Nº 5 — VALIDAÇÃO DO RESULTADO
    // ======================================================
    if (!isPasswordValid) {
      return response.status(401).json({
        error: "Credenciais inválidas",
      });
    }

    // ======================================================
    // PASSO Nº 6 — GERAÇÃO DO TOKEN JWT
    // ======================================================
    const token = generateToken(user.id, user.email);

    console.log("🔑 Token JWT gerado com sucesso");

    // ======================================================
    // PASSO Nº 7 — REMOÇÃO DA SENHA DA RESPOSTA
    // ======================================================
    const { password: _, ...userWithoutPassword } = user;

    console.log("✅ Login bem-sucedido");

    // ======================================================
    // PASSO Nº 8 — RETORNO DA RESPOSTA DE SUCESSO
    // ======================================================
    return response.status(200).json({
      success: true,
      user: userWithoutPassword,
      token, // Token JWT para autenticação nas próximas requisições
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
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        cep: true,
        telefone: true,
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
    // ======================================================
    // VALIDAÇÃO DOS DADOS COM ZOD
    // ======================================================
    const validatedData: UpdatePasswordInput = updatePasswordSchema.parse(
      request.body
    );
    const { email, newPassword } = validatedData;

    // ======================================================
    // GERAÇÃO DO HASH DA NOVA SENHA
    // ======================================================
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // ======================================================
    // ATUALIZAÇÃO DA SENHA NO BANCO
    // ======================================================
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
