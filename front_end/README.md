# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

src
├── main.tsx
├── index_tailwind.css
│
├── components
│ ├── Header.tsx
│ │
│ ├── inputs
│ │ └── input.tsx
│ │
│ ├── button_dinamic
│ │ └── button.tsx
│ │
│ ├── router
│ │ └── router.tsx
│ │
│ └── pages
│ ├── home.tsx
│ ├── pedidos.tsx
│ ├── login.tsx
│ ├── cadastro.tsx
│ ├── ForgotPassword.tsx
│ └── ResetPassword.tsx
│
├── contexts
│ └── user
│ ├── UserContext.tsx
│ ├── UserProvider.tsx
│ └── useUser.ts
│
├── layout
│ └── Layout.tsx
│
└── types
├── zod_types.ts
│
├── zod_interfaces
│ └── interfaces.ts
│
└── userTypes
└── userTypes.ts

tree /F

# /\*

# 📚 EXPLICAÇÃO COMPLETA: FLUXO DE AUTENTICAÇÃO E ARMAZENAMENTO

🎯 OBJETIVO DESTE PROVIDER:
Gerenciar o estado global do usuário na aplicação, incluindo login, logout,
persistência de dados e sincronização entre localStorage e estado React.

================================================================================
💾 FLUXO COMPLETO: LOGIN → ARMAZENAMENTO → LOGOUT
================================================================================

┌─────────────────────────────────────────────────────────────────────────────┐
│ 1️⃣ ANTES DO LOGIN (Estado Inicial) │
└─────────────────────────────────────────────────────────────────────────────┘

📍 Estado React:
user = null

📍 localStorage:
(vazio - sem chave "app_user_data")

📍 Cookies do navegador:
(vazio - sem cookie "token")

📍 Usuário:
❌ NÃO autenticado
❌ NÃO pode acessar rotas protegidas

┌─────────────────────────────────────────────────────────────────────────────┐
│ 2️⃣ DURANTE O LOGIN (Processo de Autenticação) │
└─────────────────────────────────────────────────────────────────────────────┘

PASSO 1: Usuário preenche email e senha no formulário (login.tsx)

PASSO 2: Componente de login envia credenciais para o backend:

POST http://localhost:3000/auth/login
Body: { email: "user@email.com", password: "senha123" }
Headers: { "Content-Type": "application/json" }
credentials: "include" // 🚨 CRUCIAL para receber cookies

PASSO 3: Backend valida as credenciais:

✅ SE VÁLIDO: - Cria um token JWT - Define um cookie httpOnly com o token - Retorna dados do usuário (sem a senha!)

❌ SE INVÁLIDO: - Retorna erro 401 - Não cria cookie - Usuário vê mensagem de erro

PASSO 4: Frontend recebe resposta bem-sucedida (onSuccess no login.tsx):

const data = {
user: {
id: "123",
email: "user@email.com",
name: "João Silva",
cep: "12345-678",
telefone: "(11) 98765-4321"
}
}

PASSO 5: Login chama setUser() do contexto:

userContext?.setUser({
id: data.user.id,
email: data.user.email,
name: data.user.name,
cep: data.user.cep,
telefone: data.user.telefone,
});

PASSO 6: setUser() internamente chama updateUser():

const updateUser = (newUser: UserInterface | null) => {
// A) Atualiza o estado React
setUser(newUser);

     // B) Salva no localStorage
     if (newUser) {
       localStorage.setItem("app_user_data", JSON.stringify(newUser));
     }

     // C) Limpa erros anteriores
     setError(null);

};

┌─────────────────────────────────────────────────────────────────────────────┐
│ 3️⃣ APÓS O LOGIN (Estado Autenticado) │
└─────────────────────────────────────────────────────────────────────────────┘

📍 Estado React:
user = {
id: "123",
email: "user@email.com",
name: "João Silva",
cep: "12345-678",
telefone: "(11) 98765-4321"
}

📍 localStorage:
Key: "app_user_data"
Value: '{"id":"123","email":"user@email.com","name":"João Silva",...}'

📍 Cookies do navegador:
Name: "token"
Value: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
HttpOnly: true (JavaScript não pode acessar)
Secure: true (apenas HTTPS em produção)

📍 Usuário:
✅ AUTENTICADO
✅ Pode acessar rotas protegidas
✅ Dados aparecem na interface (ex: "Olá, João Silva")

┌─────────────────────────────────────────────────────────────────────────────┐
│ 4️⃣ PERSISTÊNCIA: RECARREGAR A PÁGINA (F5) │
└─────────────────────────────────────────────────────────────────────────────┘

PROBLEMA SEM LOCALSTORAGE:
Ao recarregar a página, o estado React é perdido.
Resultado: usuário seria deslogado a cada refresh ❌

