interface PaymentSummaryProps {
  budgetAmount: number | null;
  totalPaid: number;
}

export default function PaymentSummary({ budgetAmount, totalPaid }: PaymentSummaryProps) {
  const budget = budgetAmount || 0;
  const pending = Math.max(0, budget - totalPaid);
  const pct = budget > 0 ? Math.min(100, (totalPaid / budget) * 100) : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-xs text-[var(--text-secondary)] mb-1">Presupuesto</div>
          <div className="text-2xl font-bold text-[var(--text-primary)]">
            ${budget.toLocaleString("es-CO")}
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-[var(--text-secondary)] mb-1">Pagado</div>
          <div className="text-2xl font-bold text-green-400">
            ${totalPaid.toLocaleString("es-CO")}
          </div>
        </div>
      </div>

      <div className="h-3 bg-[var(--bg)] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${
            pending === 0 ? "bg-green-500" : "bg-[var(--accent)]"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="flex justify-between text-sm">
        <span className="text-[var(--text-secondary)]">
          {pending > 0
            ? `Falta: $${pending.toLocaleString("es-CO")}`
            : totalPaid > budget
            ? `Excedente: $${(totalPaid - budget).toLocaleString("es-CO")}`
            : "Pagado completo"}
        </span>
        <span className="text-[var(--text-secondary)]">{Math.round(pct)}%</span>
      </div>
    </div>
  );
}
