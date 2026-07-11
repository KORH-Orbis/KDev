import type { NextApiRequest, NextApiResponse } from "next";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface ContactBody {
  nombre: string;
  email: string;
  telefono?: string;
  servicio?: string;
  mensaje: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido", code: "METHOD_NOT_ALLOWED" });
  }

  const { nombre, email, telefono, servicio, mensaje } = req.body as ContactBody;

  if (!nombre || !email || !mensaje) {
    return res.status(400).json({ error: "Nombre, email y mensaje son requeridos", code: "VALIDATION_ERROR" });
  }

  if (!process.env.RESEND_API_KEY) {
    console.log("Contacto recibido (Resend no configurado):", { nombre, email, telefono, servicio, mensaje });
    return res.status(200).json({ data: { success: true, message: "Mensaje recibido (modo desarrollo)" } });
  }

  try {
    await resend.emails.send({
      from: `${process.env.CONTACT_FROM_NAME || "KDev"} <${process.env.CONTACT_FROM_EMAIL || "onboarding@resend.dev"}>`,
      to: process.env.CONTACT_TO_EMAIL || process.env.RESEND_AUDIENCE_ID || "rodr.kevin99@gmail.com",
      subject: `Nuevo contacto de ${nombre} - ${servicio || "Sin servicio especificado"}`,
      html: `
        <h2>Nuevo mensaje de contacto</h2>
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Teléfono:</strong> ${telefono || "No especificado"}</p>
        <p><strong>Servicio:</strong> ${servicio || "No especificado"}</p>
        <hr />
        <p><strong>Mensaje:</strong></p>
        <p>${mensaje}</p>
      `,
    });

    return res.status(200).json({ data: { success: true, message: "Mensaje enviado correctamente" } });
  } catch (error) {
    console.error("Error enviando email:", error);
    return res.status(500).json({ error: "Error al enviar el mensaje", code: "EMAIL_ERROR" });
  }
}
