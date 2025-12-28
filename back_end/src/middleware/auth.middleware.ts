// ======================================================
// ARQUIVO: src/middleware/auth.middleware.ts
// ======================================================
//
// COMPONENTE: AuthMiddleware
//
// DESCRIÇÃO:
// Middleware responsável por validar e autenticar tokens JWT
// nas requisições que exigem autenticação.
//
// FUNÇÃO:
// Interceptar requisições, verificar a presença e validade
// do token JWT, e permitir ou bloquear o acesso às rotas
// protegidas baseado na autenticação.
//
// OBJETIVOS:
// - Validar tokens JWT enviados via cookie
// - Decodificar e anexar informações do usuário à requisição
// - Proteger rotas que requerem autenticação
// - Tratar erros de token (expirado, inválido, ausente)
// ======================================================

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// ======================================================
// CONFIGURAÇÃO DO JWT
// ======================================================

// Função helper para obter o JWT_SECRET de forma segura
function getJwtSecret(): string {
  const secret = process.env["JWT_SECRET"];
  if (!secret) {
    throw new Error("JWT_SECRET não definido nas variáveis de ambiente");
  }
  return secret;
}

// Validação em runtime (a aplicação para se não existir)
const JWT_SECRET = getJwtSecret();

// ======================================================
// INTERFACE: PAYLOAD DO TOKEN JWT
// ======================================================
interface JwtPayload {
  userId: string;
  email: string;
  iat?: number; // Issued at (timestamp de criação)
  exp?: number; // Expiration (timestamp de expiração)
}

// ======================================================
// EXTENSÃO DO TIPO REQUEST
// ======================================================
// Estende o tipo Request do Express para incluir dados do usuário autenticado
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

// ======================================================
// MIDDLEWARE: AUTENTICAÇÃO JWT (LÊ DO COOKIE)
// ======================================================
export function authenticateToken(
  request: Request,
  response: Response,
  next: NextFunction
): void {
  try {
    // ======================================================
    // PASSO Nº 1 — EXTRAÇÃO DO TOKEN DO COOKIE
    // ======================================================
    // 🔹 CORRIGIDO: usando notação de colchetes
    const token = request.cookies?.["token"];

    console.log("🔍 Token do cookie:", token ? "Presente" : "Ausente");

    // Verifica se o token existe
    if (!token) {
      response.status(401).json({
        error: "Token de autenticação não fornecido",
        message: "É necessário estar autenticado para acessar este recurso",
      });
      return;
    }

    console.log("🔑 Token extraído do cookie com sucesso");

    // ======================================================
    // PASSO Nº 2 — VERIFICAÇÃO E DECODIFICAÇÃO DO TOKEN
    // ======================================================
    try {
      // Verifica e decodifica o token usando a chave secreta
      const decoded = jwt.verify(token, JWT_SECRET);

      // Valida se o decoded tem a estrutura esperada
      if (
        typeof decoded === "object" &&
        decoded !== null &&
        "userId" in decoded &&
        "email" in decoded
      ) {
        const payload = decoded as JwtPayload;
        console.log("✅ Token válido para usuário:", payload.email);

        // ======================================================
        // PASSO Nº 3 — ANEXA DADOS DO USUÁRIO À REQUISIÇÃO
        // ======================================================
        // Adiciona as informações do usuário ao objeto request
        // Isso permite que os controllers acessem request.user
        request.user = payload;

        // ======================================================
        // PASSO Nº 4 — PROSSEGUE PARA O PRÓXIMO MIDDLEWARE/CONTROLLER
        // ======================================================
        next();
        return;
      } else {
        console.log("❌ Token com formato inválido");
        response.status(401).json({
          error: "Token inválido",
          message: "O token não contém as informações necessárias.",
        });
        return;
      }
    } catch (error) {
      // ======================================================
      // TRATAMENTO DE ERROS ESPECÍFICOS DO JWT
      // ======================================================
      if (error instanceof jwt.TokenExpiredError) {
        console.log("⏰ Token expirado");
        response.status(401).json({
          error: "Token expirado",
          message:
            "Seu token de autenticação expirou. Por favor, faça login novamente.",
        });
        return;
      }

      if (error instanceof jwt.JsonWebTokenError) {
        console.log("❌ Token inválido");
        response.status(401).json({
          error: "Token inválido",
          message: "O token fornecido é inválido ou foi adulterado.",
        });
        return;
      }

      // Erro genérico de validação
      console.error("❌ Erro ao validar token:", error);
      response.status(401).json({
        error: "Falha na autenticação",
        message: "Não foi possível validar seu token de autenticação.",
      });
      return;
    }
  } catch (error) {
    // ======================================================
    // TRATAMENTO DE ERROS INESPERADOS
    // ======================================================
    console.error("❌ Erro inesperado no middleware de autenticação:", error);
    response.status(500).json({
      error: "Erro interno do servidor",
      message: "Ocorreu um erro ao processar sua autenticação.",
    });
    return;
  }
}

// ======================================================
// MIDDLEWARE OPCIONAL: AUTENTICAÇÃO PARCIAL
// ======================================================
// Middleware que tenta autenticar, mas não bloqueia se falhar
// Útil para rotas que funcionam tanto autenticadas quanto não autenticadas
export function optionalAuth(
  request: Request,
  _response: Response,
  next: NextFunction
): void {
  // 🔹 CORRIGIDO: usando notação de colchetes
  const token = request.cookies?.["token"];

  // Se não houver token, apenas prossegue sem autenticar
  if (!token) {
    next();
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (
      typeof decoded === "object" &&
      decoded !== null &&
      "userId" in decoded &&
      "email" in decoded
    ) {
      request.user = decoded as JwtPayload;
      console.log("✅ Usuário autenticado opcionalmente:", request.user.email);
    }
  } catch {
    // Ignora erros silenciosamente
    console.log("ℹ️ Token opcional inválido ou expirado");
  }

  next();
  return;
}
