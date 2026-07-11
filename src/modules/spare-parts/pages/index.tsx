import { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import Link from "next/link";
import Layout from "@/modules/core/components/Layout";
import StockTable from "@/modules/spare-parts/components/StockTable";
import { config } from "@/modules/core/lib/config";

export default function SparePartsListPage() {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [lowStockCount, setLowStockCount] = useState(0);

  const fetchParts = useCallback(async (searchTerm?: string) => {
    setLoading(true);
    try {
      const params = searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : "";
      const res = await fetch(`/api/spare-parts${params}`);
      const json = await res.json();
      const data = json.data || [];
      setParts(data);
      setLowStockCount(data.filter((p: any) => p.stock < p.minStock).length);
    } catch (e) { console.error(e); }
    setLoading(false);
  }, []);

  useEffect(() => { fetchParts(); }, [fetchParts]);

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); fetchParts(search); };

  return (
    <>
      <Head><title>{`Repuestos - ${config.appName}`}</title></Head>
      <Layout>
        <section className="py-10 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Repuestos</h1>
                <p className="text-[var(--text-secondary)]">{parts.length} repuesto{parts.length !== 1 ? "s" : ""}{lowStockCount > 0 && ` — ${lowStockCount} con stock bajo`}</p>
              </div>
              <Link href="/admin/repuestos/nuevo" className="inline-flex items-center px-5 py-3 rounded-lg bg-[var(--accent)] text-white font-medium hover:bg-[var(--accent-hover)] transition-colors text-sm">+ Nuevo repuesto</Link>
            </div>
            {lowStockCount > 0 && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
                {lowStockCount} repuesto{lowStockCount !== 1 ? "s" : ""} con stock bajo el mínimo.
              </div>
            )}
            <div className="mb-6">
              <form onSubmit={handleSearch} className="flex gap-3">
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por nombre, categoría, marca..." className="flex-1 px-4 py-3 rounded-lg bg-[var(--bg)] border border-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-colors text-sm" />
                <button type="submit" className="px-5 py-3 rounded-lg border border-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors text-sm font-medium">Buscar</button>
              </form>
            </div>
            <div className="rounded-2xl bg-[var(--card-bg)] border border-[var(--bg-secondary)]">
              <StockTable parts={parts} loading={loading} />
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}
