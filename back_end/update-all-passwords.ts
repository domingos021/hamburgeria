// ======================================================
// COMPONENTE: PasswordMigrationScript
// ======================================================
//
// ARQUIVO:
// updateAllPasswords.ts
//
// DESCRIÇÃO:
// Script utilitário responsável por verificar e corrigir
// o armazenamento de senhas no banco de dados, garantindo
// que todas estejam devidamente criptografadas com bcrypt.
//
// FUNÇÃO:
// - Percorrer todos os usuários cadastrados
// - Identificar senhas armazenadas em texto puro
// - Gerar hash seguro para senhas não criptografadas
// - Atualizar os registros no banco de dados
//
// OBJETIVOS:
// - Corrigir falhas de segurança herdadas
// - Padronizar o armazenamento de senhas
// - Apoiar processos de migração de dados
// - Garantir conformidade com boas práticas de segurança
//
// OBSERVAÇÕES:
// - Deve ser executado apenas em ambiente controlado
// - Não deve ser exposto como endpoint da API
// - Recomendado executar uma única vez ou sob demanda
// ======================================================

// Carrega automaticamente as variáveis de ambiente definidas no arquivo .env
// Isso permite acesso seguro a credenciais e configurações sensíveis
import "dotenv/config";

// Importa o bcrypt, biblioteca utilizada para gerar hashes seguros de senha
// O hash é irreversível, protegendo as senhas mesmo em caso de vazamento
import bcrypt from "bcrypt";

// Importa a instância do Prisma Client responsável pela comunicação
// com o banco de dados PostgreSQL
import { prisma } from "./src/lib/db.js";

// ======================================================
// FUNÇÃO: ATUALIZA TODAS AS SENHAS DO BANCO DE DADOS
// ======================================================
//
// Esta função percorre todos os usuários cadastrados
// e garante que todas as senhas estejam armazenadas
// no formato hasheado (bcrypt).
//
// Útil para:
// - Migração de sistemas antigos
// - Correção de dados inseguros
// - Padronização de segurança
//
async function updateAllPasswords() {
  try {
    // --------------------------------------------------
    // BUSCA TODOS OS USUÁRIOS DO BANCO
    // --------------------------------------------------
    // Retorna apenas os campos necessários para evitar
    // carregamento desnecessário de dados
    const users = await prisma.user.findMany({
      select: { email: true, password: true },
    });

    console.log(`📊 Total de usuários encontrados: ${users.length}`);

    // --------------------------------------------------
    // PERCORRE CADA USUÁRIO INDIVIDUALMENTE
    // --------------------------------------------------
    for (const user of users) {
      // --------------------------------------------------
      // VERIFICA SE A SENHA JÁ ESTÁ HASHEADA
      // --------------------------------------------------
      // Senhas bcrypt normalmente iniciam com "$2b$"
      // Caso não inicie, assume-se que a senha está em texto puro
      if (!user.password.startsWith("$2b$")) {
        console.log(`🔄 Atualizando senha de: ${user.email}`);

        // --------------------------------------------------
        // GERA O HASH DA SENHA ATUAL
        // --------------------------------------------------
        // O valor 10 representa o custo de processamento (salt rounds)
        const hashedPassword = await bcrypt.hash(user.password, 10);

        // --------------------------------------------------
        // ATUALIZA A SENHA NO BANCO DE DADOS
        // --------------------------------------------------
        await prisma.user.update({
          where: { email: user.email },
          data: { password: hashedPassword },
        });

        console.log(`✅ Senha atualizada com sucesso: ${user.email}`);
      } else {
        // --------------------------------------------------
        // CASO A SENHA JÁ ESTEJA SEGURA, NÃO REALIZA ALTERAÇÃO
        // --------------------------------------------------
        console.log(`⏭️  Senha já hasheada: ${user.email}`);
      }
    }

    // --------------------------------------------------
    // FINALIZAÇÃO DO PROCESSO
    // --------------------------------------------------
    console.log("\n🎉 Todas as senhas foram verificadas e atualizadas!");

    // Encerra corretamente a conexão com o banco de dados
    await prisma.$disconnect();
  } catch (error) {
    // --------------------------------------------------
    // TRATAMENTO DE ERROS
    // --------------------------------------------------
    console.error("❌ Erro durante a atualização das senhas:", error);

    // Finaliza o processo com código de erro
    process.exit(1);
  }
}

// ======================================================
// EXECUÇÃO DO SCRIPT
// ======================================================

// Dispara a execução da função de atualização
updateAllPasswords();
