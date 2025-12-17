// ======================================================
// ARQUIVO: src/lib/mail.ts
// ======================================================

import nodemailer from "nodemailer";

// ======================================================
// CONFIGURAÇÃO DO TRANSPORTER (NODEMAILER)
// ======================================================

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env["MAIL_USER"],
    pass: process.env["MAIL_PASS"],
  },
});

// ======================================================
// VERIFICAÇÃO DA CONFIGURAÇÃO
// ======================================================

export async function verifyMailConnection() {
  try {
    await transporter.verify();
    console.log("✅ Servidor de email pronto");
  } catch (error) {
    console.error("❌ Erro na configuração do email:", error);
  }
}
