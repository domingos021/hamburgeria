// ======================================================
// MODEL: USER (FRONTEND)
// ======================================================
//
// Representa APENAS os dados do usuário que a aplicação
// precisa para renderização e controle de autenticação.
// Não depende do formato da API.
//
// Copiado do backend
export interface UserInterface {
  id: string;
  email: string;
  name: string | null;
  cep: string;
  telefone: string;
}
