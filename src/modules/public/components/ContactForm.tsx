import { useState, FormEvent } from "react";

interface FormData {
  nombre: string;
  email: string;
  telefono: string;
  servicio: string;
  mensaje: string;
}

const initialForm: FormData = {
  nombre: "",
  email: "",
  telefono: "",
  servicio: "",
  mensaje: "",
};

const servicios = [
  "Reparación de PC",
  "Reparación de portátil",
  "Reparación de teléfono",
  "Desarrollo web",
  "Otro",
];

export default function ContactForm() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setForm(initialForm);
      } else {
        setStatus("error");
        setErrorMessage(data.error || "Error al enviar el mensaje");
      }
    } catch {
      setStatus("error");
      setErrorMessage("Error de conexión. Intenta de nuevo más tarde.");
    }
  };

  if (status === "success") {
    return (
      <div className="text-center py-12">
        <div className="text-[var(--success)] mb-4">
          <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Mensaje enviado</h3>
        <p className="text-[var(--text-secondary)]">Te responderemos lo antes posible. Gracias por contactarnos.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
            Nombre *
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg bg-[var(--bg)] border border-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-colors"
            placeholder="Tu nombre"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg bg-[var(--bg)] border border-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-colors"
            placeholder="tu@email.com"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="telefono" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
            Teléfono
          </label>
          <input
            type="tel"
            id="telefono"
            name="telefono"
            value={form.telefono}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-[var(--bg)] border border-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-colors"
            placeholder="311 123 4567"
          />
        </div>
        <div>
          <label htmlFor="servicio" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
            Servicio *
          </label>
          <select
            id="servicio"
            name="servicio"
            value={form.servicio}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg bg-[var(--bg)] border border-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-colors"
          >
            <option value="">Selecciona un servicio</option>
            {servicios.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="mensaje" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
          Mensaje *
        </label>
        <textarea
          id="mensaje"
          name="mensaje"
          value={form.mensaje}
          onChange={handleChange}
          required
          rows={5}
          className="w-full px-4 py-3 rounded-lg bg-[var(--bg)] border border-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-colors resize-none"
          placeholder="Describe tu problema o consulta..."
        />
      </div>

      {status === "error" && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full sm:w-auto px-8 py-3 rounded-lg bg-[var(--accent)] text-white font-semibold hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "sending" ? "Enviando..." : "Enviar mensaje"}
      </button>
    </form>
  );
}
