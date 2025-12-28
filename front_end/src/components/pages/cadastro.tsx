import { useState } from "react";
import Input from "../inputs/input";
import { Link } from "react-router-dom";
import Button from "../button_dinamic/button";
import { Eye, EyeOff } from "lucide-react";

const Register = () => {
  // ------------------------------
  // Estados para armazenar os dados do formulário
  // ------------------------------
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [cep, setCep] = useState("");
  const [telefone, setTelefone] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // ------------------------------
  // Função para limpar o formulário
  // ------------------------------
  const resetForm = () => {
    setName("");
    setEmail("");
    setSenha("");
    setConfirmarSenha("");
    setCep("");
    setTelefone("");
    setMostrarSenha(false);
    setMostrarConfirmarSenha(false);
    setError("");
  };

  // ------------------------------
  // Função executada ao enviar o formulário
  // ------------------------------
  // Esta função é assíncrona porque realiza uma requisição
  // para a API do backend, portanto precisa aguardar (await)
  // a resposta antes de continuar a execução.
  // e.preventDefault() impede que a página seja recarregada.
  // O console.log serve para depuração.
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Evita recarregar a página

    try {
      // Exibe valores para depuração (remover em produção)
      console.log({ name, email, senha, confirmarSenha, cep, telefone });

      // ------------------------------
      // VALIDAÇÕES NO FRONTEND
      // ------------------------------

      // Verifica se os campos obrigatórios foram preenchidos
      if (!email || !senha || !confirmarSenha || !cep) {
        setError("Preencha todos os campos obrigatórios");
        setSuccessMessage("");
        return;
      }

      // Verifica se a senha e a confirmação são iguais
      if (senha !== confirmarSenha) {
        setError("As senhas não coincidem");
        setSuccessMessage("");
        return;
      }

      // ------------------------------
      // REQUISIÇÃO PARA O BACKEND
      // ------------------------------
      /*
        Método: POST
        Headers: Content-Type application/json
        Body: informações do cadastro do usuário

        Fluxo:
        1) O frontend envia os dados do formulário
        2) A requisição POST vai para a rota /register
        3) O backend valida e cria o usuário
        4) O backend devolve uma resposta
        5) O frontend trata sucesso ou erro
      */

      const response = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Converte toda informação enviada para JSON
        body: JSON.stringify({
          name,
          email,
          password: senha,
          cep,
          telefone,
        }),
      });

      // ------------------------------
      // TRATAMENTO DA RESPOSTA
      // ------------------------------
      switch (response.status) {
        case 409:
          // Email já cadastrado
          setError("Email já cadastrado!\nPor favor, use outro email");
          setSuccessMessage("");
          break;

        case 400: {
          // Erro de validação (ex: Zod, campos inválidos)
          const data = await response.json();
          setError(data.error || "Dados inválidos");
          setSuccessMessage("");
          break;
        }

        case 200:
        case 201:
          // Cadastro realizado com sucesso
          resetForm();
          setError("");
          setSuccessMessage("Usuário cadastrado com sucesso");
          break;

        default:
          // Erro inesperado
          setError("Ocorreu um erro inesperado. Tente novamente.");
          setSuccessMessage("");
      }
    } catch (err) {
      // Captura qualquer erro de rede ou execução do fetch
      console.error("Erro ao enviar formulário:", err);
      setError("Erro ao enviar formulário. Tente novamente.");
      setSuccessMessage("");
    }
  };

  return (
    // ------------------------------
    // Container principal (centraliza o conteúdo)
    // ------------------------------
    <div className="flex h-screen items-center justify-center bg-[#161410]">
      {/* ------------------------------
          Formulário de Cadastro
         ------------------------------ */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-center gap-2"
      >
        {/* Logo da marca */}
        <Link to="/">
          <img className="mx-auto mb-4" src="./logo.png" alt="Logo da marca" />
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

        {/* Campo de Telefone */}
        <Input
          placeholder="Digite seu telefone"
          type="text"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
        />

        {/* Campo de Senha */}
        <div className="relative w-full">
          <Input
            placeholder="Digite sua senha"
            type={mostrarSenha ? "text" : "password"}
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setMostrarSenha(!mostrarSenha)}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-200"
          >
            {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Campo de Confirmar Senha */}
        <div className="relative w-full">
          <Input
            placeholder="Confirme sua senha"
            type={mostrarConfirmarSenha ? "text" : "password"}
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-200"
          >
            {mostrarConfirmarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Campo de CEP */}
        <Input
          placeholder="Digite seu CEP"
          type="text"
          value={cep}
          onChange={(e) => setCep(e.target.value)}
        />

        {/* Mensagem de erro */}
        {error && (
          <div className="bg-opacity-20 mt-2 rounded bg-red-100 px-3 py-2 whitespace-pre-line">
            <p className="text-sm font-medium text-red-400">{error}</p>
          </div>
        )}

        {/* Mensagem de sucesso */}
        {successMessage && (
          <div className="bg-opacity-20 mt-2 rounded bg-green-100 px-3 py-2 whitespace-pre-line">
            <p className="text-sm font-medium text-green-400">
              {successMessage}
            </p>
          </div>
        )}

        <div className="mt-3 flex w-full flex-col gap-2">
          {/* Botão de Envio */}
          <Button title="Criar conta" type="submit" />
          <Link to="/login" className="w-full">
            <Button title="Já tenho uma conta" variantButton="outline" />
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
