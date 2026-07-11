const VALID_TRANSITIONS: Record<string, { value: string; label: string }[]> = {
  RECEIVED: [{ value: "DIAGNOSING", label: "Iniciar diagnóstico" }],
  DIAGNOSING: [{ value: "BUDGETED", label: "Enviar presupuesto" }],
  BUDGETED: [
    { value: "APPROVED", label: "Aprobar" },
    { value: "REJECTED", label: "Rechazar" },
  ],
  APPROVED: [{ value: "REPAIRING", label: "Iniciar reparación" }],
  REPAIRING: [{ value: "REPAIRED", label: "Marcar como reparado" }],
  REPAIRED: [{ value: "DELIVERED", label: "Marcar como entregado" }],
};

interface StatusActionsProps {
  currentStatus: string;
  onStatusChange: (status: string) => void;
  loading: boolean;
}

export default function StatusActions({ currentStatus, onStatusChange, loading }: StatusActionsProps) {
  const transitions = VALID_TRANSITIONS[currentStatus] || [];

  if (transitions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {transitions.map((t) => (
        <button
          key={t.value}
          onClick={() => onStatusChange(t.value)}
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-[var(--accent)] text-white text-sm font-medium hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
