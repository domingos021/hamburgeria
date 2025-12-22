# 🧪 Guia de Teste JWT - Passo a Passo

## 📋 Pré-requisitos

1. ✅ Middleware `auth.middleware.ts` corrigido
2. ✅ Arquivo `test.routes.ts` criado
3. ✅ Variável `JWT_SECRET` no arquivo `.env`
4. ✅ Servidor rodando

---

## 🔧 Passo 1: Registrar as Rotas de Teste

No seu arquivo principal de rotas (ex: `src/server.ts` ou `src/app.ts`), adicione:

```typescript
import testRoutes from "./routes/test.routes.js";

// ... outras rotas ...

app.use("/api/test", testRoutes);
```

**Reinicie o servidor:**

```bash
npm run dev
```

---

## 🎯 Passo 2: Testar Rota Pública (SEM Token)

### Request:

```
GET http://localhost:3000/api/test/public
```

### Resposta Esperada (200 OK):

```json
{
  "success": true,
  "message": "Esta é uma rota pública - não precisa de autenticação",
  "timestamp": "2024-12-20T..."
}
```

✅ **Se funcionou:** A rota pública está OK!

---

## 🔐 Passo 3: Testar Rota Protegida SEM Token

### Request:

```
GET http://localhost:3000/api/test/protected
```

### Resposta Esperada (401 Unauthorized):

```json
{
  "error": "Token de autenticação não fornecido",
  "message": "É necessário estar autenticado para acessar este recurso"
}
```

✅ **Se funcionou:** O middleware está bloqueando acesso não autenticado!

---

## 🎫 Passo 4: Fazer Login e Obter o Token

### Request:

```
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "seu@email.com",
  "password": "suasenha"
}
```

### Resposta Esperada:

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

📋 **COPIE O TOKEN!** Você vai precisar dele nos próximos testes.

---

## ✅ Passo 5: Testar Rota Protegida COM Token

### Request:

```
GET http://localhost:3000/api/test/protected
Authorization: Bearer SEU_TOKEN_AQUI
```

⚠️ **IMPORTANTE:**

- O formato DEVE ser: `Bearer [espaço]TOKEN`
- Exemplo: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### Resposta Esperada (200 OK):

```json
{
  "success": true,
  "message": "Você está autenticado! 🎉",
  "user": {
    "userId": "123",
    "email": "seu@email.com"
  },
  "timestamp": "2024-12-20T..."
}
```

✅ **Se funcionou:** O JWT está funcionando perfeitamente!

---

## 🔍 Passo 6: Debug Detalhado do Token

### Request:

```
GET http://localhost:3000/api/test/debug
Authorization: Bearer SEU_TOKEN_AQUI
```

### Resposta Esperada:

```json
{
  "success": true,
  "message": "Informações detalhadas do token",
  "token_info": {
    "user": {
      "userId": "123",
      "email": "seu@email.com"
    },
    "issued_at": "2024-12-20T10:00:00.000Z",
    "expires_at": "2024-12-27T10:00:00.000Z",
    "expires_in": {
      "seconds": 604800,
      "minutes": 10080,
      "hours": 168
    },
    "is_valid": true
  }
}
```

---

## 🧪 Passo 7: Testar POST com Autenticação

### Request:

```
POST http://localhost:3000/api/test/user-action
Authorization: Bearer SEU_TOKEN_AQUI
Content-Type: application/json

{
  "action": "test",
  "data": "qualquer coisa"
}
```

### Resposta Esperada (200 OK):

```json
{
  "success": true,
  "message": "Ação executada com sucesso!",
  "executed_by": {
    "userId": "123",
    "email": "seu@email.com"
  },
  "action_data": {
    "action": "test",
    "data": "qualquer coisa"
  }
}
```

---

## ❌ Passo 8: Testar Cenários de Erro

### 8.1 Token Inválido

```
GET http://localhost:3000/api/test/protected
Authorization: Bearer token_invalido_123
```

**Esperado (401):**

```json
{
  "error": "Token inválido",
  "message": "O token fornecido é inválido ou foi adulterado."
}
```

### 8.2 Token sem "Bearer"

