# 🍔 Backend – Projeto Hamburgeria

Este é o backend da aplicação **Hamburgeria**, responsável pela API REST, regras de negócio e conexão com banco de dados PostgreSQL.

---

## 📌 Tecnologias Utilizadas

- **Node.js** v20+
- **Express.js** - Framework web minimalista e flexível
- **TypeScript** - Superset JavaScript com tipagem estática
- **tsx** - Executor TypeScript moderno e rápido
- **Prisma ORM** - ORM type-safe para PostgreSQL
- **PostgreSQL** - Banco de dados relacional
- **Dotenv** - Gerenciamento de variáveis de ambiente
- **bcrypt** - Hash de senhas para autenticação

---

## 📁 Estrutura do Projeto

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
│   ├── lib/                # Bibliotecas e conexões (Prisma, DB)
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
├── update-all-passwords.ts # Script para atualizar senhas
└── README.md               # Este arquivo
```

---

## 🚀 Como Executar o Projeto

### Pré-requisitos

- **Node.js** v20 ou superior
- **npm** v10 ou superior
- **PostgreSQL** instalado e rodando

### Instalação

**1. Clone o repositório:**

```bash
git clone https://github.com/domingos021/hamburgeria.git
cd hamburgeria/back_end
```

**2. Instale as dependências:**

**Dependências de produção:**

```bash
npm install express dotenv @prisma/client pg bcrypt
```

**Dependências de desenvolvimento:**

```bash
npm install -D typescript tsx ts-node nodemon prisma @types/express @types/node @types/bcrypt
```

**Ou instalar tudo de uma vez:**

```bash
npm install express dotenv @prisma/client pg bcrypt
npm install -D typescript tsx ts-node nodemon prisma @types/express @types/node @types/bcrypt
```

**3. Configure as variáveis de ambiente:**

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/hamburgueria?schema=public"
PORT=3000
NODE_ENV=development
```

**Substitua:**

- `username` → seu usuário do PostgreSQL
- `password` → sua senha do PostgreSQL
- `localhost:5432` → host e porta do banco
- `hamburgueria` → nome do banco de dados

**4. Inicialize o Prisma:**

```bash
npx prisma init
```

Isso cria:

- Pasta `prisma/`
- Arquivo `schema.prisma`
- Arquivo `.env`

**5. Configure o schema do Prisma:**

No arquivo `prisma/schema.prisma`, defina seus modelos:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id         Int      @id @default(autoincrement())
  name       String?
  email      String   @unique
  password   String
  cep        String
  created_at DateTime @default(now())
}

model Produto {
  id        Int    @id @default(autoincrement())
  nome      String
  preco     Float
  descricao String
  imagem    String
}
```

**6. Gere o Prisma Client:**

```bash
npx prisma generate
```

**7. Envie as tabelas para o banco:**

```bash
npx prisma db push
```

**8. (Opcional) Popule o banco com dados iniciais:**

```bash
npm run prisma:seed
```

### Executar em Desenvolvimento

```bash
npm run dev
```

O servidor estará rodando em: `http://localhost:3000`

O **tsx watch** irá monitorar automaticamente mudanças nos arquivos `.ts` e reiniciar o servidor instantaneamente com suporte às variáveis de ambiente do `.env`.

### Build para Produção

```bash
npm run build
npm start
```

---

## 📜 Scripts Disponíveis

### Desenvolvimento

```bash
npm run dev
```

Inicia servidor em modo desenvolvimento com hot-reload (tsx watch), carregando automaticamente as variáveis do `.env`.

### Build e Produção

```bash
npm run build    # Compila TypeScript para JavaScript na pasta dist/
npm start        # Executa a versão compilada em produção (node dist/server.js)
```

### Prisma

```bash
npm run prisma:generate    # Gera o Prisma Client
npm run prisma:migrate     # Executa migrações do banco de dados
npm run prisma:studio      # Abre o Prisma Studio (interface visual do banco)
npm run prisma:seed        # Popula o banco com dados iniciais
```

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

## 🔑 Variáveis de Ambiente

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

```http
POST /api/auth/register    # Cadastro de usuário
POST /api/auth/login       # Login
POST /login                # Login alternativo
```

### Usuários

