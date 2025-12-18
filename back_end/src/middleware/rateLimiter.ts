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
