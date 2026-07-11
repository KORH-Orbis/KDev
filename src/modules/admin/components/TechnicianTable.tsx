interface Technician {
  id: number; name: string; email: string; role: string; createdAt: string;
}

interface TechnicianTableProps { technicians: Technician[]; loading: boolean; onEdit?: (t: Technician) => void; onDelete?: (t: Technician) => void }

const roleLabels: Record<string, string> = { ADMIN: "Admin", TECHNICIAN: "Técnico" };

export default function TechnicianTable({ technicians, loading, onEdit, onDelete }: TechnicianTableProps) {
  if (loading) return <div className="text-center py-10 text-[var(--text-secondary)]">Cargando...</div>;
  if (technicians.length === 0) return <div className="text-center py-10 text-[var(--text-secondary)]">No hay técnicos registrados.</div>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--bg-secondary)] text-[var(--text-secondary)]">
            <th className="text-left py-3 px-4 font-medium">Nombre</th>
            <th className="text-left py-3 px-4 font-medium hidden sm:table-cell">Email</th>
            <th className="text-center py-3 px-4 font-medium">Rol</th>
            <th className="text-right py-3 px-4 font-medium hidden md:table-cell">Creado</th>
            <th className="text-right py-3 px-4"></th>
          </tr>
        </thead>
        <tbody>
          {technicians.map((t) => (
            <tr key={t.id} className="border-b border-[var(--bg-secondary)] hover:bg-[var(--bg-secondary)]/30 transition-colors">
              <td className="py-3 px-4 font-medium text-[var(--text-primary)]">{t.name}</td>
              <td className="py-3 px-4 text-[var(--text-secondary)] hidden sm:table-cell">{t.email}</td>
              <td className="py-3 px-4 text-center">
                <span className={`px-2 py-0.5 rounded-full text-xs ${t.role === "ADMIN" ? "bg-purple-500/20 text-purple-400 border border-purple-500/30" : "bg-blue-500/20 text-blue-400 border border-blue-500/30"}`}>
                  {roleLabels[t.role] || t.role}
                </span>
              </td>
              <td className="py-3 px-4 text-right text-[var(--text-secondary)] hidden md:table-cell text-xs">{new Date(t.createdAt).toLocaleDateString("es-CO")}</td>
              <td className="py-3 px-4 text-right flex justify-end gap-2">
                {onEdit && <button onClick={() => onEdit(t)} className="text-[var(--accent)] hover:text-[var(--accent-hover)] text-xs font-medium">Editar</button>}
                {onDelete && <button onClick={() => onDelete(t)} className="text-red-400 hover:text-red-300 text-xs font-medium">Eliminar</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
