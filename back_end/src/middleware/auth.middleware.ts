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
// - Validar tokens JWT enviados no header Authorization
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
// MIDDLEWARE: AUTENTICAÇÃO JWT
// ======================================================
export function authenticateToken(
  request: Request,
  response: Response,
  next: NextFunction
): void {
  try {
    // ======================================================
    // PASSO Nº 1 — EXTRAÇÃO DO TOKEN DO HEADER
    // ======================================================
    // Busca o header Authorization que deve estar no formato: "Bearer TOKEN"
    const authHeader = request.headers.authorization;

    console.log(
      "🔍 Header Authorization:",
      authHeader ? "Presente" : "Ausente"
    );

    // Verifica se o header existe
    if (!authHeader) {
      response.status(401).json({
        error: "Token de autenticação não fornecido",
        message: "É necessário estar autenticado para acessar este recurso",
      });
      return;
    }

    // ======================================================
    // PASSO Nº 2 — SEPARAÇÃO DO TOKEN
    // ======================================================
    // Separa "Bearer" do token real
    // Formato esperado: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    const parts = authHeader.split(" ");

    // Valida o formato do header
    if (parts.length !== 2) {
      response.status(401).json({
        error: "Formato de token inválido",
        message: "O token deve estar no formato: Bearer [token]",
      });
      return;
    }

    const [scheme, token] = parts;

    // Garantir que scheme e token não são undefined
    if (!scheme || !token) {
      response.status(401).json({
        error: "Formato de token inválido",
        message: "O token deve estar no formato: Bearer [token]",
      });
      return;
    }

    // Verifica se o scheme é "Bearer"
    if (!/^Bearer$/i.test(scheme)) {
      response.status(401).json({
        error: "Formato de token inválido",
        message: "O token deve começar com 'Bearer'",
      });
      return;
    }

    console.log("🔑 Token extraído com sucesso");

    // ======================================================
    // PASSO Nº 3 — VERIFICAÇÃO E DECODIFICAÇÃO DO TOKEN
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
        // PASSO Nº 4 — ANEXA DADOS DO USUÁRIO À REQUISIÇÃO
        // ======================================================
        // Adiciona as informações do usuário ao objeto request
        // Isso permite que os controllers acessem request.user
        request.user = payload;

        // ======================================================
        // PASSO Nº 5 — PROSSEGUE PARA O PRÓXIMO MIDDLEWARE/CONTROLLER
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
  const authHeader = request.headers.authorization;

  // Se não houver token, apenas prossegue sem autenticar
  if (!authHeader) {
    next();
    return;
  }

  try {
    const parts = authHeader.split(" ");

    if (parts.length === 2) {
      const [scheme, token] = parts;

      // Garantir que scheme e token não são undefined
      if (scheme && token && /^Bearer$/i.test(scheme)) {
        try {
          const decoded = jwt.verify(token, JWT_SECRET);

          if (
            typeof decoded === "object" &&
            decoded !== null &&
            "userId" in decoded &&
            "email" in decoded
          ) {
            request.user = decoded as JwtPayload;
            console.log(
              "✅ Usuário autenticado opcionalmente:",
              request.user.email
            );
          }
        } catch {
          // Ignora erros silenciosamente
        }
      }
    }
  } catch (error) {
    // Falha silenciosa - não bloqueia a requisição
    console.log("ℹ️ Token opcional inválido ou expirado");
  }

  next();
  return;
}