```http
GET  /users                # Lista todos os usuários
POST /users                # Criar novo usuário
PATCH /users/:id           # Atualizar parcialmente um usuário
```

### Hambúrgueres

```http
GET    /api/hamburgueres        # Lista todos
GET    /api/hamburgueres/:id    # Busca por ID
POST   /api/hamburgueres        # Criar novo
PUT    /api/hamburgueres/:id    # Atualizar
DELETE /api/hamburgueres/:id    # Deletar
```

### Pedidos

```http
GET  /api/pedidos        # Lista pedidos
POST /api/pedidos        # Criar pedido
GET  /api/pedidos/:id    # Detalhes do pedido
```

---

## 🗄️ Schema do Banco de Dados

### Modelos Principais

O Prisma gerencia o schema do banco. Exemplo básico:

```prisma
model User {
  id         Int      @id @default(autoincrement())
  name       String?
  email      String   @unique
  password   String
  cep        String
  created_at DateTime @default(now())
}

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

model Produto {
  id        Int    @id @default(autoincrement())
  nome      String
  preco     Float
  descricao String
  imagem    String
}
```

---

## 🔧 Comandos do Prisma

### Inicialização

```bash
npx prisma init
```

Cria a estrutura inicial do Prisma (pasta `prisma/`, arquivo `schema.prisma` e `.env`).

### Sincronização com Banco de Dados

#### **Opção 1: Importar estrutura existente do banco**

```bash
npx prisma db pull
```

- Traz tabelas já existentes do banco
- Atualiza o `schema.prisma` baseado no banco

#### **Opção 2: Enviar schema para o banco (RECOMENDADO para produção)**

```bash
npx prisma migrate dev --name init
npx prisma generate
```

- Cria migrações
- Atualiza o banco de dados
- Gera o Prisma Client atualizado

#### **Opção 3: Push rápido (desenvolvimento/testes)**

```bash
npx prisma db push
```

- Atualiza o banco sem criar migrações
- Melhor para testes e desenvolvimento rápido
- Não recomendado para produção

### Gerando o Client

```bash
npx prisma generate
```

Gera tipagens TypeScript e o cliente Prisma.

### Prisma Studio

```bash
npx prisma studio
```

Abre a interface gráfica do Prisma para visualizar, editar, criar e excluir dados do banco.

Com configuração customizada:

```bash
npx prisma studio --config ./prisma.config.ts
```

### Outras Operações

```bash
# Criar uma nova migration
npx prisma migrate dev --name nome_da_migration

# Reset do banco (CUIDADO em produção!)
npx prisma migrate reset

# Push com reset forçado (apaga todos os dados)
npx prisma db push --force-reset
```

---

## ⚠️ Quando Usar `--force-reset`

Use o comando `npx prisma db push --force-reset` **SOMENTE** quando aparecer erros como:

```
"Added the required column `example` to the table without a default value.
There are rows in this table, it is not possible to execute this step."
```

**Esses erros acontecem quando:**

- Você adiciona um campo obrigatório no schema
- A tabela já possui dados
- O campo não tem valor padrão
- O banco não sabe o que colocar nas linhas já existentes

**O que o comando faz:**

- ✔️ Apaga completamente o banco de dados
- ✔️ Recria todas as tabelas conforme o schema
- ❗ **Todos os dados serão perdidos** (use apenas em testes/desenvolvimento)

### Alternativas Seguras

**1. Tornar o campo OPCIONAL:**

```prisma
cep      String?
password String?
```

**2. Adicionar um valor padrão:**

```prisma
cep      String @default("00000-000")
password String @default("senha-temporaria")
```

Ambas as opções permitem rodar `npx prisma db push` sem apagar dados.

---

## 🔌 Testando Conexão com Banco de Dados

### Teste de Conexão

Execute o script de teste:

```bash
npx tsx ./src/lib/db.ts
```

**Saída esperada:**

```
🔗 Conectado ao banco de dados com sucesso!
```

### Consultas SQL Diretas

Consulte dados diretamente no PostgreSQL:

