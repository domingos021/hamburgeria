# 🍔 Backend – Projeto Hamburgeria

Este é o backend da aplicação **Hamburgeria**, responsável pela API REST, regras de negócio e conexão com banco de dados PostgreSQL.

---

## 📌 Tecnologias utilizadas

- **Node.js** v20+
- **Express.js** - Framework web minimalista e flexível
- **TypeScript** - Superset JavaScript com tipagem estática
- **tsx** - Executor TypeScript moderno e rápido
- **Prisma ORM** - ORM type-safe para PostgreSQL
- **PostgreSQL** - Banco de dados relacional
- **Dotenv** - Gerenciamento de variáveis de ambiente

---

## 📁 Estrutura do projeto

```
back_end/
│
├── src/                    # Código-fonte TypeScript
│   ├── controllers/        # Controladores (lógica das rotas)
│   ├── routes/             # Definição das rotas da API
│   ├── services/           # Lógica de negócio
│   ├── middlewares/        # Middlewares customizados
│   ├── config/             # Configurações (banco, env, etc)
│   ├── utils/              # Funções utilitárias
│   ├── types/              # Tipos TypeScript customizados
│   └── server.ts           # Arquivo principal do servidor
│
├── prisma/                 # Configurações do Prisma
│   ├── schema.prisma       # Schema do banco de dados
│   ├── migrations/         # Histórico de migrações
│   └── seed.ts             # Dados iniciais (seed)
│
├── dist/                   # Código JavaScript compilado (gerado)
├── node_modules/           # Dependências instaladas
│
├── .env                    # Variáveis de ambiente (não commitar)
├── .env.example            # Exemplo de variáveis de ambiente
├── .gitignore              # Arquivos ignorados pelo Git
├── tsconfig.json           # Configuração do TypeScript
├── package.json            # Dependências e scripts
└── README.md               # Este arquivo
```

---

## 🚀 Como executar o projeto

### Pré-requisitos

- **Node.js** v20 ou superior
- **npm** v10 ou superior
- **PostgreSQL** instalado e rodando

### Instalação

1. Clone o repositório:

```bash
git clone https://github.com/domingos021/hamburgeria.git
cd hamburgeria/back_end
```

2. Instale as dependências:

```bash
npm install
```

3. Configure as variáveis de ambiente:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/hamburgeria?schema=public"
PORT=3000
NODE_ENV=development
```

4. Execute as migrations do Prisma:

```bash
npm run prisma:migrate
```

5. (Opcional) Popule o banco com dados iniciais:

```bash
npm run prisma:seed
```

### Executar em desenvolvimento

```bash
npm run dev
```

O servidor estará rodando em: `http://localhost:3000`

O **tsx watch** irá monitorar automaticamente mudanças nos arquivos `.ts` e reiniciar o servidor instantaneamente.

### Build para produção

```bash
npm run build
npm start
```

---

## 📜 Scripts disponíveis

### Desenvolvimento

- `npm run dev` - Inicia servidor em modo desenvolvimento com hot-reload (tsx watch)

### Build e Produção

- `npm run build` - Compila TypeScript para JavaScript na pasta `dist/`
- `npm start` - Executa a versão compilada em produção (`node dist/server.js`)

### Prisma

- `npm run prisma:generate` - Gera o Prisma Client
- `npm run prisma:migrate` - Executa migrações do banco de dados
- `npm run prisma:studio` - Abre o Prisma Studio (interface visual do banco)
- `npm run prisma:seed` - Popula o banco com dados iniciais

---

## ⚙️ Configurações

### tsconfig.json

O projeto usa **ES Modules (ESM)** com configurações TypeScript modernas:

- **module: "ESNext"** - Suporte a ES Modules modernos
- **moduleResolution: "bundler"** - Resolução otimizada para bundlers
- **target: "ES2022"** - Recursos JavaScript modernos
- **strict: true** - Verificação rigorosa de tipos
- **Source maps** - Facilita debug em desenvolvimento
- **Declaration maps** - Gera arquivos de definição TypeScript

### Prisma

O Prisma está configurado para usar:

- **PostgreSQL** como banco de dados
- **@prisma/adapter-pg** - Driver otimizado node-postgres
- Migrações automáticas em desenvolvimento
- Type-safety completa nas queries

