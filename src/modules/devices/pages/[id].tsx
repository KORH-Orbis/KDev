import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import Layout from "@/modules/core/components/Layout";
import DeviceForm from "@/modules/devices/components/DeviceForm";
import DeviceHistory from "@/modules/devices/components/DeviceHistory";
import { config } from "@/modules/core/lib/config";

interface DeviceData {
  id: string;
  type: string;
  brand: string | null;
  model: string | null;
  serialNumber: string | null;
  imei: string | null;
  color: string | null;
  accessories: string | null;
  notes: string | null;
  createdAt: string;
  client: { id: string; name: string; email: string | null; phone: string | null };
  repairOrders: any[];
}

export default function DeviceDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [device, setDevice] = useState<DeviceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const fetchDevice = () => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/devices/${id}`)
      .then((res) => res.json())
      .then((json) => { if (json.data) setDevice(json.data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchDevice(); }, [id]);

  const handleUpdate = async (data: any) => {
    setSaving(true); setError("");
    try {
      const res = await fetch(`/api/devices/${id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data),
      });
      const json = await res.json();
      if (res.ok) { setDevice(json.data); setEditing(false); }
      else setError(json.error || "Error al actualizar");
    } catch { setError("Error de conexión"); }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!confirm("¿Eliminar este dispositivo?")) return;
    setDeleting(true);
    try { await fetch(`/api/devices/${id}`, { method: "DELETE" }); router.push("/admin/dispositivos"); }
    catch { setError("Error al eliminar"); }
    setDeleting(false);
  };

  if (loading) return <Layout><div className="py-20 text-center text-[var(--text-secondary)]">Cargando...</div></Layout>;
  if (!device) return <Layout><div className="py-20 text-center"><h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Dispositivo no encontrado</h2><Link href="/admin/dispositivos" className="text-[var(--accent)] hover:underline">Volver</Link></div></Layout>;

  return (
    <>
      <Head><title>{`${[device.type, device.brand, device.model].filter(Boolean).join(" ")} - ${config.appName}`}</title></Head>
      <Layout>
        <section className="py-10 sm:py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-8">
              <Link href="/admin/dispositivos" className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">← Dispositivos</Link>
              <span className="text-[var(--text-secondary)]">/</span>
              <span className="text-[var(--text-primary)] font-medium">{[device.brand, device.model].filter(Boolean).join(" ") || device.type}</span>
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
                    <DeviceForm clients={[{ id: device.client.id, name: device.client.name }]} clientsLoading={false}
                      initialData={{ type: device.type, brand: device.brand || "", model: device.model || "", serialNumber: device.serialNumber || "", imei: device.imei || "", color: device.color || "", accessories: device.accessories || "", notes: device.notes || "" }}
                      onSubmit={handleUpdate} onCancel={() => setEditing(false)} loading={saving} hideClient fixedClientId={device.client.id} />
                  ) : (
                    <dl className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div><dt className="text-sm text-[var(--text-secondary)]">Tipo</dt><dd className="text-[var(--text-primary)] font-medium">{device.type}</dd></div>
                        <div><dt className="text-sm text-[var(--text-secondary)]">Marca</dt><dd className="text-[var(--text-primary)]">{device.brand || "—"}</dd></div>
                        <div><dt className="text-sm text-[var(--text-secondary)]">Modelo</dt><dd className="text-[var(--text-primary)]">{device.model || "—"}</dd></div>
                        <div><dt className="text-sm text-[var(--text-secondary)]">Color</dt><dd className="text-[var(--text-primary)]">{device.color || "—"}</dd></div>
                        <div><dt className="text-sm text-[var(--text-secondary)]">N° de serie</dt><dd className="text-[var(--text-primary)] font-mono">{device.serialNumber || "—"}</dd></div>
                        <div><dt className="text-sm text-[var(--text-secondary)]">IMEI</dt><dd className="text-[var(--text-primary)] font-mono">{device.imei || "—"}</dd></div>
                      </div>
                      <div><dt className="text-sm text-[var(--text-secondary)]">Accesorios</dt><dd className="text-[var(--text-primary)]">{device.accessories || "—"}</dd></div>
                      {device.notes && <div><dt className="text-sm text-[var(--text-secondary)]">Notas</dt><dd className="text-[var(--text-primary)]">{device.notes}</dd></div>}
                    </dl>
                  )}
                  <div className="mt-8 pt-6 border-t border-[var(--bg-secondary)]">
                    <button onClick={handleDelete} disabled={deleting} className="px-4 py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors text-sm">{deleting ? "Eliminando..." : "Eliminar"}</button>
                  </div>
                </div>

                <div className="p-8 rounded-2xl bg-[var(--card-bg)] border border-[var(--bg-secondary)]">
                  <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-6">Historial de reparaciones</h2>
                  <DeviceHistory orders={device.repairOrders} />
                </div>
              </div>

              <div>
                <div className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--bg-secondary)] sticky top-20">
                  <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Cliente</h3>
                  <Link href={`/admin/clientes/${device.client.id}`} className="block text-[var(--accent)] font-medium hover:underline text-sm">{device.client.name}</Link>
                  {device.client.email && <p className="text-sm text-[var(--text-secondary)] mt-1">{device.client.email}</p>}
                  {device.client.phone && <p className="text-sm text-[var(--text-secondary)] mt-1">{device.client.phone}</p>}
                  <div className="mt-6 pt-6 border-t border-[var(--bg-secondary)] text-sm text-[var(--text-secondary)]">
                    Registrado: {new Date(device.createdAt).toLocaleDateString("es-CO")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}
