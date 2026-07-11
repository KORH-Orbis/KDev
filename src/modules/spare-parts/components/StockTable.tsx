import Link from "next/link";
import StockAlert from "./StockAlert";

interface SparePart {
  id: string; name: string; category: string | null; brand: string | null; model: string | null;
  costPrice: string | number; sellingPrice: string | number | null; stock: number; minStock: number; supplier: string | null;
}

interface StockTableProps { parts: SparePart[]; loading: boolean }

export default function StockTable({ parts, loading }: StockTableProps) {
  if (loading) return <div className="text-center py-10 text-[var(--text-secondary)]">Cargando...</div>;
  if (parts.length === 0) return <div className="text-center py-10 text-[var(--text-secondary)]">No hay repuestos registrados.</div>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--bg-secondary)] text-[var(--text-secondary)]">
            <th className="text-left py-3 px-4 font-medium">Nombre</th>
            <th className="text-left py-3 px-4 font-medium hidden md:table-cell">Categoría</th>
            <th className="text-right py-3 px-4 font-medium">Costo</th>
            <th className="text-right py-3 px-4 font-medium hidden sm:table-cell">Venta</th>
            <th className="text-center py-3 px-4 font-medium">Stock</th>
            <th className="text-right py-3 px-4"></th>
          </tr>
        </thead>
        <tbody>
          {parts.map((p) => (
            <tr key={p.id} className="border-b border-[var(--bg-secondary)] hover:bg-[var(--bg-secondary)]/30 transition-colors">
              <td className="py-3 px-4">
                <div className="font-medium text-[var(--text-primary)]">{p.name}</div>
                {p.brand && <div className="text-xs text-[var(--text-secondary)]">{p.brand}{p.model ? ` — ${p.model}` : ""}</div>}
              </td>
              <td className="py-3 px-4 text-[var(--text-secondary)] hidden md:table-cell">{p.category || "—"}</td>
              <td className="py-3 px-4 text-right text-[var(--text-secondary)]">${Number(p.costPrice).toLocaleString("es-CO")}</td>
              <td className="py-3 px-4 text-right text-[var(--text-secondary)] hidden sm:table-cell">{p.sellingPrice ? `$${Number(p.sellingPrice).toLocaleString("es-CO")}` : "—"}</td>
              <td className="py-3 px-4 text-center"><StockAlert stock={p.stock} minStock={p.minStock} /></td>
              <td className="py-3 px-4 text-right">
                <Link href={`/admin/repuestos/${p.id}`} className="text-[var(--accent)] hover:text-[var(--accent-hover)] text-sm font-medium">Ver</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
