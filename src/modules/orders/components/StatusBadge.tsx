const statusConfig: Record<string, { label: string; color: string }> = {
  RECEIVED: { label: "Recibido", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  DIAGNOSING: { label: "Diagnosticando", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  BUDGETED: { label: "Presupuestado", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
  APPROVED: { label: "Aprobado", color: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30" },
  REPAIRING: { label: "En reparación", color: "bg-orange-500/20 text-orange-400 border-orange-500/30" },
  REPAIRED: { label: "Reparado", color: "bg-green-500/20 text-green-400 border-green-500/30" },
  DELIVERED: { label: "Entregado", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  REJECTED: { label: "Rechazado", color: "bg-red-500/20 text-red-400 border-red-500/30" },
};

export function getStatusLabel(status: string) {
  return statusConfig[status]?.label || status;
}

export function getStatusColor(status: string) {
  return statusConfig[status]?.color || "bg-gray-500/20 text-gray-400 border-gray-500/30";
}

export default function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] || { label: status, color: "bg-gray-500/20 text-gray-400" };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${config.color}`}>
      {config.label}
    </span>
  );
}
