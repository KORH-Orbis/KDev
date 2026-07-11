import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import Layout from "@/modules/core/components/Layout";
import SparePartForm from "@/modules/spare-parts/components/SparePartForm";
import { config } from "@/modules/core/lib/config";

interface SparePartData {
  id: string; name: string; category: string | null; brand: string | null; model: string | null;
  costPrice: string | number; sellingPrice: string | number | null; stock: number; supplier: string | null; notes: string | null; createdAt: string;
  orderParts: { id: string; quantity: number; unitPrice: string | number; createdAt: string; repairOrder: { id: string; trackingCode: string } }[];
}

export default function SparePartDetailPage() {
  const router = useRouter(); const { id } = router.query;
  const [part, setPart] = useState<SparePartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const fetchPart = () => { if (!id) return; setLoading(true);
    fetch(`/api/spare-parts/${id}`).then(r => r.json()).then(j => { if (j.data) setPart(j.data); setLoading(false); }).catch(() => setLoading(false)); };
  useEffect(() => { fetchPart(); }, [id]);

  const handleUpdate = async (data: any) => {
    setSaving(true); setError("");
    try { const res = await fetch(`/api/spare-parts/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }); const json = await res.json();
      if (res.ok) { setPart(json.data); setEditing(false); } else setError(json.error || "Error"); } catch { setError("Error de conexión"); }
    setSaving(false);
  };

  const handleDelete = async () => { if (!confirm("¿Eliminar repuesto?")) return; setDeleting(true);
    try { await fetch(`/api/spare-parts/${id}`, { method: "DELETE" }); router.push("/admin/repuestos"); } catch { setError("Error"); } setDeleting(false); };

  if (loading) return <Layout><div className="py-20 text-center text-[var(--text-secondary)]">Cargando...</div></Layout>;
  if (!part) return <Layout><div className="py-20 text-center"><h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">No encontrado</h2><Link href="/admin/repuestos" className="text-[var(--accent)] hover:underline">Volver</Link></div></Layout>;

  return (
    <>
      <Head><title>{`${part.name} - ${config.appName}`}</title></Head>
      <Layout>
        <section className="py-10 sm:py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-8">
              <Link href="/admin/repuestos" className="text-[var(--text-secondary)] hover:text-[var(--accent)]">← Repuestos</Link>
              <span className="text-[var(--text-secondary)]">/</span>
              <span className="text-[var(--text-primary)] font-medium">{part.name}</span>
            </div>
            {error && <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="p-8 rounded-2xl bg-[var(--card-bg)] border border-[var(--bg-secondary)]">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-[var(--text-primary)]">{editing ? "Editar" : "Información"}</h2>
                    {!editing && <button onClick={() => setEditing(true)} className="px-4 py-2 rounded-lg border border-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors text-sm">Editar</button>}
                  </div>
                  {editing ? (
                    <SparePartForm initialData={{ name: part.name, category: part.category || "", brand: part.brand || "", model: part.model || "", costPrice: Number(part.costPrice), sellingPrice: part.sellingPrice ? Number(part.sellingPrice) : null, stock: part.stock, supplier: part.supplier || "", notes: part.notes || "" }} onSubmit={handleUpdate} onCancel={() => setEditing(false)} loading={saving} />
                  ) : (
                    <dl className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div><dt className="text-sm text-[var(--text-secondary)]">Nombre</dt><dd className="text-[var(--text-primary)] font-medium">{part.name}</dd></div>
                        <div><dt className="text-sm text-[var(--text-secondary)]">Categoría</dt><dd className="text-[var(--text-primary)]">{part.category || "—"}</dd></div>
                        <div><dt className="text-sm text-[var(--text-secondary)]">Marca</dt><dd className="text-[var(--text-primary)]">{part.brand || "—"}</dd></div>
                        <div><dt className="text-sm text-[var(--text-secondary)]">Modelo</dt><dd className="text-[var(--text-primary)]">{part.model || "—"}</dd></div>
                        <div><dt className="text-sm text-[var(--text-secondary)]">Costo</dt><dd className="text-[var(--text-primary)]">${Number(part.costPrice).toLocaleString("es-CO")}</dd></div>
                        <div><dt className="text-sm text-[var(--text-secondary)]">Venta</dt><dd className="text-[var(--text-primary)]">{part.sellingPrice ? `$${Number(part.sellingPrice).toLocaleString("es-CO")}` : "—"}</dd></div>
                        <div><dt className="text-sm text-[var(--text-secondary)]">Stock</dt><dd className={part.stock === 0 ? "text-red-400 font-bold" : "text-[var(--text-primary)]"}>{part.stock}</dd></div>
                        <div><dt className="text-sm text-[var(--text-secondary)]">Proveedor</dt><dd className="text-[var(--text-primary)]">{part.supplier || "—"}</dd></div>
                      </div>
                      {part.notes && <div><dt className="text-sm text-[var(--text-secondary)]">Notas</dt><dd className="text-[var(--text-primary)]">{part.notes}</dd></div>}
                    </dl>
                  )}
                  <div className="mt-8 pt-6 border-t border-[var(--bg-secondary)]">
                    <button onClick={handleDelete} disabled={deleting} className="px-4 py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors text-sm">{deleting ? "Eliminando..." : "Eliminar"}</button>
                  </div>
                </div>
              </div>
              <div className="space-y-8">
                <div className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--bg-secondary)]">
                  <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Movimientos</h3>
                  {part.orderParts.length === 0 ? (
                    <p className="text-sm text-[var(--text-secondary)]">Sin movimientos registrados.</p>
                  ) : (
                    <ul className="space-y-2">
                      {part.orderParts.map((op) => (
                        <li key={op.id} className="p-3 rounded-lg border border-[var(--bg-secondary)]">
                          <div className="flex items-center justify-between mb-1">
                            <Link href={`/admin/reparaciones/${op.repairOrder.id}`} className="font-mono text-xs text-[var(--accent)] hover:underline">{op.repairOrder.trackingCode}</Link>
                            <span className="text-xs text-[var(--text-secondary)]">${Number(op.unitPrice).toLocaleString("es-CO")} × {op.quantity}</span>
                          </div>
                          <p className="text-xs text-[var(--text-secondary)]">{new Date(op.createdAt).toLocaleDateString("es-CO")}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}
