import Link from "next/link";
import { config } from "@/modules/core/lib/config";

interface Client {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  createdAt: string;
  _count: { repairOrders: number };
}

interface ClientTableProps {
  clients: Client[];
  loading: boolean;
}

export default function ClientTable({ clients, loading }: ClientTableProps) {
  if (loading) {
    return (
      <div className="text-center py-10 text-[var(--text-secondary)]">
        Cargando clientes...
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <div className="text-center py-10 text-[var(--text-secondary)]">
        No hay clientes registrados aún.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--bg-secondary)] text-[var(--text-secondary)]">
            <th className="text-left py-3 px-4 font-medium">Nombre</th>
            <th className="text-left py-3 px-4 font-medium hidden sm:table-cell">Email</th>
            <th className="text-left py-3 px-4 font-medium hidden md:table-cell">Teléfono</th>
            <th className="text-center py-3 px-4 font-medium">Órdenes</th>
            <th className="text-right py-3 px-4 font-medium"></th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr
              key={client.id}
              className="border-b border-[var(--bg-secondary)] hover:bg-[var(--bg-secondary)]/30 transition-colors"
            >
              <td className="py-3 px-4">
                <div className="font-medium text-[var(--text-primary)]">{client.name}</div>
              </td>
              <td className="py-3 px-4 text-[var(--text-secondary)] hidden sm:table-cell">
                {client.email || "—"}
              </td>
              <td className="py-3 px-4 text-[var(--text-secondary)] hidden md:table-cell">
                {client.phone || "—"}
              </td>
              <td className="py-3 px-4 text-center">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[var(--bg-secondary)] text-xs font-medium text-[var(--text-secondary)]">
                  {client._count.repairOrders}
                </span>
              </td>
              <td className="py-3 px-4 text-right">
                <Link
                  href={`/admin/clientes/${client.id}`}
                  className="text-[var(--accent)] hover:text-[var(--accent-hover)] text-sm font-medium transition-colors"
                >
                  Ver
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
