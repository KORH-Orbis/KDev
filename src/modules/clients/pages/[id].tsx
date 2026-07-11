import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import Layout from "@/modules/core/components/Layout";
import ClientForm from "@/modules/clients/components/ClientForm";
import { config } from "@/modules/core/lib/config";

const statusLabels: Record<string, { label: string; color: string }> = {
  RECEIVED: { label: "Recibido", color: "bg-yellow-500" },
  DIAGNOSING: { label: "Diagnosticando", color: "bg-blue-500" },
  BUDGETED: { label: "Presupuestado", color: "bg-purple-500" },
  APPROVED: { label: "Aprobado", color: "bg-indigo-500" },
  REPAIRING: { label: "En reparación", color: "bg-orange-500" },
  REPAIRED: { label: "Reparado", color: "bg-green-500" },
  DELIVERED: { label: "Entregado", color: "bg-green-600" },
  REJECTED: { label: "Rechazado", color: "bg-red-500" },
};

interface ClientData {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  createdAt: string;
  repairOrders: {
    id: string;
    trackingCode: string;
    deviceType: string;
    deviceBrand: string | null;
    deviceModel: string | null;
    status: string;
    createdAt: string;
  }[];
}

export default function ClientDetailPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { id } = router.query;

  const [client, setClient] = useState<ClientData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    fetch(`/api/clients/${id}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.data) setClient(json.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleUpdate = async (data: { name: string; email: string; phone: string }) => {
    setSaving(true);
    setError("");

    try {
      const res = await fetch(`/api/clients/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();

      if (res.ok) {
        setClient(json.data);
        setEditing(false);
      } else {
        setError(json.error || "Error al actualizar");
      }
    } catch {
      setError("Error de conexión");
    }

    setSaving(false);
  };

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de eliminar este cliente?")) return;
    setDeleting(true);

    try {
      await fetch(`/api/clients/${id}`, { method: "DELETE" });
      router.push("/admin/clientes");
    } catch {
      setError("Error al eliminar");
    }

    setDeleting(false);
  };

  if (loading) {
    return (
      <Layout>
        <div className="py-20 text-center text-[var(--text-secondary)]">Cargando...</div>
      </Layout>
    );
  }

  if (!client) {
    return (
      <Layout>
        <div className="py-20 text-center">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Cliente no encontrado</h2>
          <Link href="/admin/clientes" className="text-[var(--accent)] hover:underline">
            Volver al listado
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Head>
        <title>{`${client.name} - ${config.appName}`}</title>
      </Head>
      <Layout>
        <section className="py-10 sm:py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-8">
              <Link
                href="/admin/clientes"
                className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
              >
                ← Clientes
              </Link>
              <span className="text-[var(--text-secondary)]">/</span>
              <span className="text-[var(--text-primary)] font-medium">{client.name}</span>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="p-8 rounded-2xl bg-[var(--card-bg)] border border-[var(--bg-secondary)]">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                      {editing ? "Editar cliente" : "Información"}
                    </h2>
                    {!editing && (
                      <button
                        onClick={() => setEditing(true)}
                        className="px-4 py-2 rounded-lg border border-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors text-sm"
                      >
                        Editar
                      </button>
                    )}
                  </div>

                  {editing ? (
                    <ClientForm
                      initialData={{
                        name: client.name,
                        email: client.email || "",
                        phone: client.phone || "",
                      }}
                      onSubmit={handleUpdate}
                      onCancel={() => setEditing(false)}
                      loading={saving}
                    />
                  ) : (
                    <dl className="space-y-4">
                      <div>
                        <dt className="text-sm text-[var(--text-secondary)]">Nombre</dt>
                        <dd className="text-[var(--text-primary)] font-medium">{client.name}</dd>
                      </div>
                      <div>
                        <dt className="text-sm text-[var(--text-secondary)]">Email</dt>
                        <dd className="text-[var(--text-primary)]">{client.email || "—"}</dd>
                      </div>
                      <div>
                        <dt className="text-sm text-[var(--text-secondary)]">Teléfono</dt>
                        <dd className="text-[var(--text-primary)]">{client.phone || "—"}</dd>
                      </div>
                      <div>
                        <dt className="text-sm text-[var(--text-secondary)]">Fecha de registro</dt>
                        <dd className="text-[var(--text-primary)]">
                          {new Date(client.createdAt).toLocaleDateString("es-CO", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </dd>
                      </div>
                    </dl>
                  )}

                  <div className="mt-8 pt-6 border-t border-[var(--bg-secondary)]">
                    <button
                      onClick={handleDelete}
                      disabled={deleting}
                      className="px-4 py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors text-sm"
                    >
                      {deleting ? "Eliminando..." : "Eliminar cliente"}
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <div className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--bg-secondary)]">
                  <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
                    Órdenes de reparación
                  </h3>
                  {client.repairOrders.length === 0 ? (
                    <p className="text-sm text-[var(--text-secondary)]">
                      No hay órdenes asociadas a este cliente.
                    </p>
                  ) : (
                    <ul className="space-y-3">
                      {client.repairOrders.map((order) => {
                        const st = statusLabels[order.status] || { label: order.status, color: "bg-gray-500" };
                        return (
                          <li key={order.id}>
                            <Link
                              href={`/admin/reparaciones/${order.id}`}
                              className="block p-3 rounded-lg border border-[var(--bg-secondary)] hover:border-[var(--accent)] transition-colors"
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium text-[var(--text-primary)]">
                                  {order.trackingCode}
                                </span>
                                <span className={`px-2 py-0.5 rounded-full text-xs text-white ${st.color}`}>
                                  {st.label}
                                </span>
                              </div>
                              <p className="text-xs text-[var(--text-secondary)]">
                                {order.deviceType}{order.deviceBrand ? ` — ${order.deviceBrand} ${order.deviceModel || ""}` : ""}
                              </p>
                            </Link>
                          </li>
                        );
                      })}
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
