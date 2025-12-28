// ======================================================
// ARQUIVO: src/server.ts
// ======================================================
//
// RESPONSABILIDADE:
// - Inicializar o servidor Express
// - Configurar segurança, CORS e middlewares globais
// - Registrar rotas da aplicação
// - Conectar com banco de dados
// - Subir o servidor HTTP
//
// ======================================================

// ======================================================
// 1️⃣ IMPORTAÇÕES
// ======================================================

import express from "express";
import helmet from "helmet";
import cors from "cors";
import * as cookieParser from "cookie-parser";

import { verifyMailConnection } from "./lib/mail.js";
import { generalLimiter } from "./middleware/rateLimiter.js";

import passwordRoutes from "./routes/password.routes.js";

// 🔴 IMPORT CORRETO (bate com o nome real do arquivo)
import authRoutes from "./routes/auth_routes.js";

import testRoutes from "./routes/routeTeste.js";

import { prisma } from "./lib/db.js";

// ======================================================
// 2️⃣ INICIALIZAÇÃO DO APP
// ======================================================

const app = express();

// ======================================================
// 3️⃣ SEGURANÇA — HELMET
// ======================================================

app.use(helmet());

// ======================================================
// 4️⃣ CORS
// ======================================================

app.use(
  cors({
    origin: process.env["FRONTEND_URL"] || "http://localhost:5173",
    credentials: true,
  })
);

// ======================================================
// 5️⃣ RATE LIMITING GLOBAL
// ======================================================

app.use(generalLimiter);

// ======================================================
// 6️⃣ BODY PARSER (JSON)
// ======================================================

app.use(express.json());

// ======================================================
// 7️⃣ COOKIE PARSER (OBRIGATÓRIO PARA AUTH COM COOKIE)
// ======================================================

app.use(cookieParser.default());

// ======================================================
// 8️⃣ REGISTRO DAS ROTAS
// ======================================================
//
// IMPORTANTE:
// - authRoutes é registrado com prefixo "/auth"
// - Isso garante:
//   /auth/login
//   /auth/register
//   /auth/logout
//
app.use("/auth", authRoutes);

// Rotas de recuperação de senha
app.use(passwordRoutes);

// Rotas de teste
app.use("/api/test", testRoutes);

// ======================================================
// 9️⃣ VERIFICAÇÃO DO SERVIÇO DE EMAIL
// ======================================================

verifyMailConnection();

// ======================================================
// 🔟 CONEXÃO COM O BANCO DE DADOS
// ======================================================

prisma
  .$connect()
  .then(() => {
    console.log("🔗 Oba! Conectado ao banco de dados com sucesso!");
  })
  .catch((error) => {
    console.error("❌ Erro ao conectar no banco:", error);
  });

// ======================================================
// 1️⃣1️⃣ INICIALIZAÇÃO DO SERVIDOR
// ======================================================

const PORT = process.env["PORT"] || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});

/*
ROTAS DISPONÍVEIS:

POST   /auth/login
POST   /auth/register
POST   /auth/logout
GET    /auth/users
PATCH  /auth/update-password
*/