```
GET http://localhost:3000/api/test/protected
Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Esperado (401):**

```json
{
  "error": "Formato de token inválido",
  "message": "O token deve estar no formato: Bearer [token]"
}
```

### 8.3 Token Expirado

Use um token antigo ou espere ele expirar.

**Esperado (401):**

```json
{
  "error": "Token expirado",
  "message": "Seu token de autenticação expirou. Por favor, faça login novamente."
}
```

---

## 📊 Checklist Final

- [ ] Rota pública funciona SEM token
- [ ] Rota protegida bloqueia SEM token (401)
- [ ] Login retorna token válido
- [ ] Rota protegida permite acesso COM token válido
- [ ] Debug mostra informações corretas do token
- [ ] POST com autenticação funciona
- [ ] Token inválido retorna erro 401
- [ ] Token sem "Bearer" retorna erro 401
- [ ] Token expirado retorna erro apropriado

---

## 🐛 Logs no Console

Observe o console do servidor durante os testes. Você deve ver:

```
🔐 JWT_SECRET carregado: SIM
🔍 Header Authorization: Presente
🔑 Token extraído com sucesso
✅ Token válido para usuário: seu@email.com
✅ Rota protegida acessada por: seu@email.com
```

---

## 🛠️ Ferramentas Recomendadas

### Thunder Client (VS Code)

1. Instale a extensão "Thunder Client"
2. Crie uma nova Request
3. Configure o método e URL
4. Em "Auth" → "Bearer Token" → Cole seu token

### cURL (Terminal)

```bash
# Rota pública
curl http://localhost:3000/api/test/public

# Rota protegida
curl -H "Authorization: Bearer SEU_TOKEN" \
     http://localhost:3000/api/test/protected
