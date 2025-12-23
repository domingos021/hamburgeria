// ======================================================
// IMPORTAÇÕES E DEPENDÊNCIAS
// ======================================================

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

import Input from "../inputs/input";
import Button from "../button_dinamic/button";

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
// ======================================================
// FUNÇÃO: loginUser
// RESPONSABILIDADE: Realizar autenticação do usuário
// ======================================================

const loginUser = async (credentials: { email: string; password: string }) => {
  // ------------------------------------------------------
  // 1️⃣ Envia a requisição HTTP para a API de login
  //    - Método: POST
  //    - Endpoint: /login
  //    - Corpo: credenciais do usuário (email e senha)
  //    - credentials: "include" permite enviar/receber cookies HttpOnly
  // ------------------------------------------------------
  const response = await fetch("http://localhost:3000/login", {
    method: "POST",
    credentials: "include", // Essencial para que cookies funcionem entre domínios diferentes
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  // ------------------------------------------------------
  // 2️⃣ Converte a resposta da API para o formato JSON
  //    - Pode conter dados de sucesso ou de erro
  // ------------------------------------------------------
  const data = await response.json();

  // ------------------------------------------------------
  // 3️⃣ Verifica se a resposta da API NÃO foi bem-sucedida
  //    - response.ok será false para status 4xx ou 5xx
  // ------------------------------------------------------
  if (!response.ok) {
    // --------------------------------------------------
    // 4️⃣ Converte o JSON retornado para o tipo de erro esperado
    //    - Normalmente contém mensagem e detalhes do Zod
    // --------------------------------------------------
    const errorData = data as ApiErrorResponse;

    // --------------------------------------------------
    // 5️⃣ Cria um erro customizado com mensagem da API
    //    - Usa a mensagem retornada ou uma mensagem padrão
    // --------------------------------------------------
    const error: CustomError = new Error(errorData.error || "Falha no login");

    // --------------------------------------------------
    // 6️⃣ Anexa os detalhes dos erros de validação
    //    - Utilizado para exibir mensagens específicas no frontend
    // --------------------------------------------------
    error.details = errorData.details;

    // --------------------------------------------------
    // 7️⃣ Lança o erro para ser tratado por quem chamou a função
    //    - Ex: onError do React Query ou try/catch
    // --------------------------------------------------
    throw error;
  }

  // ------------------------------------------------------
  // 8️⃣ Retorna os dados em caso de sucesso
  //    - Ex: token JWT e informações do usuário
  // ------------------------------------------------------
  return data as ApiSuccessResponse;
};

// ======================================================
// COMPONENTE: LOGIN
// ======================================================

const Login = () => {
  // ======================================================
  // 1️⃣ HOOKS DO REACT ROUTER
  //    - Responsáveis pela navegação entre páginas
  // ======================================================

  const navigate = useNavigate();

  // ======================================================
  // 2️⃣ ESTADOS DO FORMULÁRIO
  //    - Controlam os valores digitados pelo usuário
  // ======================================================

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);

  // ======================================================
  // 3️⃣ MUTATION: AUTENTICAÇÃO DO USUÁRIO
  //    - Gerencia a requisição de login e seus estados
  // ======================================================

  const loginMutation = useMutation({
    // 3.1️⃣ Função responsável por executar a requisição de login
    mutationFn: loginUser,

    // 3.2️⃣ Executado quando o login ocorre com sucesso
    onSuccess: (data) => {
      console.log("Login bem-sucedido:", data);

      // 3.2.1️⃣ O cookie JWT foi automaticamente salvo pelo backend
      //        Não é necessário salvar nada no localStorage ou criar cookies manualmente
      //        O navegador gerencia os cookies HttpOnly automaticamente

      // 3.2.2️⃣ Redireciona o usuário para o dashboard ou seção inicial
      navigate("/");
    },

    // 3.3️⃣ Executado quando ocorre erro na autenticação
    onError: (error) => {
      console.error("Erro no login:", error);
      // Os detalhes do erro podem conter validações do Zod
    },
  });

  // ======================================================
  // 4️⃣ HANDLER: ENVIO DO FORMULÁRIO
  //    - Disparado ao submeter o formulário
  // ======================================================

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // 4.1️⃣ Impede o comportamento padrão do formulário (reload da página)
    e.preventDefault();

    // 4.2️⃣ Dispara a mutation com os dados informados pelo usuário
    loginMutation.mutate({ email, password });
  };

  // ======================================================
  // 5️⃣ HELPER: BUSCA ERRO ESPECÍFICO DE UM CAMPO
  //    - Utilizado para exibir mensagens de erro por input
  // ======================================================

  const getFieldError = (fieldName: string): string | undefined => {
    // 5.1️⃣ Converte o erro retornado para o tipo CustomError
    const error = loginMutation.error as CustomError;

    // 5.2️⃣ Procura o erro correspondente ao campo informado
    return error?.details?.find((d) => d.field === fieldName)?.message;
  };

  // ======================================================
  // 6️⃣ HELPER: OBTÉM LISTA DE ERROS DE VALIDAÇÃO DO ZOD
  //    - Usado para exibir erros múltiplos
  // ======================================================

  const errorDetails = loginMutation.isError
    ? (loginMutation.error as CustomError).details
    : undefined;

  // ======================================================
  // 7️⃣ RENDERIZAÇÃO DO COMPONENTE
  // ======================================================

  return (
    <div className="flex h-screen items-center justify-center bg-[#161410]">
      <form
        // 7.1️⃣ Associa o submit do formulário ao handler
        onSubmit={handleSubmit}
        className="flex flex-col items-center justify-center gap-2"
      >
        {/* 7.2️⃣ Logo com link para a página inicial */}
        <Link to="/">
          <img className="mx-auto mb-4" src="./logo.png" alt="Logo da marca" />
        </Link>

        <div className="mb-4 flex flex-col gap-2">
          {/* ================================================= */}
          {/* 8️⃣ CAMPO: EMAIL COM VALIDAÇÃO VISUAL              */}
          {/* ================================================= */}
          <div className="flex flex-col gap-1">
            <Input
              placeholder="Email"
              type="text"
              value={email}
              // 8.1️⃣ Atualiza o estado conforme o usuário digita
              onChange={(e) => setEmail(e.target.value)}
              disabled={loginMutation.isPending}
              // 8.2️⃣ Aplica borda vermelha se houver erro no campo
              className={getFieldError("email") ? "border-red-500" : ""}
            />

            {/* 8.3️⃣ Exibe mensagem de erro específica do email */}
            {getFieldError("email") && (
              <span className="text-xs text-red-500">
                {getFieldError("email")}
              </span>
            )}
          </div>

          {/* ================================================= */}
          {/* 9️⃣ CAMPO: SENHA COM VISIBILIDADE DINÂMICA         */}
          {/* ================================================= */}
          <div className="flex flex-col gap-1">
            <div className="relative w-full">
              <Input
                placeholder="Senha"
                type={mostrarSenha ? "text" : "password"}
                value={password}
                // 9.1️⃣ Atualiza o estado da senha
                onChange={(e) => setPassword(e.target.value)}
                disabled={loginMutation.isPending}
                // 9.2️⃣ Aplica borda vermelha se houver erro
                className={getFieldError("password") ? "border-red-500" : ""}
              />

              {/* 9.3️⃣ Botão para alternar visibilidade da senha */}
              <button
                type="button"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                disabled={loginMutation.isPending}
              >
                {mostrarSenha ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* 9.4️⃣ Exibe mensagem de erro específica da senha */}
            {getFieldError("password") && (
              <span className="text-xs text-red-500">
                {getFieldError("password")}
              </span>
            )}
          </div>
        </div>

        {/* ================================================= */}
        {/* 🔟 MENSAGEM: ERRO GERAL (SEM DETALHES DE VALIDAÇÃO) */}
        {/* ================================================= */}
        {loginMutation.isError && !errorDetails && (
          <div className="flex w-full gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm">
            <span className="shrink-0 text-red-500">⚠️</span>
            <p className="text-red-700">{loginMutation.error.message}</p>
          </div>
        )}

        {/* ================================================= */}
        {/* 1️⃣1️⃣ MENSAGEM: ERROS MÚLTIPLOS DE VALIDAÇÃO        */}
        {/* ================================================= */}
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
        {/* 1️⃣2️⃣ BOTÃO: SUBMIT DO FORMULÁRIO                   */}
        {/* ================================================= */}
        <Button
          title={loginMutation.isPending ? "Carregando..." : "Login"}
          type="submit"
          disabled={loginMutation.isPending}
        />

        {/* ================================================= */}
        {/* 1️⃣3️⃣ LINK: RECUPERAÇÃO DE SENHA                    */}
        {/* ================================================= */}
        <Link to="/forgot-password" className="w-full">
          <Button title="Esqueci minha senha" variantButton="outline" />
        </Link>

        {/* ================================================= */}
        {/* 1️⃣4️⃣ LINK: PÁGINA DE CADASTRO                      */}
        {/* ================================================= */}
        <Link to="/register" className="w-full">
          <Button title="Não tenho uma conta" variantButton="outline" />
        </Link>
      </form>
    </div>
  );
};

export default Login;
