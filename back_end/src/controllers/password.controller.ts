// ======================================================
// ARQUIVO: src/controllers/password.controller.ts
// ======================================================

import { Request, Response } from "express";
import { prisma } from "../lib/db.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { transporter } from "../lib/mail.js";

// ======================================================
// CONTROLLER: SOLICITAR RESET DE SENHA
// ======================================================

export async function forgotPassword(request: Request, response: Response) {
  const { email } = request.body;

  if (!email) {
    return response.status(400).json({
      error: "Email é obrigatório",
    });
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  // Segurança: não revela se o email existe
  if (!user) {
    return response.json({
      message: "Se o email existir, enviaremos instruções",
    });
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 15 * 60 * 1000);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetToken: token,
      resetTokenExpiry: expires,
    },
  });

  await transporter.sendMail({
    to: email,
    subject: "Redefinição de senha",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Redefinição de senha</h2>
        <p>Você solicitou a redefinição de senha.</p>
        <p>Clique no botão abaixo para redefinir sua senha:</p>
        <a 
          href="http://localhost:3000/reset-password?token=${token}"
          style="
            display: inline-block;
            padding: 12px 24px;
            background-color: #C92A0E;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
          "
        >
          Redefinir senha
        </a>
        <p style="color: #666; font-size: 12px;">
          Este link expira em 15 minutos.
        </p>
      </div>
    `,
  });

  return response.json({
    message: "Email enviado com sucesso",
  });
}

// ======================================================
// CONTROLLER: RESETAR SENHA
// ======================================================

export async function resetPassword(request: Request, response: Response) {
  const { token, newPassword, confirmPassword } = request.body;

  if (!token || !newPassword || !confirmPassword) {
    return response.status(400).json({
      error: "Todos os campos são obrigatórios",
    });
  }

  if (newPassword !== confirmPassword) {
    return response.status(400).json({
      error: "As senhas não coincidem",
    });
  }

  if (newPassword.length < 8) {
    return response.status(400).json({
      error: "A senha deve ter no mínimo 8 caracteres",
    });
  }

  const user = await prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiry: {
        gte: new Date(),
      },
    },
  });

  if (!user) {
    return response.status(401).json({
      error: "Token inválido ou expirado",
    });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    },
  });

  return response.json({
    message: "Senha redefinida com sucesso",
  });
}
