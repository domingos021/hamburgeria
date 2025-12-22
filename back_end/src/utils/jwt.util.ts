// ======================================================
// ARQUIVO: src/utils/jwt.util.ts
// ======================================================
//
// COMPONENTE: JWT Utility
//
// DESCRIÇÃO:
// Utilitário responsável por centralizar todas as operações
// relacionadas à geração e validação de tokens JWT.
//
// FUNÇÃO:
// Gerenciar a criação de tokens de autenticação de forma
// segura e reutilizável em toda a aplicação.
//
// OBJETIVOS:
// - Centralizar a lógica de JWT em um único lugar
// - Facilitar testes e manutenção
// - Garantir configuração consistente de tokens
// - Permitir fácil substituição da estratégia de autenticação
// ======================================================

import jwt, { type SignOptions } from "jsonwebtoken";

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
// FUNÇÃO: GERAÇÃO DE TOKEN JWT
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
export function generateToken(userId: string, email: string): string {
  return jwt.sign(
    {
      userId,
      email,
    },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN,
    }
  );
}
