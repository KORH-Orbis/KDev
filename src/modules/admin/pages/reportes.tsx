import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import Layout from "@/modules/core/components/Layout";
import { config } from "@/modules/core/lib/config";

const methodLabels: Record<string, string> = { CASH: "Efectivo", TRANSFER: "Transferencia", CARD: "Tarjeta", OTHER: "Otro" };

export default function ReportesPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [exportFrom, setExportFrom] = useState("");
  const [exportTo, setExportTo] = useState("");
  const [exportStatus, setExportStatus] = useState("");

  const fetchReport = async () => {
    setLoading(true); setError("");
    try {
      const res = await fetch(`/api/reports/monthly?year=${year}&month=${month}`);
      const json = await res.json();
      if (res.ok) setReport(json.data);
      else setError(json.error || "Error");
    } catch { setError("Error de conexión"); }
    setLoading(false);
  };

  useEffect(() => { fetchReport(); }, [year, month]);

  const handleExport = (type: string) => {
    const params = new URLSearchParams({ type });
    if (exportFrom) params.set("from", exportFrom);
    if (exportTo) params.set("to", exportTo);
    if (exportStatus) params.set("status", exportStatus);
    window.open(`/api/export/csv?${params.toString()}`, "_blank");
  };

  return (
    <>
      <Head><title>{`Reportes - ${config.appName}`}</title></Head>
      <Layout>
        <section className="py-10 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-8">Reportes</h1>

            <div className="flex flex-wrap items-center gap-4 mb-8">
              <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="px-4 py-3 rounded-lg bg-[var(--card-bg)] border border-[var(--bg-secondary)] text-[var(--text-primary)]">
                {[2025, 2026, 2027].map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
              <select value={month} onChange={(e) => setMonth(Number(e.target.value))} className="px-4 py-3 rounded-lg bg-[var(--card-bg)] border border-[var(--bg-secondary)] text-[var(--text-primary)]">
                {["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"].map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
              </select>
              {loading && <span className="text-[var(--text-secondary)] text-sm">Cargando...</span>}
              {error && <span className="text-red-400 text-sm">{error}</span>}
            </div>

            {report && (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
                  {[
                    { label: "Órdenes creadas", value: report.created, color: "text-blue-400" },
                    { label: "Entregadas", value: report.delivered, color: "text-green-400" },
                    { label: "Rechazadas", value: report.rejected, color: "text-red-400" },
                    { label: "Ingresos totales", value: `$${report.totalIncome.toLocaleString("es-CO")}`, color: "text-[var(--accent)]" },
                  ].map((s) => (
                    <div key={s.label} className="p-5 rounded-2xl bg-[var(--card-bg)] border border-[var(--bg-secondary)]">
                      <div className={`text-2xl font-bold ${s.color} mb-2`}>{s.value}</div>
                      <div className="text-xs text-[var(--text-secondary)]">{s.label}</div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                  <div className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--bg-secondary)]">
                    <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Ingresos por método</h2>
                    {Object.keys(report.incomeByMethod).length === 0 ? (
                      <p className="text-sm text-[var(--text-secondary)]">Sin ingresos este mes.</p>
                    ) : (
                      <table className="w-full text-sm">
                        <thead><tr className="border-b border-[var(--bg-secondary)] text-[var(--text-secondary)]"><th className="text-left py-2 font-medium">Método</th><th className="text-right py-2 font-medium">Total</th></tr></thead>
                        <tbody>
                          {Object.entries(report.incomeByMethod).map(([method, amount]: any) => (
                            <tr key={method} className="border-b border-[var(--bg-secondary)]"><td className="py-2">{methodLabels[method] || method}</td><td className="py-2 text-right">${amount.toLocaleString("es-CO")}</td></tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                  <div className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--bg-secondary)]">
                    <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Repuestos más usados</h2>
                    {report.topParts.length === 0 ? (
                      <p className="text-sm text-[var(--text-secondary)]">Sin datos este mes.</p>
                    ) : (
                      <table className="w-full text-sm">
                        <thead><tr className="border-b border-[var(--bg-secondary)] text-[var(--text-secondary)]"><th className="text-left py-2 font-medium">Repuesto</th><th className="text-right py-2 font-medium">Usos</th></tr></thead>
                        <tbody>
                          {report.topParts.map((p: any, i: number) => (
                            <tr key={i} className="border-b border-[var(--bg-secondary)]"><td className="py-2 text-[var(--text-primary)]">{p.name}</td><td className="py-2 text-right">{p.count}</td></tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </>
            )}

            <div className="p-8 rounded-2xl bg-[var(--card-bg)] border border-[var(--bg-secondary)]">
              <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-6">Exportar CSV</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <input type="date" value={exportFrom} onChange={(e) => setExportFrom(e.target.value)} className="px-4 py-2 rounded-lg bg-[var(--bg)] border border-[var(--bg-secondary)] text-[var(--text-primary)] text-sm" placeholder="Desde" />
                <input type="date" value={exportTo} onChange={(e) => setExportTo(e.target.value)} className="px-4 py-2 rounded-lg bg-[var(--bg)] border border-[var(--bg-secondary)] text-[var(--text-primary)] text-sm" placeholder="Hasta" />
                <select value={exportStatus} onChange={(e) => setExportStatus(e.target.value)} className="px-4 py-2 rounded-lg bg-[var(--bg)] border border-[var(--bg-secondary)] text-[var(--text-primary)] text-sm">
                  <option value="">Todos los estados</option>
                  {["RECEIVED","DIAGNOSING","BUDGETED","APPROVED","REPAIRING","REPAIRED","DELIVERED","REJECTED"].map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="flex gap-3">
                <button onClick={() => handleExport("orders")} className="px-5 py-3 rounded-lg bg-[var(--accent)] text-white font-medium hover:bg-[var(--accent-hover)] transition-colors text-sm">Exportar órdenes</button>
                <button onClick={() => handleExport("payments")} className="px-5 py-3 rounded-lg border border-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors text-sm font-medium">Exportar pagos</button>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}
