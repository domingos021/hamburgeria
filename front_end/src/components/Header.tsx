import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-[#161410]">
      <div className="mx-auto flex w-full items-center justify-between p-3 md:w-[737px] md:p-0">
        {/* Logo da marca */}
        <img src="./logo.png" alt="Logo da marca" />

        <nav>
          <Link to="/login">
            <button className="flex h-[35px] w-[130px] cursor-pointer items-center justify-center rounded-sm bg-[#F2DAAC] transition-colors hover:bg-[#E5CD9A]">
              Entrar
            </button>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
