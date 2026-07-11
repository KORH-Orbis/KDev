import Link from "next/link";
import StatusBadge from "./StatusBadge";
import { config } from "@/modules/core/lib/config";

interface Order {
  id: string;
  trackingCode: string;
  status: string;
  deviceType: string;
  deviceBrand: string | null;
  deviceModel: string | null;
  budgetAmount: string | number | null;
  createdAt: string;
  client: { id: string; name: string; phone: string | null };
  technician: { id: number; name: string } | null;
}

interface OrderTableProps {
  orders: Order[];
  loading: boolean;
}

export default function OrderTable({ orders, loading }: OrderTableProps) {
  if (loading) {
    return (
      <div className="text-center py-10 text-[var(--text-secondary)]">
        Cargando órdenes...
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-10 text-[var(--text-secondary)]">
        No hay órdenes registradas aún.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--bg-secondary)] text-[var(--text-secondary)]">
            <th className="text-left py-3 px-4 font-medium">Código</th>
            <th className="text-left py-3 px-4 font-medium">Cliente</th>
            <th className="text-left py-3 px-4 font-medium hidden md:table-cell">Dispositivo</th>
            <th className="text-center py-3 px-4 font-medium">Estado</th>
            <th className="text-right py-3 px-4 font-medium hidden sm:table-cell">Presupuesto</th>
            <th className="text-right py-3 px-4 font-medium"></th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr
              key={order.id}
              className="border-b border-[var(--bg-secondary)] hover:bg-[var(--bg-secondary)]/30 transition-colors"
            >
              <td className="py-3 px-4">
                <span className="font-mono text-sm text-[var(--accent)]">{order.trackingCode}</span>
                <div className="text-xs text-[var(--text-secondary)] mt-0.5">
                  {new Date(order.createdAt).toLocaleDateString("es-CO")}
                </div>
              </td>
              <td className="py-3 px-4">
                <div className="font-medium text-[var(--text-primary)]">{order.client.name}</div>
                {order.client.phone && (
                  <div className="text-xs text-[var(--text-secondary)]">{order.client.phone}</div>
                )}
              </td>
              <td className="py-3 px-4 text-[var(--text-secondary)] hidden md:table-cell">
                {[order.deviceType, order.deviceBrand, order.deviceModel].filter(Boolean).join(" - ")}
              </td>
              <td className="py-3 px-4 text-center">
                <StatusBadge status={order.status} />
              </td>
              <td className="py-3 px-4 text-right text-[var(--text-secondary)] hidden sm:table-cell">
                {order.budgetAmount
                  ? `$${Number(order.budgetAmount).toLocaleString("es-CO")}`
                  : "—"}
              </td>
              <td className="py-3 px-4 text-right">
                <Link
                  href={`/admin/reparaciones/${order.id}`}
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
