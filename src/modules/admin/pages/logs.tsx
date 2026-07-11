import { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import Layout from "@/modules/core/components/Layout";

const actionLabels: Record<string, string> = {
  CREATE_ORDER: "Creó orden", UPDATE_STATUS: "Cambió estado", CREATE_PAYMENT: "Registró pago",
  CREATE_CLIENT: "Creó cliente", UPDATE_CLIENT: "Editó cliente", DELETE_CLIENT: "Eliminó cliente",
  CREATE_DEVICE: "Creó dispositivo", UPDATE_DEVICE: "Editó dispositivo", DELETE_DEVICE: "Eliminó dispositivo",
  CREATE_PART: "Creó repuesto", UPDATE_PART: "Editó repuesto", DELETE_PART: "Eliminó repuesto",
  CREATE_TECHNICIAN: "Creó técnico", UPDATE_TECHNICIAN: "Editó técnico", DELETE_TECHNICIAN: "Eliminó técnico",
  CREATE_PHOTO: "Subió foto", UPDATE_CONFIG: "Editó configuración",
};

const entityLabels: Record<string, string> = {
  RepairOrder: "Órdenes", Payment: "Pagos", Client: "Clientes", Device: "Dispositivos",
  SparePart: "Repuestos", User: "Técnicos", Photo: "Fotos", AppConfig: "Configuración",
};

export default function LogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>({ total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [action, setAction] = useState("");
  const [entity, setEntity] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);

  const fetchLogs = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "50" });
    if (action) params.set("action", action);
    if (entity) params.set("entity", entity);
    if (from) params.set("from", from);
    if (to) params.set("to", to);

    fetch(`/api/admin/logs?${params}`)
      .then((r) => r.json())
      .then((j) => { setLogs(j.data || []); setMeta(j.meta || { total: 0, page: 1, totalPages: 1 }); setLoading(false); })
      .catch(() => setLoading(false));
  }, [page, action, entity, from, to]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  return (
    <>
      <Head><title>Logs de auditoría - KDev</title></Head>
      <Layout>
        <section className="py-10 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-8">Logs de auditoría</h1>
            <div className="flex flex-wrap gap-3 mb-6">
              <select value={action} onChange={(e) => { setAction(e.target.value); setPage(1); }} className="px-4 py-3 rounded-lg bg-[var(--card-bg)] border border-[var(--bg-secondary)] text-[var(--text-primary)] text-sm">
                <option value="">Todas las acciones</option>
                {Object.entries(actionLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
              <select value={entity} onChange={(e) => { setEntity(e.target.value); setPage(1); }} className="px-4 py-3 rounded-lg bg-[var(--card-bg)] border border-[var(--bg-secondary)] text-[var(--text-primary)] text-sm">
                <option value="">Todas las entidades</option>
                {Object.entries(entityLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
              <input type="date" value={from} onChange={(e) => { setFrom(e.target.value); setPage(1); }} className="px-4 py-3 rounded-lg bg-[var(--card-bg)] border border-[var(--bg-secondary)] text-[var(--text-primary)] text-sm" />
              <input type="date" value={to} onChange={(e) => { setTo(e.target.value); setPage(1); }} className="px-4 py-3 rounded-lg bg-[var(--card-bg)] border border-[var(--bg-secondary)] text-[var(--text-primary)] text-sm" />
            </div>
            <div className="rounded-2xl bg-[var(--card-bg)] border border-[var(--bg-secondary)]">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-[var(--bg-secondary)] text-[var(--text-secondary)]"><th className="text-left py-3 px-4 font-medium">Fecha</th><th className="text-left py-3 px-4 font-medium">Usuario</th><th className="text-left py-3 px-4 font-medium">Acción</th><th className="text-left py-3 px-4 font-medium hidden md:table-cell">Entidad</th><th className="text-left py-3 px-4 font-medium hidden lg:table-cell">Detalle</th></tr></thead>
                  <tbody>
                    {loading ? <tr><td colSpan={5} className="text-center py-10 text-[var(--text-secondary)]">Cargando...</td></tr>
                    : logs.length === 0 ? <tr><td colSpan={5} className="text-center py-10 text-[var(--text-secondary)]">No hay registros.</td></tr>
                    : logs.map((l) => (
                      <tr key={l.id} className="border-b border-[var(--bg-secondary)] hover:bg-[var(--bg-secondary)]/30 transition-colors">
                        <td className="py-3 px-4 text-xs text-[var(--text-secondary)]">{new Date(l.createdAt).toLocaleString("es-CO")}</td>
                        <td className="py-3 px-4 text-[var(--text-primary)]">{l.user?.name || "Sistema"}</td>
                        <td className="py-3 px-4 text-[var(--text-primary)]">{actionLabels[l.action] || l.action}</td>
                        <td className="py-3 px-4 text-[var(--text-secondary)] hidden md:table-cell">{entityLabels[l.entity] || l.entity}</td>
                        <td className="py-3 px-4 text-xs text-[var(--text-secondary)] hidden lg:table-cell max-w-[200px] truncate">{l.details || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {meta.totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-4 border-t border-[var(--bg-secondary)] text-sm">
                  <span className="text-[var(--text-secondary)]">{meta.total} registros</span>
                  <div className="flex gap-2">
                    <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="px-3 py-1 rounded border border-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--accent)] disabled:opacity-30">←</button>
                    <span className="px-3 py-1 text-[var(--text-primary)]">{meta.page} / {meta.totalPages}</span>
                    <button disabled={page >= meta.totalPages} onClick={() => setPage(page + 1)} className="px-3 py-1 rounded border border-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--accent)] disabled:opacity-30">→</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}
