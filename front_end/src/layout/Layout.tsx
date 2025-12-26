// src/layout/Layout.tsx

import { Outlet } from "react-router-dom";
import Header from "../components/Header";

/**
 * Layout padrão da aplicação
 * - Mantém estrutura fixa (Header)
 * - Renderiza páginas dinâmicas no <Outlet />
 */
export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-[#161410]">
      <Header />
      <Outlet />
    </div>
  );
}