```sql
-- Opção 1: Com aspas duplas e maiúscula
SELECT * FROM "User" ORDER BY id ASC;

-- Opção 2: Sem aspas (minúscula)
SELECT * FROM user ORDER BY id ASC;

-- Opção 3: Plural (caso tenha criado assim)
SELECT * FROM users ORDER BY id ASC;

-- Opção 4: Schema completo
SELECT * FROM public."User" ORDER BY id ASC;
```

---

## 🔐 Gerenciamento de Senhas

### Script de Atualização de Senhas

O projeto inclui um script para atualizar senhas existentes com hash bcrypt:

```bash
npx tsx update-all-passwords.ts
```

**Exemplo de saída:**

```
📊 Total de usuários: 3
🔄 Atualizando senha de: maria.santos@gmail.com
✅ Senha atualizada: maria.santos@gmail.com
🔄 Atualizando senha de: fiel@httt
✅ Senha atualizada: fiel@httt
⏭️ Já hasheada: beckymel27@gmail.com

🎉 Todas as senhas foram atualizadas!
```

### Criar Usuário com Senha Hasheada

```typescript
const hash = await bcrypt.hash("senha123", 10);
await prisma.User.create({
  data: {
    email: "teste@exemplo.com",
    password: hash,
    name: "Teste",
    cep: "70000-000",
  },
});
```

---

## 🧪 Testando a API

### Teste com cURL

**1. Listar todos os usuários:**

```bash
curl http://localhost:3000/users
```

**2. Criar novo usuário:**

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@exemplo.com","password":"senha123","name":"Teste","cep":"70000-000"}'
```

**3. Fazer login:**

```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"teste@exemplo.com\",\"password\":\"senha123\"}"
```

### Criar Usuário de Teste

**Via Prisma Studio:**

```bash
npx prisma studio
```

**Via código TypeScript:**

```typescript
const hash = await bcrypt.hash("senha123", 10);
await prisma.User.create({
  data: {
    email: "teste@exemplo.com",
    password: hash,
    name: "Teste",
    cep: "70000-000",
  },
});
```

---

## 📚 Métodos HTTP Utilizados

### Por que cada método?

```
POST   = Criar algo novo
GET    = Ler dados
PUT    = Substituir completamente um recurso
PATCH  = Atualizar parcialmente um recurso (só alguns campos)
DELETE = Deletar um recurso
```

**Exemplo de uso do PATCH:**

```http
PATCH /users/:id
```

Permite atualizar apenas campos específicos de um usuário sem precisar enviar todos os dados.

---

## 📝 Notas de Desenvolvimento

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
//   ↑      ↑        ↑
//   |      |        |
// Método Caminho  Função que
//  HTTP  da rota  responde
```

### Hot Reload com tsx

O ambiente de desenvolvimento usa **tsx watch** que:

- ⚡ Recarrega instantaneamente ao detectar mudanças
- 🔍 Monitora automaticamente todos os arquivos `.ts` em `src/`
- 🚀 Muito mais rápido que ts-node tradicional
- 💪 Suporte nativo a ES Modules
- 🔧 Carrega automaticamente variáveis do `.env`

**Comando configurado:**

```json
"dev": "tsx watch --env-file=./.env src/server.ts"
```

### Type Safety com Prisma

O Prisma gera automaticamente tipos TypeScript para:

- Modelos do banco de dados
- Queries e mutations
- Relações entre tabelas

Isso garante **100% de type-safety** nas operações de banco de dados.

### Uso do Prisma no Backend

**Crie o arquivo:** `src/lib/prisma.ts`

```typescript
import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();
```

**Use nos controllers:**

```typescript
import { prisma } from "../lib/prisma";

const users = await prisma.user.findMany();
const produto = await prisma.produto.create({
  data: { nome, preco, descricao, imagem },
});
```

---

## 🔧 Troubleshooting

### Erro: "Unknown file extension .ts"

Se aparecer esse erro, certifique-se que:

1. O `package.json` tem `"type": "module"`
2. Está usando `tsx` ao invés de `ts-node`
3. O script dev está como: `"dev": "tsx watch src/server.ts"`

### Erro de Conexão com PostgreSQL

Verifique:

1. PostgreSQL está rodando:

   ```bash
   sudo service postgresql status
   ```

2. DATABASE_URL está correta no `.env`

