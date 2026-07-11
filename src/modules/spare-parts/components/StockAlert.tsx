export default function StockAlert({ stock, minStock }: { stock: number; minStock: number }) {
  const low = stock < minStock;
  if (!low) return <span className="text-[var(--text-primary)] font-medium">{stock}</span>;
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium">
      {stock} / {minStock}
    </span>
  );
}