### tsx

Executor TypeScript moderno que substitui ts-node:

- ⚡ **Mais rápido** - Usa esbuild internamente
- 🔄 **Watch mode** - Hot reload automático
- 🎯 **ESM nativo** - Suporte completo a ES Modules
- 📦 **Zero config** - Funciona out-of-the-box

---

## 🔑 Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Banco de dados PostgreSQL
DATABASE_URL="postgresql://usuario:senha@localhost:5432/hamburgeria?schema=public"

# Servidor
PORT=3000
NODE_ENV=development

# JWT / Autenticação (se usar)
JWT_SECRET=sua_chave_secreta_super_segura_aqui
JWT_EXPIRES_IN=7d

# API
API_VERSION=v1
```

---

## 📡 Endpoints da API

### Autenticação

- `POST /api/auth/register` - Cadastro de usuário
- `POST /api/auth/login` - Login

### Hambúrgueres

- `GET /api/hamburgueres` - Lista todos
- `GET /api/hamburgueres/:id` - Busca por ID
- `POST /api/hamburgueres` - Criar novo
- `PUT /api/hamburgueres/:id` - Atualizar
- `DELETE /api/hamburgueres/:id` - Deletar

### Pedidos

- `GET /api/pedidos` - Lista pedidos
- `POST /api/pedidos` - Criar pedido
- `GET /api/pedidos/:id` - Detalhes do pedido

---

## 🗄️ Schema do Banco de Dados

O Prisma gerencia o schema do banco. Exemplo básico:

```prisma
model Hamburguer {
  id          String   @id @default(uuid())
  nome        String
  descricao   String?
  preco       Decimal  @db.Decimal(10, 2)
  imagem      String?
  disponivel  Boolean  @default(true)
  criadoEm    DateTime @default(now())
  atualizadoEm DateTime @updatedAt

  pedidos     PedidoItem[]
}

model Pedido {
  id          String   @id @default(uuid())
  status      String   @default("pendente")
  total       Decimal  @db.Decimal(10, 2)
  criadoEm    DateTime @default(now())

  itens       PedidoItem[]
}
```

### Comandos úteis do Prisma

```bash
# Criar uma nova migration
npx prisma migrate dev --name nome_da_migration

# Atualizar o Prisma Client após mudanças no schema
npx prisma generate

# Visualizar o banco no navegador
npx prisma studio

# Reset do banco (CUIDADO em produção!)
npx prisma migrate reset
```

---

## 🧪 Testes

```bash
npm test
```

---

## 🤝 Como contribuir

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob a licença ISC. Veja o arquivo LICENSE para mais detalhes.

---

## 👨‍💻 Autor

Desenvolvido por **Domingos Dinis Jose Jovete**

- GitHub: [@domingos021](https://github.com/domingos021)
- Repositório: [hamburgeria](https://github.com/domingos021/hamburgeria)

---

## 🐛 Problemas conhecidos / Roadmap

- [ ] Adicionar testes unitários e de integração
- [ ] Implementar rate limiting
- [ ] Documentação automática com Swagger/OpenAPI
- [ ] Implementar cache com Redis
- [ ] Adicionar logs estruturados (Winston/Pino)
- [ ] Sistema de autenticação JWT completo
- [ ] Upload de imagens (multer + cloud storage)
- [ ] Validação de dados (Zod)

---

## 📚 Recursos úteis

- [Documentação Express](https://expressjs.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [tsx Documentation](https://tsx.is/)

---

## 📝 Notas de desenvolvimento

### ES Modules (ESM)

Este projeto usa **ES Modules nativos**. Isso significa:

- Usar `import/export` ao invés de `require/module.exports`
- Imports de arquivos locais devem incluir extensão `.js`:

  ```typescript
  // ✅ Correto
  import { router } from "./routes.js";

  // ❌ Errado
  import { router } from "./routes";
  ```

### Estrutura de Rota no Express

```typescript
app.get("/caminho-da-rota", (req, res) => {
  // ← Callback da rota começa aqui
  res.send("Olá, mundo!");
  // ← Callback termina aqui
});
// ← Aqui termina a definição da rota

