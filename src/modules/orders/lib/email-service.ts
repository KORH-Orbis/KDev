import { Resend } from "resend";
import { config } from "../../core/lib/config";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendTrackingEmailParams {
  trackingCode: string;
  clientName: string;
  clientEmail: string;
  deviceType: string;
  deviceBrand?: string | null;
  deviceModel?: string | null;
  issue: string;
}

export async function sendTrackingEmail({
  trackingCode,
  clientName,
  clientEmail,
  deviceType,
  deviceBrand,
  deviceModel,
  issue,
}: SendTrackingEmailParams) {
  const fromEmail =
    process.env.CONTACT_FROM_EMAIL || "onboarding@resend.dev";
  const fromName =
    process.env.CONTACT_FROM_NAME || config.appName;
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const device = [deviceType, deviceBrand, deviceModel]
    .filter(Boolean)
    .join(" — ");

  try {
    await resend.emails.send({
      from: `${fromName} <${fromEmail}>`,
      to: clientEmail,
      subject: `${config.appName} — Código de seguimiento: ${trackingCode}`,
      html: `
        <div style="font-family: Inter, system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; background: #0a0a0a; color: #e0e0e0; border-radius: 16px;">
          <h1 style="color: #e63946; margin: 0 0 8px; font-size: 24px;">${config.appName}</h1>
          <p style="color: #a0a0a0; margin: 0 0 24px; font-size: 16px;">Servicio técnico profesional</p>

          <p style="margin: 0 0 24px; font-size: 16px;">Hola <strong>${clientName}</strong>,</p>

          <p style="margin: 0 0 16px; font-size: 15px; line-height: 1.6;">
            Tu equipo ha sido registrado en nuestro sistema de reparaciones.
            Acá tenés la información de tu orden:
          </p>

          <div style="background: #16213e; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
            <div style="margin-bottom: 12px;">
              <span style="color: #a0a0a0; font-size: 13px;">Código de seguimiento</span><br />
              <span style="font-size: 28px; font-weight: 700; color: #e63946; letter-spacing: 2px; font-family: monospace;">${trackingCode}</span>
            </div>
            <div style="margin-bottom: 8px;">
              <span style="color: #a0a0a0; font-size: 13px;">Dispositivo</span><br />
              <span style="font-size: 15px;">${device}</span>
            </div>
            <div>
              <span style="color: #a0a0a0; font-size: 13px;">Problema reportado</span><br />
              <span style="font-size: 15px;">${issue}</span>
            </div>
          </div>

          <p style="margin: 0 0 24px; font-size: 15px; line-height: 1.6;">
            Podés consultar el estado de tu reparación en cualquier momento usando el código de seguimiento.
          </p>

          <a href="${appUrl}/seguimiento/${trackingCode}" style="display: inline-block; background: #e63946; color: white; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 15px; margin-bottom: 32px;">
            Ver estado de la reparación
          </a>

          <hr style="border: none; border-top: 1px solid #1a1a2e; margin: 0 0 24px;" />

          <p style="margin: 0; font-size: 13px; color: #a0a0a0;">
            ${config.appName} — ${config.phone}<br />
            Este es un email automático. No respondas a este mensaje.
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Error enviando email de tracking:", error);
  }
}
