import { useState } from "react";
import Input from "../inputs/input";
import { Link } from "react-router-dom";
import Button from "../button_dinamic/button";

const Login = () => {
  // ------------------------------
  // Estados para armazenar o email e a senha
  // ------------------------------
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ------------------------------
  // Função executada ao enviar o formulário
  // ------------------------------
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Evita recarregar a página
    console.log("Email:", email);
    console.log("Senha:", password);
  };

  return (
    // ------------------------------
    // Container principal (centraliza o conteúdo)
    // ------------------------------
    <div className="flex h-screen items-center justify-center bg-[#161410]">
      {/* ------------------------------
          Formulário de Login
         ------------------------------ */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center justify-center gap-2"
      >
        {/* Logo da marca */}
        <Link to="/">
          {" "}
          <img className="mb-4" src="./logo.png" alt="Logo da marca" />
        </Link>

        {/* Campo de Email */}
        <Input
          placeholder="Email"
          type="text"
          value={email} // ← Adicione esta linha
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Campo de Senha */}
        <Input
          placeholder="Senha"
          type="password"
          value={password} // ← Adicione esta linha
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button title="Login" />
        <Link to="/register" className="w-full">
          <Button title="Não tenho uma conta" variantButton="outline" />
        </Link>
      </form>
    </div>
  );
};

export default Login;
