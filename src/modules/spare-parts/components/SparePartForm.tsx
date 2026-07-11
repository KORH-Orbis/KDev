import { useState, useMemo, FormEvent } from "react";

interface SparePartFormProps {
  initialData?: {
    name?: string; category?: string; brand?: string; model?: string;
    costPrice?: number; sellingPrice?: number | null; stock?: number; supplier?: string; notes?: string;
  };
  onSubmit: (data: { name: string; category: string; brand: string; model: string; costPrice: number; sellingPrice: number; stock: number; minStock: number; supplier: string; notes: string }) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

export default function SparePartForm({ initialData, onSubmit, onCancel, loading }: SparePartFormProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [category, setCategory] = useState(initialData?.category || "");
  const [brand, setBrand] = useState(initialData?.brand || "");
  const [model, setModel] = useState(initialData?.model || "");
  const [costPrice, setCostPrice] = useState(initialData?.costPrice?.toString() || "");
  const [stock, setStock] = useState(initialData?.stock?.toString() || "0");
  const [supplier, setSupplier] = useState(initialData?.supplier || "");
  const [notes, setNotes] = useState(initialData?.notes || "");

  const sellingPrice = useMemo(() => {
    const cost = Number(costPrice);
    return cost > 0 ? (cost * 1.5).toFixed(2) : "";
  }, [costPrice]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onSubmit({
      name,
      category,
      brand,
      model,
      costPrice: Number(costPrice),
      sellingPrice: Number(sellingPrice),
      stock: Number(stock),
      minStock: 1,
      supplier,
      notes,
    });
  };

  const inputClass = "w-full px-4 py-3 rounded-lg bg-[var(--bg)] border border-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-colors";
  const labelClass = "block text-sm font-medium text-[var(--text-primary)] mb-2";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>Nombre *</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className={inputClass} placeholder="Pantalla LCD iPhone 13" />
        </div>
        <div>
          <label className={labelClass}>Categoría</label>
          <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass} placeholder="Pantalla, batería, flex..." />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>Marca</label>
          <input type="text" value={brand} onChange={(e) => setBrand(e.target.value)} className={inputClass} placeholder="Original, genérica..." />
        </div>
        <div>
          <label className={labelClass}>Modelo compatible</label>
          <input type="text" value={model} onChange={(e) => setModel(e.target.value)} className={inputClass} placeholder="iPhone 13 / 13 Pro" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>Precio de compra *</label>
          <input type="number" value={costPrice} onChange={(e) => setCostPrice(e.target.value)} required min="0" step="0.01" className={inputClass} placeholder="0.00" />
        </div>
        <div>
          <label className={labelClass}>Precio de venta (auto)</label>
          <input type="text" value={`$${sellingPrice}`} readOnly className={inputClass + " cursor-default opacity-60"} />
        </div>
      </div>
      <div>
        <label className={labelClass}>Stock</label>
        <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} min="0" className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Proveedor</label>
        <input type="text" value={supplier} onChange={(e) => setSupplier(e.target.value)} className={inputClass} placeholder="Nombre del proveedor" />
      </div>
      <div>
        <label className={labelClass}>Notas</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className={inputClass + " resize-none"} placeholder="Detalles adicionales..." />
      </div>
      <div className="flex gap-3 justify-end pt-2">
        <button type="button" onClick={onCancel} className="px-5 py-3 rounded-lg border border-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors text-sm font-medium">Cancelar</button>
        <button type="submit" disabled={loading} className="px-5 py-3 rounded-lg bg-[var(--accent)] text-white font-medium hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50 text-sm">{loading ? "Guardando..." : "Guardar repuesto"}</button>
      </div>
    </form>
  );
}
