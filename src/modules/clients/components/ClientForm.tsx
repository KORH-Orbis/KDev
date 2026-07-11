import { useState, FormEvent } from "react";

interface ClientData {
  id?: string;
  name: string;
  email: string;
  phone: string;
}

interface ClientFormProps {
  initialData?: ClientData;
  onSubmit: (data: { name: string; email: string; phone: string }) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

export default function ClientForm({ initialData, onSubmit, onCancel, loading }: ClientFormProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [email, setEmail] = useState(initialData?.email || "");
  const [phone, setPhone] = useState(initialData?.phone || "");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onSubmit({ name, email: email || undefined as any, phone: phone || undefined as any });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
          Nombre *
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-lg bg-[var(--bg)] border border-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-colors"
          placeholder="Nombre del cliente"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-[var(--bg)] border border-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-colors"
            placeholder="email@ejemplo.com"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
            Teléfono
          </label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-[var(--bg)] border border-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-colors"
            placeholder="311 123 4567"
          />
        </div>
      </div>

      <div className="flex gap-3 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 rounded-lg border border-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors text-sm font-medium"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 rounded-lg bg-[var(--accent)] text-white font-medium hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          {loading ? "Guardando..." : initialData?.id ? "Actualizar" : "Crear cliente"}
        </button>
      </div>
    </form>
  );
}
