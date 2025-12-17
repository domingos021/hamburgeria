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
 * - RouterProvider: Fornece o contexto de roteamento para toda a aplicação,
 *   permitindo a navegação entre as páginas definidas em ./components/router/router
 */
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
);
