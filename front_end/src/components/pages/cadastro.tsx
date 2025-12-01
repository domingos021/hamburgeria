import { useState } from "react";
import Input from "../inputs/input";
import { Link } from "react-router-dom";
import Button from "../button_dinamic/button";

const Register = () => {
  // ------------------------------
  // Estados para armazenar o email e a senha
  // ------------------------------
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [cep, setCep] = useState("");

  // ------------------------------
  // Função executada ao enviar o formulário
  // ------------------------------
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Evita recarregar a página
    console.log({ name, email, senha, confirmarSenha, cep });
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
          <img className="mb-4" src="./logo.png" alt="Logo da marca" />
        </Link>

        {/* Campo de Nome */}
        <Input
          placeholder="Digite seu nome"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Campo de Email */}
        <Input
          placeholder="Digite seu e-mail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Campo de Senha */}
        <Input
          placeholder="Digite sua senha"
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />

        {/* Campo de Confirmar Senha */}
        <Input
          placeholder="Confirme sua senha"
          type="password"
          value={confirmarSenha}
          onChange={(e) => setConfirmarSenha(e.target.value)}
        />

        {/* Campo de CEP */}
        <Input
          placeholder="Digite seu CEP"
          type="text"
          value={cep}
          onChange={(e) => setCep(e.target.value)}
        />

        {/* Botão de Envio */}
        <Button title="Criar conta" type="submit" />
        <Link to="/login" className="w-full">
          <Button title="Já tenho uma conta" variantButton="outline" />
        </Link>
      </form>
    </div>
  );
};

export default Register;
