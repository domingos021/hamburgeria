// ======================================================
// IMPORTAÇÕES E DEPENDÊNCIAS
// ======================================================

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import Input from "../inputs/input";
import Button from "../button_dinamic/button";

// ======================================================
// FUNÇÃO: REQUISIÇÃO DE FORGOT PASSWORD (API)
// ======================================================

const forgotPasswordRequest = async (email: string) => {
  const response = await fetch("http://localhost:3000/forgot-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Erro ao solicitar recuperação de senha");
  }

  return data;
};

// ======================================================
// COMPONENTE: FORGOT PASSWORD
// ======================================================

const ForgotPassword = () => {
  // ======================================================
  // ESTADOS DO FORMULÁRIO
  // ======================================================

  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // ======================================================
  // MUTATION: SOLICITAR RESET DE SENHA
  // ======================================================

  const forgotPasswordMutation = useMutation({
    mutationFn: forgotPasswordRequest,

    onSuccess: (data) => {
      console.log("Email enviado:", data);
      setSuccessMessage(data.message);
      setEmail(""); // Limpa o campo de email
    },

    onError: (error) => {
      console.error("Erro ao enviar email:", error);
    },
  });

  // ======================================================
  // HANDLER: ENVIO DO FORMULÁRIO
  // ======================================================

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccessMessage(""); // Limpa mensagem de sucesso anterior
    forgotPasswordMutation.mutate(email);
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

        {/* Título */}
        <h2 className="mb-2 text-center text-lg font-semibold text-white">
          Esqueci minha senha
        </h2>

        {/* Descrição */}
        <p className="mb-4 w-[350px] text-center text-xs text-gray-400">
          Digite seu email e enviaremos um link para redefinir sua senha.
        </p>

        {/* Campo de email */}
        <Input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={forgotPasswordMutation.isPending}
          required
        />

        {/* Exibe mensagem de sucesso */}
        {successMessage && (
          <p className="w-[350px] text-center text-sm text-green-500">
            {successMessage}
          </p>
        )}

        {/* Exibe mensagem de erro */}
        {forgotPasswordMutation.isError && (
          <p className="w-[350px] text-center text-sm text-red-500">
            {forgotPasswordMutation.error.message}
          </p>
        )}

        {/* Botão de envio */}
        <Button
          title={
            forgotPasswordMutation.isPending
              ? "Enviando..."
              : "Enviar link de recuperação"
          }
          type="submit"
          disabled={forgotPasswordMutation.isPending}
        />

        {/* Link para voltar ao login */}
        <Link to="/login" className="w-full">
          <Button title="Voltar ao login" variantButton="outline" />
        </Link>
      </form>
    </div>
  );
};

export default ForgotPassword;
