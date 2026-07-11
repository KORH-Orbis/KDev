import { useState, useEffect } from "react";

interface SparePart {
  id: string; name: string; stock: number; sellingPrice: number | null; costPrice: number; brand: string | null;
}

interface SparePartSelectorProps {
  onAdd: (part: SparePart, quantity: number, unitPrice: number) => void;
  loading: boolean;
}

export default function SparePartSelector({ onAdd, loading }: SparePartSelectorProps) {
  const [parts, setParts] = useState<SparePart[]>([]);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState("");

  useEffect(() => {
    fetch("/api/spare-parts")
      .then((r) => r.json())
      .then((j) => setParts(j.data || []));
  }, []);

  const selected = parts.find((p) => p.id === selectedId);

  const handleAdd = () => {
    if (!selected) return;
    onAdd(selected, quantity, Number(unitPrice) || Number(selected.sellingPrice) || Number(selected.costPrice));
    setSelectedId(""); setQuantity(1); setUnitPrice("");
  };

  const filtered = search
    ? parts.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || (p.brand || "").toLowerCase().includes(search.toLowerCase()))
    : parts;

  return (
    <div className="p-4 rounded-xl bg-[var(--bg)] border border-[var(--bg-secondary)] space-y-3">
      <div className="flex gap-3">
        <div className="flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setSelectedId(""); }}
            placeholder="Buscar repuesto..."
            className="w-full px-3 py-2 rounded-lg bg-[var(--bg)] border border-[var(--bg-secondary)] text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          />
        </div>
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="px-3 py-2 rounded-lg bg-[var(--bg)] border border-[var(--bg-secondary)] text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] max-w-[200px]"
        >
          <option value="">Seleccionar</option>
          {filtered.map((p) => (
            <option key={p.id} value={p.id}>{p.name} ({p.stock})</option>
          ))}
        </select>
      </div>

      {selected && (
        <div className="flex items-center gap-3">
          <div className="text-xs text-[var(--text-secondary)]">Cantidad:</div>
          <input type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} min={1} max={selected.stock}
            className="w-20 px-3 py-2 rounded-lg bg-[var(--bg)] border border-[var(--bg-secondary)] text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]" />
          <div className="text-xs text-[var(--text-secondary)]">Precio:</div>
          <input type="number" value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)} min="0" step="0.01"
            placeholder={String(selected.sellingPrice || selected.costPrice)}
            className="w-24 px-3 py-2 rounded-lg bg-[var(--bg)] border border-[var(--bg-secondary)] text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]" />
          <button onClick={handleAdd} disabled={loading}
            className="px-3 py-2 rounded-lg bg-[var(--accent)] text-white text-sm font-medium hover:bg-[var(--accent-hover)] disabled:opacity-50">
            {loading ? "..." : "Agregar"}
          </button>
        </div>
      )}
    </div>
  );
}
