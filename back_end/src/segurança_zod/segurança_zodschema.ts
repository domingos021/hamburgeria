// ======================================================
// COMPONENTE: Password Validation Schemas
// ======================================================
//
// ARQUIVO:
// src/schemas/password.schema.ts
//
// DESCRIÇÃO:
// Schemas de validação usando Zod para o fluxo de
// recuperação e redefinição de senha.
//
// FUNÇÃO:
// - Validar dados de entrada da API
// - Garantir tipos seguros em tempo de execução
// - Fornecer mensagens de erro claras e consistentes
// - Centralizar regras de validação
//
// OBJETIVOS:
// - Separar validação da lógica de negócio
// - Reutilizar schemas em múltiplos pontos
// - Melhorar testabilidade e manutenção
// - Gerar tipos TypeScript automaticamente
// ======================================================

import { z } from "zod";

// ======================================================
// SCHEMA: SOLICITAÇÃO DE RESET DE SENHA
// ======================================================
export const forgotPasswordSchema = z.object({
  email: z
    .string({ message: "Email é obrigatório" })
    .email("Email inválido")
    .toLowerCase()
    .trim(),
});

// ======================================================
// SCHEMA: REDEFINIÇÃO DE SENHA
// ======================================================
export const resetPasswordSchema = z
  .object({
    token: z
      .string({ message: "Token é obrigatório" })
      .min(1, "Token não pode estar vazio")
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

    confirmPassword: z
      .string({ message: "Confirmação de senha é obrigatória" })
      .min(1, "Confirmação de senha não pode estar vazia"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

// ======================================================
// TIPOS INFERIDOS DOS SCHEMAS
// ======================================================
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
