import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { testConnection } from "./lib/db.js";
import { verifyMailConnection } from "../src/lib/mail.js";

import authRoutes from "../src/routes/auth_routes.js";
import passwordRoutes from "../src/routes/password.routes.js";

const server = express();

server.use(express.json());
server.use(cors());

server.use((req: Request, res: Response, next: NextFunction) => {
  console.log("━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📍 Rota:", req.method, req.url);
  console.log("📦 Body:", req.body);
  console.log("━━━━━━━━━━━━━━━━━━━━━━");
  next();
});

server.use(authRoutes);
server.use(passwordRoutes);

const PORT = Number(process.env["PORT"]) || 3000;

server.listen(PORT, async () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  await testConnection();
  await verifyMailConnection();
});
