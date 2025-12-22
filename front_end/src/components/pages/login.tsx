// ======================================================
// IMPORTAÇÕES E DEPENDÊNCIAS
// ======================================================

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";

import Input from "../inputs/input";
import Button from "../button_dinamic/button";
import { Eye, EyeOff } from "lucide-react";

// ======================================================
// TIPOS: RESPOSTA DE ERRO DO BACKEND COM ZOD
// ======================================================
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
  CustomError,
} from "../../types/zod_interfaces/interfaces";

// ======================================================
// FUNÇÃO: REQUISIÇÃO DE LOGIN (API)
// ======================================================

// Responsável por enviar as credenciais do usuário
// para o backend e retornar a resposta da autenticação
/*
  Realiza a comunicação com o backend enviando
  as credenciais de login e recebendo a resposta
  de autenticação pela rota:
  POST http://localhost:3000/login
*/

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
    // Converte para tipo de erro
    const errorData = data as ApiErrorResponse;

    // Cria um erro customizado que inclui os detalhes de validação do Zod
    const error: CustomError = new Error(errorData.error || "Falha no login");

    // Anexa os detalhes dos erros de validação ao objeto de erro
    error.details = errorData.details;

    // Lança o erro com os detalhes para ser capturado pelo onError
    throw error;
  }

  // Retorna os dados da resposta (ex: token, usuário)
  return data as ApiSuccessResponse;
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
  const [mostrarSenha, setMostrarSenha] = useState(false);

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
      // Os detalhes do erro agora incluem informações específicas do Zod
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
  // HELPER: BUSCA ERRO ESPECÍFICO DE UM CAMPO
  // ======================================================

  // Função auxiliar para verificar se há erro de validação
  // em um campo específico e retornar a mensagem
  const getFieldError = (fieldName: string): string | undefined => {
    const error = loginMutation.error as CustomError;
    return error?.details?.find((d) => d.field === fieldName)?.message;
  };

  // ======================================================
  // HELPER: OBTÉM DETALHES DE ERRO DO ZOD
  // ======================================================

  // Extrai os detalhes de validação do erro, se existirem
  const errorDetails = loginMutation.isError
    ? (loginMutation.error as CustomError).details
    : undefined;

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
          <img className="mx-auto mb-4" src="./logo.png" alt="Logo da marca" />
        </Link>

        <div className="mb-4 flex flex-col gap-2">
          {/* ============================================ */}
          {/* CAMPO: EMAIL COM VALIDAÇÃO VISUAL           */}
          {/* ============================================ */}
          <div className="flex flex-col gap-1">
            <Input
              placeholder="Email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loginMutation.isPending}
              // Adiciona borda vermelha se houver erro de validação
              className={getFieldError("email") ? "border-red-500" : ""}
            />
            {/* Exibe mensagem de erro específica do campo email */}
            {getFieldError("email") && (
              <span className="text-xs text-red-500">
                {getFieldError("email")}
              </span>
            )}
          </div>

          {/* ============================================ */}
          {/* CAMPO: SENHA COM VALIDAÇÃO VISUAL           */}
          {/* ============================================ */}
          <div className="relative flex w-full flex-col gap-1">
            <Input
              placeholder="Senha"
              type={mostrarSenha ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loginMutation.isPending}
              className={`w-full ${getFieldError("password") ? "border-red-500" : ""}`}
            />
            <button
              type="button"
              onClick={() => setMostrarSenha(!mostrarSenha)}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-200"
            >
              {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>

            {/* Exibe mensagem de erro específica do campo senha */}
            {getFieldError("password") && (
              <span className="text-xs text-red-500">
                {getFieldError("password")}
              </span>
            )}
          </div>
        </div>

        {/* ================================================ */}
        {/* MENSAGEM: ERRO GERAL (SEM DETALHES DE VALIDAÇÃO) */}
        {/* ================================================ */}
        {/* Exibe apenas quando há erro MAS não há detalhes do Zod */}
        {/* (ex: credenciais inválidas, servidor offline, etc) */}
        {loginMutation.isError && !errorDetails && (
          <div className="flex w-full gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm">
            <span className="shrink-0 text-red-500">⚠️</span>
            <p className="text-red-700">{loginMutation.error.message}</p>
          </div>
        )}

        {/* ================================================ */}
        {/* MENSAGEM: LISTA DE ERROS DE VALIDAÇÃO (MÚLTIPLOS) */}
        {/* ================================================ */}
        {/* Exibe lista completa quando há mais de um erro de validação */}
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

        {/* ================================================ */}
        {/* BOTÃO: SUBMIT DO FORMULÁRIO                      */}
        {/* ================================================ */}
        <Button
          title={loginMutation.isPending ? "Carregando..." : "Login"}
          type="submit"
          disabled={loginMutation.isPending}
        />

        {/* ================================================ */}
        {/* BOTÃO: RECUPERAÇÃO DE SENHA                      */}
        {/* ================================================ */}
        <Link to="/forgot-password" className="w-full">
          <Button title="Esqueci minha senha" variantButton="outline" />
        </Link>

        {/* ================================================ */}
        {/* LINK: PÁGINA DE CADASTRO                         */}
        {/* ================================================ */}
        <Link to="/register" className="w-full">
          <Button title="Não tenho uma conta" variantButton="outline" />
        </Link>
      </form>
    </div>
  );
};

export default Login;
