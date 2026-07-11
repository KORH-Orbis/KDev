interface Payment {
  id: string;
  amount: string | number;
  method: string;
  reference: string | null;
  notes: string | null;
  createdAt: string;
}

interface PaymentListProps {
  payments: Payment[];
  loading: boolean;
}

const methodLabels: Record<string, string> = {
  CASH: "Efectivo",
  TRANSFER: "Transferencia",
  CARD: "Tarjeta",
  OTHER: "Otro",
};

export default function PaymentList({ payments, loading }: PaymentListProps) {
  if (loading) {
    return (
      <div className="text-center py-6 text-[var(--text-secondary)] text-sm">
        Cargando pagos...
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="text-center py-6 text-[var(--text-secondary)] text-sm">
        No se han registrado pagos.
      </div>
    );
  }

  const total = payments.reduce((sum, p) => sum + Number(p.amount), 0);

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--bg-secondary)] text-[var(--text-secondary)]">
              <th className="text-left py-2 px-2 font-medium">Monto</th>
              <th className="text-left py-2 px-2 font-medium">Método</th>
              <th className="text-left py-2 px-2 font-medium hidden sm:table-cell">Ref.</th>
              <th className="text-right py-2 px-2 font-medium hidden md:table-cell">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id} className="border-b border-[var(--bg-secondary)]">
                <td className="py-2 px-2 text-[var(--text-primary)] font-medium">
                  ${Number(p.amount).toLocaleString("es-CO")}
                </td>
                <td className="py-2 px-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--bg)] text-[var(--text-secondary)]">
                    {methodLabels[p.method] || p.method}
                  </span>
                </td>
                <td className="py-2 px-2 text-[var(--text-secondary)] hidden sm:table-cell">
                  {p.reference || "—"}
                </td>
                <td className="py-2 px-2 text-right text-[var(--text-secondary)] hidden md:table-cell text-xs">
                  {new Date(p.createdAt).toLocaleDateString("es-CO")}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-[var(--bg-secondary)]">
              <td colSpan={4} className="py-3 px-2 text-right">
                <span className="text-sm font-semibold text-[var(--text-primary)]">
                  Total: ${total.toLocaleString("es-CO")}
                </span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
