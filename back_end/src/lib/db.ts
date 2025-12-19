// ======================================================
// COMPONENTE: DatabaseConnection (Prisma + PostgreSQL)
// ======================================================
//
// ARQUIVO:
// src/lib/db.ts
//
// DESCRIÇÃO:
// Módulo responsável pela configuração, inicialização e
// gerenciamento da conexão com o banco de dados PostgreSQL
// utilizando Prisma ORM com adapter nativo do pg.
//
// FUNÇÃO:
// - Carregar variáveis de ambiente
// - Criar e gerenciar o pool de conexões do PostgreSQL
// - Configurar o Prisma Client com adapter PostgreSQL
// - Disponibilizar uma instância única do Prisma
// - Garantir conexão segura e eficiente com o banco
//
// OBJETIVOS:
// - Centralizar a configuração de acesso ao banco de dados
// - Garantir performance através de connection pooling
// - Facilitar debug e observabilidade das queries
// - Assegurar encerramento correto das conexões (graceful shutdown)
// - Fornecer base sólida e confiável para todo o backend
// ======================================================

// ============================================
// CONFIGURAÇÃO DE VARIÁVEIS DE AMBIENTE
// ============================================
import "dotenv/config";

// ============================================
// IMPORTS DO POSTGRESQL E PRISMA
// ============================================
import { Pool } from "pg";
// Importa o Pool do PostgreSQL, responsável por gerenciar múltiplas conexões
// com o banco de dados de forma eficiente (connection pooling)

import { PrismaPg } from "@prisma/adapter-pg";
// Importa o adaptador Prisma para PostgreSQL, permitindo que o Prisma
// utilize o driver nativo do pg para comunicação com o banco

import { PrismaClient } from "../../generated/prisma/index.js";
// Importa o Prisma Client gerado automaticamente a partir do schema.prisma,
// fornecendo uma API tipada para realizar consultas e operações no banco

// ============================================
// CONFIGURAÇÃO DA CONNECTION STRING
// ============================================
const connectionString = process.env["DATABASE_URL"]!;

// ============================================
// CRIAÇÃO DO POOL DE CONEXÕES
// ============================================
const pool = new Pool({ connectionString });

// ============================================
// CONFIGURAÇÃO DO ADAPTER PRISMA
// ============================================
const adapter = new PrismaPg(pool);

// ============================================
// INSTÂNCIA DO PRISMA CLIENT
// ============================================
const prisma = new PrismaClient({
  adapter,
  log: ["query", "error", "warn"], // ✅ Adicionado para debug
});

// ============================================
// EXPORTAÇÃO
// ============================================
export { prisma };

/* 
  ---------------------------------------------------------
  TESTE DE CONEXÃO COM O BANCO DE DADOS VIA PRISMA
  ---------------------------------------------------------
*/
export async function testConnection() {
  try {
    await prisma.$connect();
    console.log("🔗 Oba! Conectado ao banco de dados com sucesso!");

    // ✅ Testa se a tabela User existe
    const count = await prisma.user.count();
    console.log(`📊 Total de usuários no banco: ${count}`);
  } catch (error) {
    console.error("❌ Erro ao conectar ao banco de dados:");
    console.error(error);

    // ✅ Diagnóstico de erros comuns
    if (error instanceof Error) {
      if (error.message.includes("does not exist")) {
        console.log("💡 Execute: npx prisma db push");
      }
    }

    process.exit(1);
  }
  // ✅ REMOVIDO: await prisma.$disconnect()
  // Mantém a conexão ativa para o servidor usar!
}

// ============================================
// GRACEFUL SHUTDOWN
// ============================================
process.on("SIGINT", async () => {
  console.log("\n🛑 Encerrando servidor...");
  await prisma.$disconnect();
  await pool.end();
  console.log("👋 Conexões fechadas");
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  await pool.end();
  process.exit(0);
});
