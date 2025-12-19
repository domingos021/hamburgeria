// ======================================================
// COMPONENTE: RateLimiterMiddleware
// ======================================================
//
// ARQUIVO:
// src/middleware/rateLimiter.ts
//
// DESCRIÇÃO:
// Middleware responsável por controlar e limitar a
// quantidade de requisições feitas à API, protegendo
// o sistema contra abusos e ataques de força bruta.
//
// FUNÇÃO:
// - Limitar requisições sensíveis, como reset de senha
// - Controlar o tráfego geral da API
// - Retornar mensagens padronizadas em caso de excesso
//
// OBJETIVOS:
// - Prevenir ataques de força bruta e DDoS
// - Aumentar a segurança das rotas críticas
// - Garantir estabilidade e disponibilidade da API
// - Centralizar políticas de rate limiting
// ======================================================

import rateLimit from "express-rate-limit";

// Rate limiter específico para reset de senha
export const passwordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 3, // máximo 3 tentativas por IP
  message: {
    error: "Muitas tentativas. Tente novamente em 15 minutos.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter geral para a API
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, // 100 requisições por IP a cada 15 min
  message: {
    error: "Muitas requisições. Tente novamente mais tarde.",
  },
});
