/**
 * ============================================================================
 * ARQUIVO DE ENTRADA PRINCIPAL DA APLICAÇÃO
 * ============================================================================
 *
 * Este arquivo é responsável pela inicialização da aplicação React no DOM.
 * As rotas são importadas de um arquivo separado para melhor organização.
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Importação dos estilos globais com Tailwind CSS
import "./index_tailwind.css";

// Importação da configuração de rotas (centralizada em arquivo separado)
import { router } from "./components/router/router";

// Importação do Provider de autenticação (ajuste correto)
import { UserProvider } from "./contexts/user/UserProvider";

// ============================================================================
// CONFIGURAÇÃO DO TANSTACK QUERY
// ============================================================================
/**
 * Cria uma instância do QueryClient para gerenciar o cache e estado
 * das requisições assíncronas em toda a aplicação
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // Número de tentativas em caso de falha
      refetchOnWindowFocus: false, // Não refaz requisições ao focar na janela
    },
  },
});

// ============================================================================
// RENDERIZAÇÃO DA APLICAÇÃO
// ============================================================================
/**
 * Inicializa a aplicação React no elemento DOM com id "root".
 *
 * - StrictMode: Ativa verificações adicionais e avisos durante o desenvolvimento
 * - QueryClientProvider: Fornece o contexto do TanStack Query para toda a aplicação
 * - UserProvider: Fornece o contexto de autenticação do usuário para toda a aplicação
 * - RouterProvider: Fornece o contexto de roteamento para toda a aplicação,
 *   permitindo a navegação entre as páginas definidas em ./components/router/router
 */
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* 
    StrictMode (React):
    - Atua apenas em ambiente de desenvolvimento
    - Ajuda a identificar efeitos colaterais, práticas inseguras e usos incorretos de hooks
    - Pode executar alguns ciclos de vida duas vezes (DEV ONLY)
    - NÃO afeta o build de produção
   */}

    <QueryClientProvider client={queryClient}>
      {/*
      QueryClientProvider (TanStack React Query):
      - Fornece o cliente de queries para TODA a aplicação
      - Gerencia cache, estado de loading, erros e revalidações
      - Permite o uso de hooks como useQuery e useMutation em qualquer componente filho
     */}

      <UserProvider>
        {/*
        UserProvider (Context API - Autenticação):
        - Fornece o estado global do usuário autenticado
        - Centraliza dados como:
          • user
          • setUser
          • isAuthenticated
          • logout
        - Permite acesso ao usuário em qualquer componente via hook useUser
       */}

        <RouterProvider router={router} />
        {/*
        RouterProvider (React Router):
        - Controla o sistema de rotas da aplicação
        - Interpreta a URL atual e renderiza o componente correspondente
        - Permite navegação com useNavigate, Link, Outlet, etc.
        - Usa a configuração de rotas definida em ./router
       */}
      </UserProvider>
    </QueryClientProvider>
  </StrictMode>,
);
