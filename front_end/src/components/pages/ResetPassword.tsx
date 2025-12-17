// ======================================================
// IMPORTAÇÕES E DEPENDÊNCIAS
// ======================================================

import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import Input from "../inputs/input";
import Button from "../button_dinamic/button";

// ======================================================
// FUNÇÃO: REQUISIÇÃO DE RESET PASSWORD (API)
// ======================================================

const resetPasswordRequest = async (data: {
  token: string;
  newPassword: string;
  confirmPassword: string;
}) => {
  const response = await fetch("http://localhost:3000/reset-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.error || "Erro ao redefinir senha");
  }

  return responseData;
};

// ======================================================
// COMPONENTE: RESET PASSWORD
// ======================================================

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // ======================================================
  // ESTADOS DO FORMULÁRIO
  // ======================================================

  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // ======================================================
  // EXTRAI O TOKEN DA URL
  // ======================================================

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      // Se não houver token, redireciona para o login
      navigate("/login");
    }
  }, [searchParams, navigate]);

  // ======================================================
  // MUTATION: RESETAR SENHA
  // ======================================================

  const resetPasswordMutation = useMutation({
    mutationFn: resetPasswordRequest,

    onSuccess: (data) => {
      console.log("Senha redefinida:", data);
      // Redireciona para o login após 2 segundos
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    },

    onError: (error) => {
      console.error("Erro ao redefinir senha:", error);
    },
  });

  // ======================================================
  // HANDLER: ENVIO DO FORMULÁRIO
  // ======================================================

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    resetPasswordMutation.mutate({
      token,
      newPassword,
      confirmPassword,
    });
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
          Redefinir senha
        </h2>

        {/* Descrição */}
        <p className="mb-4 w-[350px] text-center text-xs text-gray-400">
          Digite sua nova senha abaixo.
        </p>

        {/* Campo de nova senha */}
        <Input
          placeholder="Nova senha"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          disabled={resetPasswordMutation.isPending}
          required
        />

        {/* Campo de confirmar senha */}
        <Input
          placeholder="Confirmar senha"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={resetPasswordMutation.isPending}
          required
        />

        {/* Exibe mensagem de sucesso */}
        {resetPasswordMutation.isSuccess && (
          <p className="w-[350px] text-center text-sm text-green-500">
            Senha redefinida com sucesso! Redirecionando para o login...
          </p>
        )}

        {/* Exibe mensagem de erro */}
        {resetPasswordMutation.isError && (
          <p className="w-[350px] text-center text-sm text-red-500">
            {resetPasswordMutation.error.message}
          </p>
        )}

        {/* Botão de envio */}
        <Button
          title={
            resetPasswordMutation.isPending
              ? "Redefinindo..."
              : "Redefinir senha"
          }
          type="submit"
          disabled={resetPasswordMutation.isPending}
        />

        {/* Link para voltar ao login */}
        <Link to="/login" className="w-full">
          <Button title="Voltar ao login" variantButton="outline" />
        </Link>
      </form>
    </div>
  );
};

export default ResetPassword;