// Estrutura:
app.get("rota", callback);
//   ↑        ↑           ↑
//   |        |           |
// Método   Caminho   Função que
//  HTTP    da rota    responde
```

### Hot Reload com tsx

O ambiente de desenvolvimento usa **tsx watch** que:

- ⚡ Recarrega instantaneamente ao detectar mudanças
- 🔍 Monitora automaticamente todos os arquivos `.ts` em `src/`
- 🚀 Muito mais rápido que ts-node tradicional
- 💪 Suporte nativo a ES Modules

### Type Safety com Prisma

O Prisma gera automaticamente tipos TypeScript para:

- Modelos do banco de dados
- Queries e mutations
- Relações entre tabelas

Isso garante **100% de type-safety** nas operações de banco de dados.

---

## 🔧 Troubleshooting

### Erro: "Unknown file extension .ts"

Se aparecer esse erro, certifique-se que:

1. O `package.json` tem `"type": "module"`
2. Está usando `tsx` ao invés de `ts-node`
3. O script dev está como: `"dev": "tsx watch src/server.ts"`

### Erro de conexão com PostgreSQL

Verifique:

1. PostgreSQL está rodando: `sudo service postgresql status`
2. DATABASE_URL está correta no `.env`
3. O banco de dados existe: `createdb hamburgeria`
4. As credenciais estão corretas

### Prisma Client não encontrado

Execute:

```bash
npm run prisma:generate
```

---

**Versão:** 1.0.0  
**Última atualização:** Dezembro 2024

/\*
1️⃣ Instalar dependências
npm install express dotenv @prisma/client pg
npm install -D typescript ts-node nodemon prisma @types/express @types/node

2️⃣ Criar arquivo .env na raiz do projeto
DATABASE_URL="postgresql://username:password@localhost:5432/mydb?schema=public"
PORT=3000
// Substitua:
// username: usuário do PostgreSQL
// password: senha do PostgreSQL
// localhost:5432: host e porta
// mydb: nome do banco

3️⃣ Configurar Prisma
npx prisma init
// Isso cria a pasta prisma/ e o arquivo schema.prisma

// prisma/schema.prisma:
generator client {
provider = "prisma-client-js"
}

datasource db {
provider = "postgresql"
url = env("DATABASE_URL")
}

4️⃣ Criar modelo no schema.prisma
model User {
id String @id @default(uuid())
email String @unique
name String?
}

5️⃣ Rodar a migration
npx prisma migrate dev
// Digite um nome para a migration, ex: "init"

6️⃣ Gerar o client do Prisma
npx prisma generate

7️⃣ Usar o Prisma no Node.js
import express from "express";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(express.json());

app.get("/users", async (req, res) => {
const users = await prisma.user.findMany();
res.json(users);
});

app.post("/users", async (req, res) => {
const { email, name } = req.body;
const user = await prisma.user.create({
data: { email, name }
});
res.json(user);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

8️⃣ Rodar o servidor
npm run dev
// GET /users → lista usuários
// POST /users → criar usuário

💡 Dicas extras:

- Para ver o banco visualmente: npx prisma studio
- Sempre que alterar schema.prisma:
  npx prisma migrate dev --name nome_da_migration
  npx prisma generate
  \*/

ORIENTAÇÃO DO PRISMA
SITE:https://www.prisma.io/docs/getting-started/prisma-orm/quickstart/prisma-postgres

# /\*

# 📘 ORIENTAÇÃO DO PRISMA

Site oficial:
https://www.prisma.io/docs/getting-started/prisma-orm/quickstart/prisma-postgres

# /\*

# 📘 ORIENTAÇÃO DO PRISMA

Site oficial:
https://www.prisma.io/docs/getting-started/prisma-orm/quickstart/prisma-postgres

===============================================
🗄️ ENVIAR AS INFORMAÇÕES PARA O POSTGRES ATRAVÉS DO SCHEMA
===============================================
O Prisma utiliza o arquivo schema.prisma para criar, atualizar
e sincronizar as tabelas no banco de dados.

===============================================
🎨 PRISMA STUDIO
===============================================
Comando:
npx prisma studio --config ./prisma.config.ts

Função:
✔ Abre a interface gráfica do Prisma
✔ Permite visualizar tabelas
✔ Editar, criar e excluir dados do banco
✔ Facilita o gerenciamento do banco

===============================================
🔧 COMANDOS DO PRISMA
===============================================

## 1️⃣ Importar estrutura do banco para o Prisma

---

Comando:
npx prisma db pull

Função:
✔ Traz tabelas já existentes do banco
✔ Atualiza o schema.prisma baseado no banco

## 2️⃣ Enviar informações ao banco via migração (RECOMENDADO)

---

Comandos:
npx prisma migrate dev --name init
npx prisma generate

Função:
✔ Cria migrações
✔ Atualiza o banco de dados
✔ Gera o Prisma Client atualizado

## 3️⃣ Segunda opção para enviar o schema ao banco (rápida)

---

Comando:
npx prisma db push

Função:
✔ Atualiza o banco sem criar migrações
✔ Melhor para testes e desenvolvimento rápido
✔ Não recomendado para produção

npx prisma generate

===============================================
⚠️ Quando usar o comando: npx prisma db push --force-reset
===============================================
Você deve usar este comando **somente quando aparecer erros como**:

"Added the required column `example` to the table without a default value.
There are rows in this table, it is not possible to execute this step."

Esses erros acontecem quando:
✔ Você adiciona um campo obrigatório no schema  
✔ A tabela já possui dados  
✔ O campo não tem valor padrão  
✔ O banco não sabe o que colocar nas linhas já existentes  
✔ Por isso o Prisma impede a atualização

O comando abaixo resolve:
npx prisma db push --force-reset

Função:
✔ Apaga completamente o banco de dados
✔ Recria todas as tabelas conforme o schema
❗ Todos os dados serão perdidos (use apenas em testes/desenvolvimento)

===============================================
💡 Alternativas seguras para NÃO precisar resetar o banco
===============================================

1. Tornar o campo OPCIONAL no schema:

---

cep String?
password String?

2. Adicionar um valor padrão:

---

cep String @default("00000-000")
password String @default("senha-temporaria")

Ambas as opções permitem rodar:
npx prisma db push
sem apagar dados.

===============================================
\*/

VINCULO DO BACKEND COM BANCO DE DADOS POSTGRESS UTILIZANDO PRIMA COMANDOS, PASSO A PASSO

/\*
══════════════════════════════════════════════════════════════════════
📌 VÍNCULO DO BACKEND COM BANCO DE DADOS POSTGRES UTILIZANDO PRISMA
══════════════════════════════════════════════════════════════════════

======================================================================
1️⃣ INSTALAÇÃO DO PRISMA

Instale o Prisma Client e Prisma CLI:
npm install prisma --save-dev
npm install @prisma/client

Inicialize o Prisma no projeto:
npx prisma init

Criado automaticamente:
✔ pasta prisma/
✔ arquivo schema.prisma
✔ arquivo .env

======================================================================
2️⃣ CONFIGURANDO A URL DO BANCO DE DADOS

No arquivo .env coloque sua URL de conexão:

DATABASE_URL="postgresql://USERNAME:PASSWORD@localhost:5432/NOME_DO_BANCO?schema=public"

Substitua:

USERNAME → seu usuário PostgreSQL

PASSWORD → sua senha

NOME_DO_BANCO → nome da database

Exemplo:
DATABASE_URL="postgresql://postgres:123456@localhost:5432/hamburgueria?schema=public"

======================================================================
3️⃣ DEFININDO AS TABELAS NO SCHEMA.PRISMA

No arquivo prisma/schema.prisma coloque seus modelos:

model User {
id Int @id @default(autoincrement())
name String
email String @unique
password String
cep String
created_at DateTime @default(now())
}

model Produto {
id Int @id @default(autoincrement())
nome String
preco Float
descricao String
imagem String
}

======================================================================
4️⃣ ENVIAR AS TABELAS PARA O BANCO

Criar/atualizar tabelas no PostgreSQL:

npx prisma db push

⚠ Se aparecer erro dizendo que colunas obrigatórias foram adicionadas e já existem dados:

👉 Use SOMENTE se quiser apagar TUDO e recriar:
npx prisma db push --force-reset

======================================================================
5️⃣ GERAR O CLIENT DO PRISMA

Gerar tipagens e cliente:

npx prisma generate

======================================================================
6️⃣ USAR O PRISMA NO BACKEND (NODE)

Crie o arquivo: src/lib/prisma.ts

import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();

Usar nos controllers:

import { prisma } from "../lib/prisma";

const users = await prisma.user.findMany();
const produto = await prisma.produto.create({...});

======================================================================
7️⃣ ABRIR O PRISMA STUDIO

Interface visual para ver tabelas e registros:

npx prisma studio

======================================================================
8️⃣ COMANDOS ÚTEIS

✔ Inicializar prisma → npx prisma init
✔ Enviar alterações → npx prisma db push
✔ Reset geral → npx prisma db push --force-reset
✔ Criar migrações → npx prisma migrate dev --name nome
✔ Abrir studio → npx prisma studio
✔ Regenerar client → npx prisma generate

======================================================================
🔥 Agora seu backend está oficialmente conectado ao PostgreSQL usando Prisma!

\*/

EXECUTANDO O TESTE DE CONEXÃO DO BANCO DE DADOS

CMD

D:\projeto_hamburger\back_end> (npx tsx ./src/lib/db.ts) CAMINHO DO BD
🔗 Conectado ao banco de dados com sucesso!

D:\projeto_hamburger\back_end>

"dev": "tsx watch --env-file=./.env src/server.ts", // Comando que inicia o servidor em modo de desenvolvimento, usando o tsx para rodar o TypeScript, monitorando mudanças e carregando variáveis do .env automaticamente

# 1. Gera o Prisma Client

npx prisma generate

# 2. Cria/atualiza as tabelas no banco

npx prisma db push

# 3. Inicia o servidor

npm run dev

🧪 Teste as rotas:
bash# Listar usuários
curl http://localhost:3000/users

# Fazer login (depois de criar um usuário)

curl -X POST http://localhost:3000/users \
 -H "Content-Type: application/json" \
 -d '{"email":"teste@exemplo.com","password":"senha123"}'
📝 Criar usuário de teste:
bash# Abrir Prisma Studio
npx prisma studio

# Ou via código TypeScript:

# const hash = await bcrypt.hash("senha123", 10);

# await prisma.User.create({

# data: {

# email: "teste@exemplo.com",

# password: hash,

# name: "Teste",

# cep: "70000-000"

# }

# });

# 1. Lista todos os usuários

curl http://localhost:3000/users

# 2. Testa o login (use um email que existe no banco)

curl -X POST http://localhost:3000/login \
 -H "Content-Type: application/json" \
 -d "{\"email\":\"teste@exemplo.com\",\"password\":\"senha123\"}"

-- Opção 1: Com aspas duplas e maiúscula
SELECT \* FROM "User" ORDER BY id ASC;

-- Opção 2: Sem aspas (minúscula)
SELECT \* FROM user ORDER BY id ASC;

-- Opção 3: Plural (caso tenha criado assim)
SELECT \* FROM users ORDER BY id ASC;

-- Opção 4: Schema completo
SELECT \* FROM public."User" ORDER BY id ASC;

📚 Por que usei PATCH?
PATCH é o método HTTP correto para atualizar parcialmente um recurso existente:

POST = Criar algo novo
PUT = Substituir completamente
PATCH = Atualizar parcialmente (só alguns campos)
GET = Ler dados
DELETE = Deletar

atualizar as senha para rashear
D:\projeto_hamburger\back_end> npx tsx update-all-passwords.ts
prisma:query SELECT "public"."User"."id", "public"."User"."email", "public"."User"."password" FROM "public"."User" WHERE 1=1 OFFSET $1
📊 Total de usuários: 3
🔄 Atualizando senha de: maria.santos@gmail.com
prisma:query UPDATE "public"."User" SET "password" = $1 WHERE ("public"."User"."email" = $2 AND 1=1) RETURNING "public"."User"."id", "public"."User"."email", "public"."User"."name", "public"."User"."password", "public"."User"."cep"
✅ Senha atualizada: maria.santos@gmail.com
🔄 Atualizando senha de: fiel@httt
prisma:query UPDATE "public"."User" SET "password" = $1 WHERE ("public"."User"."email" = $2 AND 1=1) RETURNING "public"."User"."id", "public"."User"."email", "public"."User"."name", "public"."User"."password", "public"."User"."cep"
✅ Senha atualizada: fiel@httt
⏭️ Já hasheada: beckymel27@gmail.com

🎉 Todas as senhas foram atualizadas!
