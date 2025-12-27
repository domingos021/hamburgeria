import { Link } from "react-router-dom";
import { useUser } from "../contexts/user/useUser";
import { LogOut, ShoppingCart, Box, LayoutDashboard, Plus } from "lucide-react"; //da biblioteca lucide

const Header = () => {
  const { user } = useUser();
  return (
    <header className="bg-[#161410]">
      <div className="mx-auto flex w-full items-center justify-between p-3 md:w-[737px] md:p-0">
        {/* Logo da marca */}
        <img src="./logo.png" alt="Logo da marca" />
        <nav>
          {/* Renderização condicional:
              - Se o usuário estiver logado, exibe o nome
              - Caso contrário, exibe o botão de login
          */}

          {user ? (
            <div className="flex items-center gap-8 text-sm font-semibold text-white select-none">
              <div className="text-[#F2DAAC]zs flex items-center gap-2">
                <div className="bg flex h-[35px] w-[35px] cursor-pointer items-center justify-center rounded-md border-2">
                  <Box size={18} />
                </div>

                <div className="bg flex h-[35px] w-[35px] cursor-pointer items-center justify-center rounded-md border-2">
                  <LayoutDashboard size={18} />
                </div>

                <div className="bg flex h-[35px] w-[35px] cursor-pointer items-center justify-center rounded-md border-2">
                  <Plus size={18} />
                </div>
              </div>
              <ShoppingCart size={18} className="cursor-pointer" />

              <div className="flex items-center gap-2">
                <span>Bem-vindo,</span>

                <span className="font-medium">{user.name}</span>

                <LogOut
                  size={18}
                  className="ml-1 cursor-pointer transition-colors hover:text-red-400"
                />
              </div>
            </div>
          ) : (
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