SOLUÇÃO COM LOCALSTORAGE:
useEffect(() => {
// Executa UMA VEZ ao montar o componente
try {
// Tenta recuperar dados salvos
const storedUser = localStorage.getItem("app_user_data");

       if (storedUser) {
         // Converte de JSON string para objeto
         const parsedUser = JSON.parse(storedUser);

         // Restaura o usuário no estado React
         setUser(parsedUser);

         // ✅ USUÁRIO CONTINUA LOGADO!
       }
     } catch (err) {
       // Se o JSON estiver corrompido, remove
       localStorage.removeItem("app_user_data");
     } finally {
       // Finaliza carregamento inicial
       setIsLoading(false);
     }

}, []); // Array vazio = executa apenas 1 vez

┌─────────────────────────────────────────────────────────────────────────────┐
│ 5️⃣ DURANTE O LOGOUT (Processo de Encerramento da Sessão) │
└─────────────────────────────────────────────────────────────────────────────┘

PASSO 1: Usuário clica no botão "Sair" ou "Logout"

PASSO 2: Componente chama logout() do contexto:

const handleLogout = async () => {
await logout(); // Função assíncrona
navigate('/login'); // Redireciona após logout
};

PASSO 3: logout() faz requisição para o backend:

POST http://localhost:3000/auth/logout
credentials: "include" // 🚨 Envia o cookie automaticamente

O backend:

- Valida o token JWT do cookie
- Remove o cookie (Set-Cookie com data expirada)
- Retorna { message: "Logout realizado com sucesso" }

PASSO 4: Frontend limpa TODOS os dados locais:

const logout = async () => {
try {
// A) Chama API de logout
const response = await fetch(`${API_BASE_URL}/auth/logout`, {
method: "POST",
credentials: "include",
});

       // B) Remove usuário do estado React
       setUser(null);

       // C) Remove dados do localStorage
       localStorage.removeItem("app_user_data");

       // D) Limpa mensagens de erro
       setError(null);

     } catch (err) {
       // ⚠️ IMPORTANTE: Mesmo com erro na API, limpa dados locais!
       // Isso garante que o usuário não fique "preso" no sistema
       // mesmo se o servidor estiver offline
       setUser(null);
       localStorage.removeItem("app_user_data");
     }

};

┌─────────────────────────────────────────────────────────────────────────────┐
│ 6️⃣ APÓS O LOGOUT (Estado Desautenticado) │
└─────────────────────────────────────────────────────────────────────────────┘

📍 Estado React:
user = null

📍 localStorage:
(vazio - chave "app_user_data" foi removida)

📍 Cookies do navegador:
(vazio - cookie "token" foi removido pelo backend)

📍 Usuário:
❌ NÃO autenticado
❌ NÃO pode acessar rotas protegidas
➡️ Redirecionado para /login

================================================================================
🔐 SEGURANÇA: O QUE ARMAZENAR ONDE?
================================================================================

✅ COOKIE (httpOnly, Secure):

- Token JWT de autenticação
- Não acessível via JavaScript (proteção contra XSS)
- Enviado automaticamente em cada requisição
- Gerenciado pelo BACKEND

✅ LOCALSTORAGE:

- Dados NÃO sensíveis do usuário (nome, email, id)
- Informações de perfil e preferências
- Usado para persistir sessão entre reloads
- Gerenciado pelo FRONTEND

❌ NUNCA ARMAZENAR:

- Senhas (nem hash!)
- Tokens JWT no localStorage (usar cookies httpOnly)
- Dados sensíveis (CPF, cartão de crédito, etc.)
- Chaves de API

================================================================================
🧪 COMO TESTAR NO NAVEGADOR (DevTools)
================================================================================

1️⃣ TESTAR LOGIN:

a) Abra DevTools (F12)
b) Vá em: Application → Local Storage → http://localhost:5173
c) Faça login
d) Verifique:
✅ Aparece chave "app_user_data" com dados do usuário

e) Vá em: Application → Cookies → http://localhost:3000
f) Verifique:
✅ Aparece cookie "token" com valor JWT

2️⃣ TESTAR PERSISTÊNCIA:

a) Com login feito, recarregue a página (F5)
b) Verifique:
✅ Usuário continua logado
✅ Dados do localStorage ainda estão lá
✅ Nome do usuário aparece na interface

3️⃣ TESTAR LOGOUT:

a) Com DevTools aberto (Local Storage e Cookies visíveis)
b) Clique no botão "Sair" ou "Logout"
c) Verifique no Console:
✅ "🚀 Iniciando logout..."
✅ "✅ Logout realizado com sucesso no servidor"
✅ "✅ Dados locais limpos com sucesso"

