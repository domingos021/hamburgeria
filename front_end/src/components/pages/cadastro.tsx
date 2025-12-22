import { useState } from "react";
import Input from "../inputs/input";
import { Link } from "react-router-dom";
import Button from "../button_dinamic/button";
import { Eye, EyeOff } from "lucide-react";

const Register = () => {
  // ------------------------------
  // Estados para armazenar o email e a senha
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

  // Função para limpar o formulário
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
  // O console.log serve para depuração e exibe os valores atuais dos campos do formulário.

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Evita recarregar a página

    try {
      // Validação: senhas iguais
      if (senha !== confirmarSenha) {
        setError("As senhas não coincidem. corrija");
        setSuccessMessage(""); // limpa mensagem de sucesso
        return; // interrompe o envio
      }
      // Exibe valores para depuração (ou remova em produção)
      console.log({ name, email, senha, confirmarSenha, cep, telefone });
      // Aqui você faria a requisição para o backend (rota do registro)

      //=========================informações a ser enviada============
      /*
    Método: POST
    Headers: padrão (ex: Content-Type: application/json)
    Body: informações do cadastro do usuário (name, email, senha, cep, telefone)

    Fluxo:

    1) O frontend envia os dados do formulário usando async/await
    2) A requisição POST vai para a rota /register do backend
    3) O backend recebe os dados e cria o usuário no banco de dados
    4) Após a criação, o backend devolve uma resposta (response) ao frontend
    5) O frontend recebe a resposta e pode reagir (ex: mostrar mensagem de sucesso ou erro)

    Diagrama simplificado:

    Frontend
       |
       | POST /register {name, email, senha, cep, telefone}
       v
    Backend (rota /register)
       |
       | await prisma.user.create({ ... })
       v
    Banco de Dados (User table)
       ^
       | resposta
    Backend envia JSON { success: true, user: { ... } }
       ^
       | response
    Frontend recebe a resposta
    */

      const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Converte toda informação enviada para json
        body: JSON.stringify({
          name,
          email,
          password: senha,
          cep,
          telefone,
        }),
      });

      // EXIBE VISUALMENTE A RESPOSTA/ERRO/SUCESSO
      switch (response.status) {
        case 409:
          setError("Email já cadastrado!\nPor favor, use outro email");
          setSuccessMessage(""); // limpa mensagem de sucesso
          break;
        case 400:
          setError("Todos os campos devem estar preenchidos");
          setSuccessMessage("");
          break;
        case 201:
          resetForm(); // limpa o formulário em caso de sucesso
          setError(""); // limpa erro
          setSuccessMessage("Usuário cadastrado com sucesso");
          break;
        case 500:
          setError("tente mais tarde");
          break;
        default:
          setError("Ocorreu um erro inesperado. Tente novamente.");
          setSuccessMessage("");
      }
    } catch (err) {
      // Captura qualquer erro de rede ou execução do fetch
      console.error("Erro ao enviar formulário:", err);
      setError("Erro ao enviar formulário. Tente novamente.");
      setSuccessMessage("");
    } // ✅ Fim do try/catch
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
