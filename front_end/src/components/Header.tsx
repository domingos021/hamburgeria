// ======================================================
// COMPONENTE: Header
// ======================================================
// Responsável por exibir o cabeçalho principal da aplicação.
//
// Funções do Header:
// - Exibir o logo da aplicação
// - Renderizar navegação principal
// - Exibir ações rápidas do sistema
// - Mostrar carrinho de compras
// - Gerenciar área do usuário (login / logout)
// ======================================================

import { Link, useLocation } from "react-router-dom";
import { LogOut, ShoppingCart, Box, LayoutDashboard, Plus } from "lucide-react"; // Ícones da biblioteca Lucide
import { useUser } from "../contexts/user/useUser";

// ======================================================
// COMPONENTE FUNCIONAL
// ======================================================

const Header = () => {
  // Recupera os dados do usuário autenticado e a função de logout
  // a partir do contexto global de autenticação
  const { user, logout } = useUser();

  // Hook responsável por fornecer informações da rota atual
  const location = useLocation();

  // ======================================================
  // FUNÇÃO: getNavItemClassStyles
  // ======================================================
  // Define dinamicamente as classes CSS dos ícones de navegação.
  //
  // Responsabilidades:
  // - Aplicar um estilo base comum a todos os ícones
  // - Destacar visualmente o ícone correspondente à rota ativa
  //
  // Parâmetro:
  // - path: rota associada ao ícone
  //
  // Retorno:
  // - String contendo as classes CSS apropriadas
  // ======================================================

  const getNavItemClassStyles = (path: string) => {
    // Estilo base compartilhado entre todos os ícones
    const baseClassStyles =
      "flex h-[35px] w-[35px] cursor-pointer items-center justify-center rounded-md border-2 transition-colors";

    // Verifica se a rota atual corresponde à rota do ícone
    if (location.pathname === path) {
      // Estilo aplicado quando o item está ativo
      return `${baseClassStyles} text-[#161410] bg-[#F2DAAC]`;
    }

    // Estilo padrão quando o item não está ativo
    return baseClassStyles;
  };

  return (
    <header className="bg-[#161410]">
      {/* ==================================================
          CONTAINER CENTRAL DO HEADER
          - Controla largura máxima
          - Alinha logo e navegação
      ================================================== */}
      <div className="mx-auto flex w-full items-center justify-between p-3 md:w-[737px] md:p-0">
        {/* ==================================================
            LOGO DA APLICAÇÃO
            - Redireciona para a rota inicial
        ================================================== */}
        <Link to="/">
          <img src="./logo.png" alt="Logo da marca" />
        </Link>

        {/* ==================================================
            NAVEGAÇÃO / ÁREA DO USUÁRIO
        ================================================== */}
        <nav>
          {/* ==================================================
              RENDERIZAÇÃO CONDICIONAL
              - Usuário autenticado → exibe ações e perfil
              - Usuário não autenticado → exibe botão de login
          ================================================== */}
          {user ? (
            <div className="flex items-center gap-8 text-sm font-semibold text-white select-none">
              {/* ==================================================
                  AÇÕES RÁPIDAS DO SISTEMA
                  - Navegação por ícones
              ================================================== */}
              <div className="flex items-center gap-2 text-[#F2DAAC]">
                {/* Rota inicial */}
                <Link to="/">
                  <div className={getNavItemClassStyles("/")}>
                    <Box size={18} />
                  </div>
                </Link>

                {/* Rota de pedidos */}
                <Link to="/pedidos">
                  <div className={getNavItemClassStyles("/pedidos")}>
                    <LayoutDashboard size={18} />
                  </div>
                </Link>

                {/* Ação futura (ex: adicionar novo item) */}
                <div className="flex h-[35px] w-[35px] cursor-pointer items-center justify-center rounded-md border-2">
                  <Plus size={18} />
                </div>
              </div>

              {/* ==================================================
                  ÍCONE DO CARRINHO DE COMPRAS
              ================================================== */}
              <div className="relative cursor-pointer">
                <ShoppingCart size={18} />

                {/* Badge indicando quantidade de itens */}
                <p className="absolute -top-4 -right-4 flex h-5 w-5 items-center justify-center rounded-full bg-[#F2DAAC] text-[#161410]">
                  1
                </p>
              </div>

              {/* ==================================================
                  INFORMAÇÕES DO USUÁRIO AUTENTICADO
              ================================================== */}
              <div className="flex items-center gap-2">
                <span>Bem-vindo,</span>

                {/* Nome do usuário */}
                <span className="font-medium">{user.name}</span>

                {/* Botão de logout */}
                <LogOut
                  size={18}
                  onClick={logout}
                  className="ml-1 cursor-pointer transition-colors hover:text-red-400"
                />
              </div>
            </div>
          ) : (
            /* ==================================================
               BOTÃO DE LOGIN
               - Exibido quando o usuário não está autenticado
            ================================================== */
            <Link to="/login">
              <button className="flex h-[35px] w-[130px] cursor-pointer items-center justify-center rounded-sm bg-[#F2DAAC] transition-colors hover:bg-[#E5CD9A]">
                Entrar
              </button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
