import { useState, FormEvent } from "react";

interface BudgetFormProps {
  onSubmit: (amount: number, note: string) => void;
  onCancel: () => void;
  loading: boolean;
  currentAmount?: number | null;
  currentNote?: string | null;
}

export default function BudgetForm({ onSubmit, onCancel, loading, currentAmount, currentNote }: BudgetFormProps) {
  const [amount, setAmount] = useState(currentAmount ? String(currentAmount) : "");
  const [note, setNote] = useState(currentNote || "");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(Number(amount), note);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
          Monto del presupuesto *
        </label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          min="0"
          step="0.01"
          className="w-full px-4 py-3 rounded-lg bg-[var(--bg)] border border-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-colors"
          placeholder="0.00"
        />
      </div>
      <div>
        <label htmlFor="note" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
          Nota del presupuesto
        </label>
        <textarea
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          className="w-full px-4 py-3 rounded-lg bg-[var(--bg)] border border-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-colors resize-none"
          placeholder="Detalle del presupuesto, repuestos necesarios..."
        />
      </div>
      <div className="flex gap-3 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg border border-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors text-sm"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-[var(--accent)] text-white text-sm font-medium hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50"
        >
          {loading ? "Guardando..." : "Guardar presupuesto"}
        </button>
      </div>
    </form>
  );
}