```

---

## ✅ Próximos Passos

Depois que todos os testes passarem, você pode:

1. **Remover as rotas de teste** (ou mantê-las para debug futuro)
2. **Aplicar o middleware em rotas reais:**
   ```typescript
   router.get("/profile", authenticateToken, getProfile);
   router.post("/orders", authenticateToken, createOrder);
   ```
3. **Criar diferentes níveis de acesso** (admin, user, etc)

---

## 🆘 Problemas Comuns

### Erro: "JWT_SECRET não definido"

- Verifique se o `.env` existe e tem: `JWT_SECRET=sua_chave_secreta`
- Reinicie o servidor após criar/modificar o `.env`

### Erro: "Token inválido" (mas o token parece correto)

- Verifique se está usando a mesma `JWT_SECRET` para gerar e validar
- Certifique-se de não ter espaços extras no token

### Erro: "Cannot read properties of undefined"

- Verifique se importou corretamente: `import { authenticateToken } from ...`
- Verifique se o caminho do import está correto (com `.js` no final se usar ESM)

---

🎉 **Boa sorte com os testes!**

usuario teste

[
{
"name": "Domingos Jovete",
"email": "beckymel27@gmail.com",
"password": "Dinis123?",
"cep": "70658252",
"telefone": "(61) 98461-5325"
},
{
"name": "Aline Jovete",
"email": "alinejovete@gmail.com",
"password": "Mselissa123?",
"cep": "70658252",
"telefone": "(61) 98345-1122"
},
{
"name": "Bruna Silva",
"email": "brunasilva@gmail.com",
"password": "BrunaSilva123?",
"cep": "01310930",
"telefone": "(11) 98765-4321"
},
{
"name": "Mariana Costa",
"email": "marianacosta27@gmail.com",
"password": "MarianaCosta123?",
"cep": "70050020",
"telefone": "(61) 99788-2233"
}

{
"name": "Lucas Fernandes",
"email": "lucasfernandes99@gmail.com",
"password": "LucasFernandes123?",
"cep": "70070100",
"telefone": "(61) 99123-4567"
}

{
"name": "Carlos Mendes",
"email": "carlos.mendes@gmail.com",
"password": "CarlosMendes123?",
"cep": "30140071",
"telefone": "(31) 98888-2211"
},
{
"name": "Daniela Rocha",
"email": "daniela.rocha@gmail.com",
"password": "DanielaRocha123?",
"cep": "64000120",
"telefone": "(86) 99123-4455"
},
{
"name": "Felipe Almeida",
"email": "felipe.almeida@gmail.com",
"password": "FelipeAlmeida123?",
"cep": "88010001",
"telefone": "(48) 99222-7788"
}
]

]

# /\*

GUIA COMPLETO DE COMANDOS SQL — TABELA "User"
Compatível com: PostgreSQL e MySQL (modo ANSI)
======================================================

OBSERVAÇÃO IMPORTANTE:

- O nome da tabela é "User" (com U maiúsculo)
- Por ser uma palavra reservada, SEMPRE usar aspas duplas: "User"

1. LISTAR REGISTROS (SELECT)

---

1.1) Listar todos os usuários
SELECT \* FROM "User";

1.2) Listar apenas colunas específicas
SELECT id, name, email FROM "User";

1.3) Buscar usuário por email
SELECT \*
FROM "User"
WHERE email = 'alinejovete@gmail.com';

1.4) Buscar usuário por ID
SELECT \*
FROM "User"
WHERE id = 1;

2. CRIAR REGISTROS (INSERT)

---

2.1) Inserir um novo usuário
INSERT INTO "User" (email, password, name, cep)
VALUES (
'brunasilva@gmail.com',
'BrunaSilva123?',
'Bruna Silva',
'01310930'
);

OBS:

- Em aplicações reais, a senha deve ser salva HASHADA (bcrypt).
- Nunca salvar senha em texto puro em produção.

3. ATUALIZAR REGISTROS (UPDATE)

---

3.1) Atualizar o nome de um usuário
UPDATE "User"
SET name = 'Aline J. Jovete'
WHERE email = 'alinejovete@gmail.com';

3.2) Atualizar a senha de um usuário
UPDATE "User"
SET password = 'hashDaSenhaAqui'
WHERE id = 1;

3.3) Atualizar múltiplos campos
UPDATE "User"
SET
name = 'Carlos Mendes',
cep = '30140071'
WHERE email = 'carlos.mendes@gmail.com';

4. DELETAR REGISTROS (DELETE)

---

4.1) Deletar usuário por ID
DELETE FROM "User"
WHERE id = 1;

4.2) Deletar usuário por email
DELETE FROM "User"
WHERE email = 'felipealmeida@gmail.com';

4.3) Deletar TODOS os registros da tabela (CUIDADO)
DELETE FROM "User";

5. CONTAGEM DE REGISTROS

---

5.1) Contar quantos usuários existem
SELECT COUNT(\*) FROM "User";

6. ORDENAÇÃO (ORDER BY)

---

6.1) Ordenar por nome (A-Z)
SELECT \*
FROM "User"
ORDER BY name ASC;

6.2) Ordenar por ID (mais recente primeiro)
SELECT \*
FROM "User"
ORDER BY id DESC;

7. LIMITAÇÃO E PAGINAÇÃO

---

7.1) Limitar quantidade de resultados
SELECT \*
FROM "User"
LIMIT 5;

7.2) Paginação (exemplo: página 2)
SELECT \*
FROM "User"
LIMIT 5 OFFSET 5;

8. ESTRUTURA DA TABELA

---

8.1) Ver colunas da tabela
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'User';

8.2) Ver constraints da tabela
SELECT \*
FROM information_schema.table_constraints
WHERE table_name = 'User';

9. LIMPEZA E RESET DE DADOS

---

9.1) Limpar tabela e resetar IDs

(PostgreSQL)
TRUNCATE TABLE "User" RESTART IDENTITY CASCADE;

(MySQL)
TRUNCATE TABLE "User";

10. VERIFICAÇÕES ÚTEIS

---

10.1) Encontrar emails duplicados
SELECT email, COUNT(_)
FROM "User"
GROUP BY email
HAVING COUNT(_) > 1;

11. CONSTRAINTS IMPORTANTES (BOAS PRÁTICAS)

---

11.1) Garantir email único
ALTER TABLE "User"
ADD CONSTRAINT unique_email UNIQUE (email);

12. BOAS PRÁTICAS DE BACKEND

---

- Nunca inserir dados direto no banco em produção
- Sempre usar o backend (controllers / services)
- Validar dados (ex: Zod)
- Hash de senha (bcrypt)
- Autenticação com JWT
- Logs e tratamento de erros

======================================================
FIM DO GUIA
======================================================
\*/

/\*
Sempre que adicionar ou alterar algo no banco de dados
(ex: novo campo na tabela, constraint UNIQUE, ou regra):

OPÇÃO 1 — Usando migrations (RECOMENDADO)

1. Atualize o schema.prisma
2. Crie e aplique a migration
   npx prisma migrate dev --name make_telefone_unique
3. Gere o Prisma Client
   npx prisma generate

OPÇÃO 2 — Usando push (SEM migration)
Usar apenas em desenvolvimento rápido ou testes

1. Atualize o schema.prisma
2. Sincronize o banco diretamente
   npx prisma db push
3. Gere o Prisma Client
   npx prisma generate
   \*/

// verificar erros de typescript:npm run type-check

{
"cep": "70648015",
"confirmarSenha": "melissa7?",
"email": "melissacarvalho@gmailcom",
"name": "Melissa carvalho Jovete",
"senha": "Melissa7?",
"telefone": "61984615326"
}
