import Link from "next/link";
import StatusBadge from "@/modules/orders/components/StatusBadge";

interface RepairOrder {
  id: string;
  trackingCode: string;
  status: string;
  issue: string;
  deviceType: string;
  budgetAmount: string | null;
  createdAt: string;
}

interface DeviceHistoryProps {
  orders: RepairOrder[];
}

export default function DeviceHistory({ orders }: DeviceHistoryProps) {
  if (orders.length === 0) {
    return <p className="text-sm text-[var(--text-secondary)]">No hay reparaciones registradas para este dispositivo.</p>;
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <Link
          key={order.id}
          href={`/admin/reparaciones/${order.id}`}
          className="block p-4 rounded-xl border border-[var(--bg-secondary)] hover:border-[var(--accent)] transition-colors"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-sm text-[var(--accent)]">{order.trackingCode}</span>
            <StatusBadge status={order.status} />
          </div>
          <p className="text-sm text-[var(--text-secondary)] mb-2 line-clamp-2">{order.issue}</p>
          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
            <span>{new Date(order.createdAt).toLocaleDateString("es-CO")}</span>
            {order.budgetAmount && (
              <span>${Number(order.budgetAmount).toLocaleString("es-CO")}</span>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
