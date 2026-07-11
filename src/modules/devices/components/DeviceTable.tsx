import Link from "next/link";

interface Device {
  id: string;
  type: string;
  brand: string | null;
  model: string | null;
  serialNumber: string | null;
  imei: string | null;
  createdAt: string;
  client: { id: string; name: string };
  _count: { repairOrders: number };
}

interface DeviceTableProps {
  devices: Device[];
  loading: boolean;
}

export default function DeviceTable({ devices, loading }: DeviceTableProps) {
  if (loading) return <div className="text-center py-10 text-[var(--text-secondary)]">Cargando...</div>;
  if (devices.length === 0) return <div className="text-center py-10 text-[var(--text-secondary)]">No hay dispositivos registrados.</div>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--bg-secondary)] text-[var(--text-secondary)]">
            <th className="text-left py-3 px-4 font-medium">Tipo</th>
            <th className="text-left py-3 px-4 font-medium">Marca / Modelo</th>
            <th className="text-left py-3 px-4 font-medium hidden md:table-cell">Cliente</th>
            <th className="text-left py-3 px-4 font-medium hidden sm:table-cell">Serie</th>
            <th className="text-center py-3 px-4 font-medium">Órdenes</th>
            <th className="text-right py-3 px-4"></th>
          </tr>
        </thead>
        <tbody>
          {devices.map((d) => (
            <tr key={d.id} className="border-b border-[var(--bg-secondary)] hover:bg-[var(--bg-secondary)]/30 transition-colors">
              <td className="py-3 px-4 font-medium text-[var(--text-primary)]">{d.type}</td>
              <td className="py-3 px-4 text-[var(--text-secondary)]">{[d.brand, d.model].filter(Boolean).join(" — ") || "—"}</td>
              <td className="py-3 px-4 text-[var(--text-secondary)] hidden md:table-cell">{d.client.name}</td>
              <td className="py-3 px-4 text-[var(--text-secondary)] hidden sm:table-cell font-mono text-xs">{d.serialNumber || "—"}</td>
              <td className="py-3 px-4 text-center">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[var(--bg-secondary)] text-xs font-medium text-[var(--text-secondary)]">
                  {d._count.repairOrders}
                </span>
              </td>
              <td className="py-3 px-4 text-right">
                <Link href={`/admin/dispositivos/${d.id}`} className="text-[var(--accent)] hover:text-[var(--accent-hover)] text-sm font-medium">Ver</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
