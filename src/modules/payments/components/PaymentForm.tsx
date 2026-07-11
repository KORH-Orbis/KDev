import { useState, FormEvent } from "react";

interface PaymentFormProps {
  onSubmit: (data: {
    amount: number;
    method: string;
    reference: string;
    notes: string;
  }) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
  maxAmount?: number;
}

const methods = [
  { value: "CASH", label: "Efectivo" },
  { value: "TRANSFER", label: "Transferencia" },
  { value: "CARD", label: "Tarjeta" },
  { value: "OTHER", label: "Otro" },
];

export default function PaymentForm({ onSubmit, onCancel, loading, maxAmount }: PaymentFormProps) {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("CASH");
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onSubmit({
      amount: Number(amount),
      method,
      reference,
      notes,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
          Monto *
        </label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          min="0"
          max={maxAmount}
          step="0.01"
          className="w-full px-4 py-3 rounded-lg bg-[var(--bg)] border border-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-colors"
          placeholder="0.00"
        />
      </div>

      <div>
        <label htmlFor="method" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
          Método de pago *
        </label>
        <select
          id="method"
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-[var(--bg)] border border-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-colors"
        >
          {methods.map((m) => (
            <option key={m.value} value={m.value}>{m.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="reference" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
          Referencia
        </label>
        <input
          type="text"
          id="reference"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-[var(--bg)] border border-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-colors"
          placeholder="N° de transferencia, factura..."
        />
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
          Notas
        </label>
        <input
          type="text"
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-[var(--bg)] border border-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-colors"
          placeholder="Abono, pago parcial..."
        />
      </div>

      <div className="flex gap-3 justify-end pt-2">
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
          {loading ? "Registrando..." : "Registrar pago"}
        </button>
      </div>
    </form>
  );
}
