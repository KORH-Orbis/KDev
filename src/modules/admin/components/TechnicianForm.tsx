import { useState, FormEvent } from "react";

interface TechnicianFormProps {
  initialData?: { name?: string; email?: string; role?: string };
  onSubmit: (data: { name: string; email: string; password?: string; role: string }) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
  isEditing?: boolean;
}

export default function TechnicianForm({ initialData, onSubmit, onCancel, loading, isEditing }: TechnicianFormProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [email, setEmail] = useState(initialData?.email || "");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(initialData?.role || "TECHNICIAN");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onSubmit({ name, email, password: password || undefined, role });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Nombre *</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-4 py-3 rounded-lg bg-[var(--bg)] border border-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-colors" placeholder="Nombre completo" />
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Email *</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-3 rounded-lg bg-[var(--bg)] border border-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-colors" placeholder="email@ejemplo.com" />
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">{isEditing ? "Nueva contraseña (dejar vacío para mantener)" : "Contraseña *"}</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required={!isEditing} className="w-full px-4 py-3 rounded-lg bg-[var(--bg)] border border-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-colors" placeholder="••••••••" />
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Rol</label>
        <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-[var(--bg)] border border-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-colors">
          <option value="ADMIN">Administrador</option>
          <option value="TECHNICIAN">Técnico</option>
        </select>
      </div>
      <div className="flex gap-3 justify-end pt-2">
        <button type="button" onClick={onCancel} className="px-5 py-3 rounded-lg border border-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors text-sm font-medium">Cancelar</button>
        <button type="submit" disabled={loading} className="px-5 py-3 rounded-lg bg-[var(--accent)] text-white font-medium hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50 text-sm">{loading ? "Guardando..." : isEditing ? "Actualizar" : "Crear técnico"}</button>
      </div>
    </form>
  );
}