3. O banco de dados existe:

   ```bash
   createdb hamburgeria
   ```

4. As credenciais estão corretas

### Prisma Client Não Encontrado

Execute:

```bash
npx prisma generate
```

### Erro ao Adicionar Campo Obrigatório

Se receber erro ao adicionar campo obrigatório em tabela com dados:

**Solução 1 (recomendada):** Tornar campo opcional ou adicionar valor padrão

**Solução 2 (apenas dev):** Reset completo do banco

```bash
npx prisma db push --force-reset
```

---

## 🤝 Como Contribuir

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

---

## 🐛 Problemas Conhecidos / Roadmap

- [ ] Adicionar testes unitários e de integração
- [ ] Implementar rate limiting
- [ ] Documentação automática com Swagger/OpenAPI
- [ ] Implementar cache com Redis
- [ ] Adicionar logs estruturados (Winston/Pino)
- [ ] Sistema de autenticação JWT completo
- [ ] Upload de imagens (multer + cloud storage)
- [ ] Validação de dados (Zod)

---

## 📚 Recursos Úteis

### Documentação Oficial

- [Express.js Documentation](https://expressjs.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma PostgreSQL Quickstart](https://www.prisma.io/docs/getting-started/prisma-orm/quickstart/prisma-postgres)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [tsx Documentation](https://tsx.is/)

---

## 📄 Licença

Este projeto está sob a licença ISC. Veja o arquivo LICENSE para mais detalhes.

---

## 👨‍💻 Autor

Desenvolvido por **Domingos Dinis Jose Jovete**

- GitHub: [@domingos021](https://github.com/domingos021)
- Repositório: [hamburgeria](https://github.com/domingos021/hamburgeria)

---

## 📌 Versão

**Versão:** 1.0.0  
**Última atualização:** Dezembro 2024

---

## 🎯 Resumo dos Comandos Principais

### Configuração Inicial

```bash
# 1. Instalar dependências de produção
npm install express dotenv @prisma/client pg bcrypt

# 2. Instalar dependências de desenvolvimento
npm install -D typescript tsx ts-node nodemon prisma @types/express @types/node @types/bcrypt

# 3. Inicializar Prisma
npx prisma init

# 4. Gerar Prisma Client
npx prisma generate

# 5. Criar/atualizar tabelas no banco
npx prisma db push

# 6. Iniciar servidor em desenvolvimento
npm run dev
```

### Comandos Úteis do Dia a Dia

```bash
# Abrir Prisma Studio
npx prisma studio

# Atualizar banco após mudanças no schema
npx prisma db push
npx prisma generate

# Criar migration
npx prisma migrate dev --name nome_da_migration

# Testar conexão do banco
npx tsx ./src/lib/db.ts

# Atualizar senhas hasheadas
npx tsx update-all-passwords.ts
```

# /\*

# FLUXO GERAL DE EXECUÇÃO DO BACKEND

Este backend segue um fluxo lógico padrão utilizado
em APIs REST profissionais, garantindo organização,
segurança e previsibilidade no processamento
das requisições.

Fluxo de execução:

1. Inicializa o servidor Express

   - Cria a instância principal da aplicação.

2. Aplica middlewares globais

   - Configura o parser de JSON.
   - Aplica middlewares de log e debug.
   - Prepara o ambiente antes das rotas.

3. Testa a conexão com o banco de dados

   - Verifica se o PostgreSQL está acessível.
   - Evita subir a aplicação com erro de conexão.

4. Define as rotas da aplicação

   - Cadastro de usuários.
   - Login de usuários.
   - Listagem e manutenção de dados.

5. Valida os dados recebidos

   - Garante campos obrigatórios.
   - Evita dados inconsistentes ou inválidos.

6. Interage com o banco de dados

   - Realiza consultas e persistência via Prisma.
   - Aplica regras de negócio antes das operações.

7. Trata erros e exceções

   - Captura falhas internas com try/catch.
   - Retorna códigos HTTP apropriados.

8. Responde ao cliente
   - Retorna respostas padronizadas em JSON.
   - Nunca expõe dados sensíveis (ex: senhas).

======================================================
\*/

SELECT \*
FROM "User"
WHERE email = 'beckymel27@gmail.com';
