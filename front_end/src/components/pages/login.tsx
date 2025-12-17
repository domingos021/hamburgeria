// ======================================================
// IMPORTAÇÕES E DEPENDÊNCIAS
// ======================================================

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";

import Input from "../inputs/input";
import Button from "../button_dinamic/button";

// ======================================================
// FUNÇÃO: REQUISIÇÃO DE LOGIN (API)
// ======================================================

// Responsável por enviar as credenciais do usuário
// para o backend e retornar a resposta da autenticação
const loginUser = async (credentials: { email: string; password: string }) => {
  const response = await fetch("http://localhost:3000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  // Converte a resposta para JSON
  const data = await response.json();

  // Verifica se a resposta da API foi bem-sucedida
  if (!response.ok) {
    // Lança o erro retornado pelo backend ou mensagem padrão
    throw new Error(data.error || "Falha no login");
  }

  // Retorna os dados da resposta (ex: token, usuário)
  return data;
};

// ======================================================
// COMPONENTE: LOGIN
// ======================================================

const Login = () => {
  // ======================================================
  // HOOKS DO REACT ROUTER
  // ======================================================

  const navigate = useNavigate();

  // ======================================================
  // ESTADOS DO FORMULÁRIO
  // ======================================================

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ======================================================
  // MUTATION: AUTENTICAÇÃO DO USUÁRIO
  // ======================================================

  const loginMutation = useMutation({
    // Função responsável por executar a requisição de login
    mutationFn: loginUser,

    // Executado quando o login ocorre com sucesso
    onSuccess: (data) => {
      console.log("Login bem-sucedido:", data);

      // Salva os dados do usuário no localStorage
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redireciona para o dashboard
      navigate("/dashboard");
    },

    // Executado quando ocorre erro na autenticação
    onError: (error) => {
      console.error("Erro no login:", error);
      // Exibir mensagem de erro para o usuário
    },
  });

  // ======================================================
  // HANDLER: ENVIO DO FORMULÁRIO
  // ======================================================

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // Impede o comportamento padrão do formulário
    e.preventDefault();

    // Dispara a mutation com os dados informados
    loginMutation.mutate({ email, password });
  };

  // ======================================================
  // RENDERIZAÇÃO DO COMPONENTE
  // ======================================================

  return (
    <div className="flex h-screen items-center justify-center bg-[#161410]">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center justify-center gap-2"
      >
        {/* Logo com redirecionamento para a home */}
        <Link to="/">
          <img className="mb-4" src="./logo.png" alt="Logo da marca" />
        </Link>

        {/* Campo de email */}
        <Input
          placeholder="Email"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loginMutation.isPending}
        />

        {/* Campo de senha */}
        <Input
          placeholder="Senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loginMutation.isPending}
        />

        {/* Exibe mensagem de erro caso a autenticação falhe */}
        {loginMutation.isError && (
          <p className="text-sm text-red-500">{loginMutation.error.message}</p>
        )}

        {/* Botão de envio do formulário */}
        <Button
          title={loginMutation.isPending ? "Carregando..." : "Login"}
          type="submit"
          disabled={loginMutation.isPending}
        />

        {/* Botão com link para recuperação de senha */}
        <Link to="/forgot-password" className="w-full">
          <Button title="Esqueci minha senha" variantButton="outline" />
        </Link>

        {/* Link para página de cadastro */}
        <Link to="/register" className="w-full">
          <Button title="Não tenho uma conta" variantButton="outline" />
        </Link>
      </form>
    </div>
  );
};

export default Login;
