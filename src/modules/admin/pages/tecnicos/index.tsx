import { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import Link from "next/link";
import Layout from "@/modules/core/components/Layout";
import TechnicianTable from "@/modules/admin/components/TechnicianTable";
import TechnicianForm from "@/modules/admin/components/TechnicianForm";
import { config } from "@/modules/core/lib/config";

export default function TecnicosListPage() {
  const [techs, setTechs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchTechs = useCallback(() => {
    setLoading(true);
    fetch("/api/admin/technicians")
      .then((r) => r.json())
      .then((j) => { setTechs(j.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => { fetchTechs(); }, [fetchTechs]);

  const handleEdit = async (data: any) => {
    setSaving(true); setError("");
    try {
      const res = await fetch("/api/admin/technicians", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editing.id, ...data }),
      });
      if (res.ok) { setEditing(null); fetchTechs(); }
      else { const j = await res.json(); setError(j.error || "Error"); }
    } catch { setError("Error de conexión"); }
    setSaving(false);
  };

  const handleDelete = async (tech: any) => {
    if (!confirm(`¿Eliminar a ${tech.name}?`)) return;
    try { await fetch(`/api/admin/technicians?id=${tech.id}`, { method: "DELETE" }); fetchTechs(); }
    catch { setError("Error al eliminar"); }
  };

  return (
    <>
      <Head><title>{`Técnicos - ${config.appName}`}</title></Head>
      <Layout>
        <section className="py-10 sm:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div><h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Técnicos</h1><p className="text-[var(--text-secondary)]">{techs.length} usuario{techs.length !== 1 ? "s" : ""}</p></div>
              <Link href="/admin/tecnicos/nuevo" className="px-5 py-3 rounded-lg bg-[var(--accent)] text-white font-medium hover:bg-[var(--accent-hover)] transition-colors text-sm">+ Nuevo técnico</Link>
            </div>
            {error && <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>}
            <div className="rounded-2xl bg-[var(--card-bg)] border border-[var(--bg-secondary)]"><TechnicianTable technicians={techs} loading={loading} onEdit={setEditing} onDelete={handleDelete} /></div>
            {editing && (
              <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setEditing(null)}>
                <div className="bg-[var(--card-bg)] rounded-2xl p-8 max-w-md w-full border border-[var(--bg-secondary)]" onClick={(e) => e.stopPropagation()}>
                  <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-6">Editar {editing.name}</h2>
                  <TechnicianForm
                    initialData={{ name: editing.name, email: editing.email, role: editing.role }}
                    onSubmit={handleEdit}
                    onCancel={() => setEditing(null)}
                    loading={saving}
                    isEditing
                  />
                </div>
              </div>
            )}
          </div>
        </section>
      </Layout>
    </>
  );
}
