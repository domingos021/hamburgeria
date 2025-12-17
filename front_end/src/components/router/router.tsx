/**
 * ============================================================================
 * CONFIGURAÇÃO DE ROTAS DA APLICAÇÃO
 * ============================================================================
 *
 * Este arquivo centraliza todas as rotas da aplicação, facilitando manutenção,
 * organização e reutilização de layouts compartilhados.
 *
 * Ele utiliza o React Router v6+, que trabalha com rotas aninhadas e o
 * componente <Outlet />, permitindo criar layouts com partes fixas
 * (como header, sidebar, footer) e uma área dinâmica onde as rotas filhas
 * são renderizadas.
 */

import { createBrowserRouter, Outlet } from "react-router-dom";

// Importação das páginas
import Login from "../pages/login";
import Register from "../pages/cadastro";
import Home from "../pages/home";
import Header from "../Header";
import OrderRequests from "../pages/pedidos";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";

/**
 * ============================================================================
 * LAYOUT PADRÃO DA APLICAÇÃO
 * ============================================================================
 *
 * O layout é um componente usado para criar estruturas fixas na interface.
 *
 * - Tudo dentro dele é exibido em TODAS as rotas filhas.
 * - O <Outlet /> funciona como um "espaço reservado" onde as rotas internas
 *   serão renderizadas.
 *
 * Exemplo:
 * <Layout>
 *   [Header fixo]
 *   <Outlet />  ← aqui o conteúdo da página muda conforme a rota
 *   [Footer fixo]
 * </Layout>
 */
const layout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-[#161410]">
      <Header />

      {/* 
        O <Outlet /> renderiza o conteúdo da rota filha atual.
        
        Explicação simples:
        → "Aqui dentro aparece a página correspondente à rota acessada."
        
        Explicação técnica:
        → Rotas que são filhas deste layout usarão o Outlet para exibir
          seus componentes, permitindo que o layout mantenha elementos fixos
          (como header ou menus) sem precisar repetir código.
      */}
      <Outlet />
    </div>
  );
};

/**
 * ============================================================================
 * DEFINIÇÃO DAS ROTAS
 * ============================================================================
 *
 * Aqui configuramos todas as rotas da aplicação com seus respectivos
 * componentes e layouts.
 *
 * IMPORTANTE:
 * - Cada rota filha de um layout será exibida dentro do <Outlet />.
 * - Rotas definidas fora de um layout funcionam normalmente, sem compartilhar
 *   cabeçalho, menu ou estrutura fixa.
 */
export const router = createBrowserRouter([
  // ROTAS QUE UTILIZAM O LAYOUT PADRÃO
  {
    element: layout(), // ← Layout aplicado a esta seção

    children: [
      {
        path: "/", // Rota inicial
        element: <Home />,
      },
      {
        path: "/pedidos", // Rota inicial
        element: <OrderRequests />,
      },
    ],
  },

  // ROTAS SEM LAYOUT (renderizam sem header ou estrutura fixa)
  {
    path: "/login",
    element: <Login />,
  },

  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
]);