d) Verifique no Local Storage:
✅ Chave "app_user_data" foi REMOVIDA

e) Verifique nos Cookies:
✅ Cookie "token" foi REMOVIDO

f) Verifique na aplicação:
✅ Foi redirecionado para /login
✅ Não aparece mais nome do usuário

4️⃣ TESTAR LOGOUT COM SERVIDOR OFFLINE:

a) Pare o backend (Ctrl+C no terminal do servidor)
b) Tente fazer logout no frontend
c) Verifique:
✅ Aparece erro no console
⚠️ "Dados locais limpos apesar do erro no servidor"
✅ localStorage foi limpo mesmo assim
✅ Usuário foi deslogado localmente
✅ Segurança: usuário não fica "preso" no sistema

================================================================================
🔄 DIAGRAMA DE FLUXO VISUAL
================================================================================

LOGIN:
┌──────────┐ credenciais ┌──────────┐ valida ┌──────────┐
│ Frontend │ ───────────────> │ Backend │ ──────────> │ Database │
│ (React) │ │ (API) │ │ │
└──────────┘ └──────────┘ └──────────┘
│ │
│ ✅ sucesso │
│ <───────────────────────── │
│ + dados do usuário │
│ + cookie "token" │
│ │
▼ │
┌──────────┐ │
│ Salva em │ │
│ • React │ │
│ • Local │ │
│ Storage│ │
└──────────┘ │

LOGOUT:
┌──────────┐ POST /logout ┌──────────┐
│ Frontend │ ───────────────> │ Backend │
│ (React) │ + cookie token │ (API) │
└──────────┘ └──────────┘
│ │
│ ✅ remove cookie │
│ <───────────────────────── │
│ │
▼ │
┌──────────┐ │
│ Limpa │ │
│ • React │ │
│ • Local │ │
│ Storage│ │
└──────────┘ │

================================================================================
💡 PERGUNTAS FREQUENTES (FAQ)
================================================================================

❓ Por que usar localStorage SE já temos cookies?

RESPOSTA:

- Cookie: armazena o TOKEN (autenticação)
- localStorage: armazena DADOS DO USUÁRIO (perfil)

O cookie é enviado automaticamente em TODAS as requisições.
O localStorage permite restaurar o estado do React após reload,
sem precisar fazer outra requisição ao servidor.

❓ Por que limpar localStorage no logout mesmo se a API falhar?

RESPOSTA:
Segurança! Se o servidor estiver offline e não limparmos
os dados locais, o usuário ficaria "preso" no sistema,
pensando que está logado quando na verdade não está.

É melhor deslogar localmente e deixar o usuário fazer
login novamente quando o servidor voltar.

❓ E se alguém editar o localStorage manualmente?

RESPOSTA:
Não há problema! O que importa é o TOKEN no cookie httpOnly.
Mesmo que alguém coloque dados falsos no localStorage,
não conseguirá acessar rotas protegidas sem um token válido.

localStorage é apenas para UX (mostrar nome, etc).
A segurança real está no token JWT do cookie.

❓ Por que não salvar o token JWT no localStorage?

RESPOSTA:
⚠️ VULNERABILIDADE: JavaScript pode acessar localStorage!
Se houver um ataque XSS (script malicioso), o atacante
consegue roubar o token e se passar pelo usuário.

Cookie httpOnly NÃO pode ser acessado por JavaScript,
apenas pelo navegador automaticamente. Muito mais seguro!

❓ O que acontece se o token expirar?

RESPOSTA:

1.  Backend detecta token expirado
2.  Retorna erro 401 Unauthorized
3.  Frontend deve capturar esse erro
4.  Limpar localStorage e redirecionar para /login

(Você pode implementar um interceptor para isso)

================================================================================
📝 RESUMO EXECUTIVO
================================================================================

┌─────────────────────┬──────────────────┬──────────────────┬────────────────┐
│ Momento │ Estado React │ localStorage │ Cookie │
├─────────────────────┼──────────────────┼──────────────────┼────────────────┤
│ Antes do Login │ user = null │ vazio │ sem token │
│ Após Login │ user = {...} │ dados salvos │ token presente │
│ Após Reload (F5) │ user = {...} │ dados mantidos │ token mantido │
│ Após Logout │ user = null │ dados removidos │ token removido │
└─────────────────────┴──────────────────┴──────────────────┴────────────────┘

🎯 CONCLUSÃO:

- LOGIN: Salva dados em React + localStorage + cookie
- LOGOUT: Remove dados de React + localStorage + cookie
- RELOAD: Restaura dados do localStorage para React
- SEGURANÇA: Token no cookie httpOnly, dados básicos no localStorage

================================================================================
\*/
