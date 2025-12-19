// ======================================================
// COMPONENTE: MailService (Email Transacional)
// ======================================================
//
// ARQUIVO:
// src/lib/mail.ts
//
// DESCRIÇÃO:
// Módulo responsável pelo envio de emails transacionais
// da aplicação, com foco em comunicação segura e confiável
// com o usuário.
//
// FUNÇÃO:
// - Inicializar o cliente de email (Resend)
// - Centralizar a configuração de remetente
// - Enviar emails de redefinição de senha
// - Validar configuração do serviço de email
//
// OBJETIVOS:
// - Garantir envio de emails transacionais de forma segura
// - Centralizar lógica de comunicação por email
// - Facilitar manutenção e troca de provedores de email
// - Fornecer templates HTML profissionais e consistentes
// - Aumentar confiabilidade e rastreabilidade de comunicações
// ======================================================

// ======================================================
// ARQUIVO: src/lib/mail.ts
// RESPONSABILIDADE: ENVIO DE EMAILS
// ======================================================

// Biblioteca Resend para envio de emails transacionais
import { Resend } from "resend";

// ======================================================
// CONFIGURAÇÃO DO CLIENTE DE EMAIL
// ======================================================

// Inicializa o cliente Resend com a chave da API
export const resend = new Resend(process.env["RESEND_API_KEY"]);

// Email remetente padrão (fallback para ambiente de teste)
export const FROM_EMAIL = process.env["EMAIL_FROM"] || "onboarding@resend.dev";

// ======================================================
// VERIFICAÇÃO DA CONFIGURAÇÃO DO SERVIÇO
// ======================================================
// Usado geralmente na inicialização da aplicação
export async function verifyMailConnection() {
  try {
    // Verifica se a variável de ambiente está configurada
    if (!process.env["RESEND_API_KEY"]) {
      throw new Error("RESEND_API_KEY não configurada");
    }

    console.log("✅ Resend configurado com sucesso");
  } catch (error) {
    console.error("❌ Erro na configuração do Resend:", error);
  }
}

// ======================================================
// FUNÇÃO: ENVIAR EMAIL DE RESET DE SENHA
// ======================================================
// Responsável apenas por montar e enviar o email
export async function sendPasswordResetEmail(
  to: string, // email do destinatário
  token: string, // token de redefinição
  frontendUrl: string // URL do frontend
) {
  // --------------------------------------------------
  // MONTA O LINK DE REDEFINIÇÃO
  // --------------------------------------------------
  const resetLink = `${frontendUrl}/reset-password?token=${token}`;

  try {
    // --------------------------------------------------
    // ENVIO DO EMAIL
    // --------------------------------------------------
    const { data, error } = await resend.emails.send({
      from: `Seu App <${FROM_EMAIL}>`,
      to,
      subject: "Redefinição de senha",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; background-color: #f4f4f4;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
                    
                    <!-- HEADER -->
                    <tr>
                      <td style="background-color: #161410; padding: 30px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">
                          Redefinição de Senha
                        </h1>
                      </td>
                    </tr>
                    
                    <!-- CONTEÚDO PRINCIPAL -->
                    <tr>
                      <td style="padding: 40px 30px;">
                        <p style="color: #333; font-size: 16px; line-height: 24px;">
                          Olá!
                        </p>

                        <p style="color: #333; font-size: 16px; line-height: 24px;">
                          Você solicitou a redefinição de senha da sua conta.
                        </p>

                        <!-- BOTÃO DE AÇÃO -->
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td align="center" style="padding: 20px 0;">
                              <a
                                href="${resetLink}"
                                style="display: inline-block; padding: 16px 32px; background-color: #C92A0E; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;"
                              >
                                Redefinir Senha
                              </a>
                            </td>
                          </tr>
                        </table>

                        <!-- AVISO DE EXPIRAÇÃO -->
                        <p style="color: #666; font-size: 14px;">
                          <strong>⏱️ Este link expira em 15 minutos.</strong>
                        </p>

                        <!-- MENSAGEM DE SEGURANÇA -->
                        <p style="color: #666; font-size: 14px;">
                          Se você não solicitou esta redefinição, ignore este email.
                        </p>

                        <!-- LINK ALTERNATIVO -->
                        <div style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
                          <p style="color: #999; font-size: 12px;">
                            Se o botão não funcionar, copie e cole este link:
                          </p>
                          <p style="color: #C92A0E; font-size: 12px; word-break: break-all;">
                            ${resetLink}
                          </p>
                        </div>
                      </td>
                    </tr>
                    
                    <!-- RODAPÉ -->
                    <tr>
                      <td style="background-color: #f8f8f8; padding: 20px; text-align: center;">
                        <p style="color: #999; font-size: 12px;">
                          © ${new Date().getFullYear()} Seu App. Todos os direitos reservados.
                        </p>
                      </td>
                    </tr>

                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    });

    // --------------------------------------------------
    // TRATAMENTO DE ERRO NO ENVIO
    // --------------------------------------------------
    if (error) {
      console.error("❌ Erro ao enviar email:", error);
      throw new Error("Falha ao enviar email");
    }

    console.log("✅ Email enviado com sucesso:", data?.id);
    return data;
  } catch (error) {
    console.error("❌ Erro no envio:", error);
    throw error;
  }
}
