// ======================================================
// COMPONENTE: Auth Validation Schemas
// ======================================================
//
// ARQUIVO:
// src/schemas/auth.schema.ts
//
// DESCRIÇÃO:
// Schemas de validação usando Zod para operações de
// autenticação e gerenciamento de usuários.
//
// FUNÇÃO:
// - Validar dados de registro e login
// - Garantir tipos seguros em tempo de execução
// - Fornecer mensagens de erro claras
// - Centralizar regras de validação de auth
//
// OBJETIVOS:
// - Separar validação da lógica de negócio
// - Reutilizar schemas em múltiplos pontos
// - Melhorar testabilidade e manutenção
// - Gerar tipos TypeScript automaticamente
// ======================================================

import { z } from "zod";

// ======================================================
// SCHEMA: REGISTRO DE USUÁRIO
// ======================================================
export const registerSchema = z.object({
  email: z
    .string({ message: "Email é obrigatório" })
    .email("Email inválido")
    .toLowerCase()
    .trim(),

  password: z
    .string({ message: "Senha é obrigatória" })
    .min(8, "Senha deve ter no mínimo 8 caracteres")
    .max(100, "Senha deve ter no máximo 100 caracteres")
    .regex(/[A-Z]/, "Senha deve conter pelo menos uma letra maiúscula")
    .regex(/[a-z]/, "Senha deve conter pelo menos uma letra minúscula")
    .regex(/[0-9]/, "Senha deve conter pelo menos um número")
    .regex(
      /[^A-Za-z0-9]/,
      "Senha deve conter pelo menos um caractere especial"
    ),

  name: z
    .string()
    .min(2, "Nome deve ter no mínimo 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres")
    .trim()
    .optional(),

  cep: z
    .string({ message: "CEP é obrigatório" })
    .regex(
      /^\d{5}-?\d{3}$/,
      "CEP inválido. Use o formato 00000-000 ou 00000000"
    )
    .transform((val) => val.replace("-", "")), // Remove hífen se existir

  telefone: z
    .string({ message: "Telefone é obrigatório" })
    .regex(
      /^\(?[1-9]{2}\)?\s?9?\d{4}-?\d{4}$/,
      "Telefone inválido. Use o formato (00) 00000-0000 ou (00) 0000-0000"
    )
    .transform((val) => val.replace(/\D/g, "")), // Remove caracteres não numéricos
});

// ======================================================
// SCHEMA: LOGIN DE USUÁRIO
// ======================================================
export const loginSchema = z.object({
  email: z
    .string({ message: "Email é obrigatório" })
    .email("Email inválido")
    .toLowerCase()
    .trim(),

  password: z
    .string({ message: "Senha é obrigatória" })
    .min(1, "Senha não pode estar vazia"),
});

// ======================================================
// SCHEMA: ATUALIZAÇÃO DE SENHA
// ======================================================
export const updatePasswordSchema = z.object({
  email: z
    .string({ message: "Email é obrigatório" })
    .email("Email inválido")
    .toLowerCase()
    .trim(),

  newPassword: z
    .string({ message: "Nova senha é obrigatória" })
    .min(8, "Senha deve ter no mínimo 8 caracteres")
    .max(100, "Senha deve ter no máximo 100 caracteres")
    .regex(/[A-Z]/, "Senha deve conter pelo menos uma letra maiúscula")
    .regex(/[a-z]/, "Senha deve conter pelo menos uma letra minúscula")
    .regex(/[0-9]/, "Senha deve conter pelo menos um número")
    .regex(
      /[^A-Za-z0-9]/,
      "Senha deve conter pelo menos um caractere especial"
    ),
});

// ======================================================
// TIPOS INFERIDOS DOS SCHEMAS
// ======================================================
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;
