// ======================================================
// IMPORTAÇÕES E DEPENDÊNCIAS
// ======================================================

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

import Input from "../inputs/input";
import Button from "../button_dinamic/button";

//=======================================================================================>
// ======================================================
// CONTEXT: GERENCIAMENTO GLOBAL DO USUÁRIO
// ======================================================

// Hook customizado responsável por fornecer acesso ao
// contexto global do usuário.
//
// O useUser encapsula internamente o uso do useContext
// e do UserContext, centralizando toda a configuração
// e evitando imports repetitivos em cada componente.
//
// Essa abordagem melhora a legibilidade do código,
// reduz acoplamento e mantém a arquitetura mais limpa
// e escalável.
import { useUser } from "../../contexts/user/useUser";

/*
  IMPLEMENTAÇÃO INTERNA DO useUser (ABSTRAÍDA):

  import { useContext } from "react";
  import { UserContext } from "./UserContext";

  export function useUser() {
    return useContext(UserContext);
  }

  Ou seja:
  - O componente NÃO precisa importar useContext
  - O componente NÃO precisa importar UserContext
  - Toda a lógica de acesso ao contexto fica centralizada
    no hook useUser
*/
//<===================================================================================

// ======================================================
// TIPOS: RESPOSTA DE ERRO DO BACKEND COM ZOD
// ======================================================
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
  CustomError,
} from "../../types/zod_interfaces/interfacesApiUser";

// ======================================================
// FUNÇÃO: REQUISIÇÃO DE LOGIN (API)
// ======================================================
//
// Responsável por enviar as credenciais do usuário
// para o backend e retornar a resposta da autenticação
//
// Rota utilizada:
// POST http://localhost:3000/login
// ======================================================

const loginUser = async (credentials: { email: string; password: string }) => {
  // ------------------------------------------------------
  // 1️⃣ Envia a requisição HTTP para a API de login
  // ------------------------------------------------------
  const response = await fetch("http://localhost:3000/login", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  // ------------------------------------------------------
  // 2️⃣ Converte a resposta da API para JSON
  // ------------------------------------------------------
  const data = await response.json();

  // ------------------------------------------------------
  // 3️⃣ Verifica se a resposta NÃO foi bem-sucedida
  // ------------------------------------------------------
  if (!response.ok) {
    const errorData = data as ApiErrorResponse;

    const error: CustomError = new Error(errorData.error || "Falha no login");

    error.details = errorData.details;
    throw error;
  }

  // ------------------------------------------------------
  // 4️⃣ Retorna dados em caso de sucesso
  // ------------------------------------------------------
  return data as ApiSuccessResponse;
};

// ======================================================
// COMPONENTE: LOGIN
// ======================================================

const Login = () => {
  // ======================================================
  // 1️⃣ HOOKS DO REACT ROUTER
  // ======================================================

  const navigate = useNavigate();

  // ======================================================
  // 2️⃣ CONTEXTO DO USUÁRIO (PODE SER UNDEFINED)
  // ======================================================
  //
  // OBSERVAÇÃO IMPORTANTE:
  // - Em rotas públicas como /login, o contexto pode ser undefined
  // - Isso é esperado e NÃO é erro
  // - Por isso tratamos com optional chaining
  //

  const userContext = useUser(); //toda config do context

  // ======================================================
  // 3️⃣ ESTADOS DO FORMULÁRIO
  // ======================================================

  const [email, setEmail] = useState("beckymel27@gmail.com");
  const [password, setPassword] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);

  // ======================================================
  // 4️⃣ MUTATION: AUTENTICAÇÃO DO USUÁRIO
  // ======================================================

  const loginMutation = useMutation({
    mutationFn: loginUser,

    onSuccess: (data) => {
      // Salva o usuário no contexto global, se ele existir
      userContext?.setUser({
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        cep: data.user.cep,
        telefone: data.user.telefone,
      });

      console.log("Login bem-sucedido:", data.user);

      // Redireciona para a página inicial
      navigate("/");
    },

    onError: (error) => {
      console.error("Erro no login:", error);
    },
  });

  // ======================================================
  // 5️⃣ HANDLER: SUBMISSÃO DO FORMULÁRIO
  // ======================================================

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  // ======================================================
  // 6️⃣ HELPERS DE ERRO
  // ======================================================

  const getFieldError = (fieldName: string): string | undefined => {
    const error = loginMutation.error as CustomError;
    return error?.details?.find((d) => d.field === fieldName)?.message;
  };

  const errorDetails = loginMutation.isError
    ? (loginMutation.error as CustomError).details
    : undefined;

  // ======================================================
  // 7️⃣ RENDERIZAÇÃO DO COMPONENTE
  // ======================================================

  return (
    <div className="flex h-screen items-center justify-center bg-[#161410]">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center justify-center gap-2"
      >
        {/* Logo com link para home */}
        <Link to="/">
          <img className="mx-auto mb-4" src="./logo.png" alt="Logo da marca" />
        </Link>

        <div className="mb-4 flex flex-col gap-2">
          {/* ================================================= */}
          {/* CAMPO: EMAIL                                     */}
          {/* ================================================= */}
          <div className="flex flex-col gap-1">
            <Input
              placeholder="Email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loginMutation.isPending}
              className={getFieldError("email") ? "border-red-500" : ""}
            />

            {getFieldError("email") && (
              <span className="text-xs text-red-500">
                {getFieldError("email")}
              </span>
            )}
          </div>

          {/* ================================================= */}
          {/* CAMPO: SENHA                                     */}
          {/* ================================================= */}
          <div className="flex flex-col gap-1">
            <div className="relative w-full">
              <Input
                placeholder="Senha"
                type={mostrarSenha ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loginMutation.isPending}
                className={getFieldError("password") ? "border-red-500" : ""}
              />

              <button
                type="button"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                disabled={loginMutation.isPending}
              >
                {mostrarSenha ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {getFieldError("password") && (
              <span className="text-xs text-red-500">
                {getFieldError("password")}
              </span>
            )}
          </div>
        </div>

        {/* ================================================= */}
        {/* MENSAGENS DE ERRO                                 */}
        {/* ================================================= */}
        {loginMutation.isError && !errorDetails && (
          <div className="flex w-full gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm">
            <span className="shrink-0 text-red-500">⚠️</span>
            <p className="text-red-700">{loginMutation.error.message}</p>
          </div>
        )}

        {errorDetails && errorDetails.length > 1 && (
          <div className="flex w-full gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm">
            <span className="shrink-0 text-red-500">⚠️</span>
            <div className="flex flex-col gap-1">
              <p className="font-semibold text-red-700">
                Corrija os seguintes erros:
              </p>
              <ul className="list-inside list-disc text-red-600">
                {errorDetails.map((detail, index) => (
                  <li key={index}>{detail.message}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* ================================================= */}
        {/* BOTÕES E LINKS                                   */}
        {/* ================================================= */}
        <Button
          title={loginMutation.isPending ? "Carregando..." : "Login"}
          type="submit"
          disabled={loginMutation.isPending}
        />

        <Link to="/forgot-password" className="w-full">
          <Button title="Esqueci minha senha" variantButton="outline" />
        </Link>

        <Link to="/register" className="w-full">
          <Button title="Não tenho uma conta" variantButton="outline" />
        </Link>
      </form>
    </div>
  );
};

export default Login;
