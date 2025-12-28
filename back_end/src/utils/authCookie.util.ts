// ======================================================
// ARQUIVO: src/utils/authCookie.util.ts
// ======================================================

import { Response } from "express";

// ======================================================
// FUNÇÃO: setAuthCookie
// ======================================================
// Armazena o token JWT em um cookie HttpOnly seguro.
// ======================================================
export function setAuthCookie(response: Response, token: string) {
  // Determina se a aplicação está em ambiente de produção
  const isProduction = process.env["NODE_ENV"] === "production";

  response.cookie("token", token, {
    // Impede acesso ao cookie via JavaScript (proteção XSS)
    httpOnly: true,

    // Garante transmissão apenas via HTTPS em produção
    secure: isProduction,

    // Protege contra CSRF restringindo envio cross-site
    sameSite: "strict",

    // Disponível para toda a aplicação
    path: "/",

    // Tempo de vida do cookie (7 dias)
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

// ======================================================
// FUNÇÃO: clearAuthCookie
// ======================================================
// Remove o cookie de autenticação do navegador.
// Deve usar EXATAMENTE as mesmas opções do setAuthCookie.
// ======================================================
export function clearAuthCookie(response: Response) {
  const isProduction = process.env["NODE_ENV"] === "production";

  response.clearCookie("token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: "strict",
    path: "/", // precisa ser IGUAL ao do setAuthCookie
  });
}
