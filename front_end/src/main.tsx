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

// Importação dos estilos globais com Tailwind CSS
import "./index_tailwind.css";

// Importação da configuração de rotas (centralizada em arquivo separado)
import { router } from "./components/router/router";

// ============================================================================
// RENDERIZAÇÃO DA APLICAÇÃO
// ============================================================================
/**
 * Inicializa a aplicação React no elemento DOM com id "root".
 *
 * - StrictMode: Ativa verificações adicionais e avisos durante o desenvolvimento
 * - RouterProvider: Fornece o contexto de roteamento para toda a aplicação,
 *   permitindo a navegação entre as páginas definidas em ./components/router/router
 */
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
