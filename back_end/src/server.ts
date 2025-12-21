import express from "express";
import helmet from "helmet";
import cors from "cors";
import { verifyMailConnection } from "./lib/mail.js";
import { generalLimiter } from "./middleware/rateLimiter.js";
import passwordRoutes from "./routes/password.routes.js";
import authRoutes from "./routes/auth_routes.js";
import testRoutes from "../src/routes/routeTeste.js"; // ← ADICIONE ESTA LINHA
import { prisma } from "./lib/db.js";

const app = express();

// ======================================================
// SEGURANÇA - HELMET
// ======================================================
app.use(helmet());

// ======================================================
// CORS
// ======================================================
app.use(
  cors({
    origin: process.env["FRONTEND_URL"] || "http://localhost:5173",
    credentials: true,
  })
);

// ======================================================
// RATE LIMITING GERAL
// ======================================================
app.use(generalLimiter);

// ======================================================
// BODY PARSER
// ======================================================
app.use(express.json());

// ======================================================
// ROTAS
// ======================================================
app.use(passwordRoutes);
app.use(authRoutes);
app.use("/api/test", testRoutes); // ← ADICIONE ESTA LINHA

// ======================================================
// VERIFICAÇÃO DE EMAIL
// ======================================================
verifyMailConnection();

// ======================================================
// VERIFICAÇÃO DO BANCO DE DADOS
// ======================================================
prisma
  .$connect()
  .then(() => console.log("🔗 Oba! Conectado ao banco de dados com sucesso!"))
  .catch((error) => console.error("❌ Erro ao conectar no banco:", error));

// ======================================================
// INICIAR SERVIDOR
// ======================================================
const PORT = process.env["PORT"] || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});

// site (resend) para criar chave e enviar ao email para redefinição se senha
