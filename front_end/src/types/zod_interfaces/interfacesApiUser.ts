// ======================================================
// ARQUIVO: src/types/api.types.ts
// ======================================================
//
// COMPONENTE: API Types
//
// DESCRIÇÃO:
// Arquivo centralizado contendo todas as interfaces e tipos
// relacionados às respostas da API, erros de validação Zod
// e estruturas de dados do backend.
//
// FUNÇÃO:
// - Definir tipos TypeScript para comunicação com a API
// - Garantir consistência entre frontend e backend
// - Facilitar manutenção e reutilização de tipos
// - Fornecer autocompletar e type safety no desenvolvimento
//
// OBJETIVOS:
// - Centralizar todos os tipos de API em um único arquivo
// - Evitar duplicação de interfaces
// - Facilitar importações e manutenção
// - Servir como fonte única de verdade (Single Source of Truth)
// ======================================================

// ======================================================
// TIPOS: VALIDAÇÃO E ERROS DO ZOD
// ======================================================

/**
 * Detalhe individual de erro de validação retornado pelo Zod
 * Contém o campo que falhou e a mensagem de erro específica
 */
export interface ZodErrorDetail {
  field: string;
  message: string;
}

/**
 * Resposta completa de erro da API quando há falha de validação
 * Inclui mensagem geral e opcionalmente detalhes por campo
 */
export interface ApiErrorResponse {
  error: string;
  details?: ZodErrorDetail[];
}

/**
 * Erro customizado que estende Error padrão do JavaScript
 * Adiciona suporte para detalhes de validação do Zod
 */
export interface CustomError extends Error {
  details?: ZodErrorDetail[];
}

// ======================================================
// TIPOS: ENTIDADES DO DOMÍNIO
// ======================================================

/**
 * Interface representando um usuário do sistema
 * Contém os dados básicos retornados pela API
 */
export interface User {
  id: string;
  email: string;
  name: string | null;
  cep: string;
  telefone: string;
}

// ======================================================
// TIPOS: RESPOSTAS DE SUCESSO DA API
// ======================================================

/**
 * Resposta de sucesso do endpoint de login
 * Retorna flag de sucesso e dados do usuário autenticado
 */
export interface ApiSuccessResponse {
  success: boolean;
  user: User;
}

/**
 * Resposta de sucesso do endpoint de registro
 * Retorna flag de sucesso, mensagem e dados do novo usuário
 */
export interface RegisterSuccessResponse {
  success: boolean;
  message: string;
  user: User;
}

/**
 * Resposta de sucesso genérica para operações simples
 * Utilizada em endpoints que apenas confirmam sucesso
 */
export interface GenericSuccessResponse {
  success: boolean;
  message: string;
}

// ======================================================
// TIPOS: LISTAGENS E COLEÇÕES
// ======================================================

/**
 * Resposta para listagem de usuários
 * Inclui contagem total e array de usuários
 */
export interface UsersListResponse {
  total: number;
  users: User[];
}
