import { useRouter } from "next/router";
import { useEffect, useState, useCallback } from "react";
import Head from "next/head";
import Layout from "@/modules/core/components/Layout";
import { config } from "@/modules/core/lib/config";

interface OrderData {
  id: string;
  codigo: string;
  estado: string;
  estadoOriginal: string;
  dispositivo: string;
  problema: string;
  presupuesto: number | null;
  notaPresupuesto: string | null;
  fecha: string;
  garantia: string;
  cliente: string;
  historial: { estado: string; fecha: string; descripcion: string }[];
  fotos: { url: string; caption: string | null }[];
}

const estados: Record<string, { label: string; color: string }> = {
  recibido: { label: "Recibido", color: "bg-yellow-500" },
  diagnosticando: { label: "Diagnosticando", color: "bg-blue-500" },
  presupuestado: { label: "Presupuestado", color: "bg-purple-500" },
  aprobado: { label: "Aprobado", color: "bg-indigo-500" },
  reparando: { label: "En reparación", color: "bg-orange-500" },
  reparado: { label: "Reparado", color: "bg-green-500" },
  entregado: { label: "Entregado", color: "bg-green-600" },
  rechazado: { label: "Rechazado", color: "bg-red-500" },
};

export default function SeguimientoDetalle() {
  const router = useRouter();
  const { codigo } = router.query;
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const fetchOrder = useCallback(() => {
    if (!codigo) return;
    setLoading(true);
    fetch(`/api/tracking/${codigo}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.data) setOrder(data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [codigo]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const handleBudgetAction = async (action: "APPROVED" | "REJECTED") => {
    if (!order) return;
    setActionLoading(true);
    setActionError("");
    setActionSuccess("");

    try {
      const res = await fetch(`/api/repair-orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: action,
          budgetStatus: action === "APPROVED" ? "APROBADO POR CLIENTE" : "RECHAZADO POR CLIENTE",
        }),
      });

      if (res.ok) {
        setActionSuccess(
          action === "APPROVED"
            ? "Presupuesto aprobado. Comenzaremos la reparación pronto."
            : "Presupuesto rechazado. Nos pondremos en contacto contigo."
        );
        fetchOrder();
      } else {
        setActionError("Error al procesar la acción. Intenta de nuevo.");
      }
    } catch {
      setActionError("Error de conexión.");
    }

    setActionLoading(false);
  };

  if (loading) {
    return (
      <Layout>
        <div className="py-20 text-center text-[var(--text-secondary)]">Cargando...</div>
      </Layout>
    );
  }

  if (!order) {
    return (
      <Layout>
        <div className="py-20 text-center">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Código no encontrado</h2>
          <p className="text-[var(--text-secondary)]">Verifica el código e intenta de nuevo.</p>
        </div>
      </Layout>
    );
  }

  const estadoActual = estados[order.estado] || { label: order.estado, color: "bg-gray-500" };
  const mostrarAcciones = order.estadoOriginal === "BUDGETED" && !actionSuccess;

  return (
    <>
      <Head>
        <title>{`Seguimiento ${order.codigo} - ${config.appName}`}</title>
      </Head>
      <Layout>
        <section className="py-20 sm:py-28">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
                Orden {order.codigo}
              </h1>
              <p className="text-[var(--text-secondary)]">{order.dispositivo}</p>
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                Cliente: {order.cliente}
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[var(--card-bg)] border border-[var(--bg-secondary)] mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-[var(--text-primary)]">Estado actual</h2>
                <span className={`px-4 py-1.5 rounded-full text-white text-sm font-medium ${estadoActual.color}`}>
                  {estadoActual.label}
                </span>
              </div>

              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-[var(--text-secondary)]">Problema reportado</dt>
                  <dd className="text-[var(--text-primary)] mt-1">{order.problema}</dd>
                </div>
                <div className="flex gap-8">
                  <div>
                    <dt className="text-[var(--text-secondary)]">Fecha de ingreso</dt>
                    <dd className="text-[var(--text-primary)] mt-0.5">
                      {new Date(order.fecha).toLocaleDateString("es-CO", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[var(--text-secondary)]">Garantía</dt>
                    <dd className="text-[var(--text-primary)] mt-0.5">{order.garantia}</dd>
                  </div>
                </div>
              </dl>

              {order.presupuesto !== null && (
                <div className="mt-6 pt-6 border-t border-[var(--bg-secondary)]">
                  <dt className="text-sm text-[var(--text-secondary)]">Presupuesto</dt>
                  <dd className="text-2xl font-bold text-[var(--text-primary)] mt-1">
                    ${order.presupuesto.toLocaleString("es-CO")}
                  </dd>
                  {order.notaPresupuesto && (
                    <dd className="text-sm text-[var(--text-secondary)] mt-1">
                      {order.notaPresupuesto}
                    </dd>
                  )}
                </div>
              )}
            </div>

            {order.fotos && order.fotos.length > 0 && (
              <div className="p-8 rounded-2xl bg-[var(--card-bg)] border border-[var(--bg-secondary)] mb-8">
                <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-6">Fotos del equipo</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {order.fotos.map((foto, i) => (
                    <button
                      key={i}
                      onClick={() => setLightboxIndex(i)}
                      className="group relative aspect-square rounded-xl overflow-hidden bg-[var(--bg)] border border-[var(--bg-secondary)] hover:border-[var(--accent)] transition-colors"
                    >
                      <img
                        src={foto.url}
                        alt={foto.caption || "Foto del equipo"}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {foto.caption && (
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                          <p className="text-white text-xs truncate">{foto.caption}</p>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {lightboxIndex !== null && order.fotos && (
              <div
                className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center"
                onClick={() => setLightboxIndex(null)}
              >
                <button
                  onClick={() => setLightboxIndex(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-10"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {order.fotos.length > 1 && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); setLightboxIndex(lightboxIndex > 0 ? lightboxIndex - 1 : order.fotos!.length - 1); }}
                      className="absolute left-4 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-10"
                    >
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setLightboxIndex(lightboxIndex < order.fotos!.length - 1 ? lightboxIndex + 1 : 0); }}
                      className="absolute right-4 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-10"
                    >
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </button>
                  </>
                )}

                <div
                  className="max-w-[90vw] max-h-[90vh] flex flex-col items-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <img
                    src={order.fotos[lightboxIndex].url}
                    alt={order.fotos[lightboxIndex].caption || "Foto del equipo"}
                    className="max-w-full max-h-[80vh] object-contain rounded-lg"
                  />
                  {order.fotos[lightboxIndex].caption && (
                    <p className="text-white/70 text-sm mt-4 text-center">{order.fotos[lightboxIndex].caption}</p>
                  )}
                  <p className="text-white/50 text-xs mt-2">
                    {lightboxIndex + 1} / {order.fotos.length}
                  </p>
                </div>
              </div>
            )}

            {actionError && (
              <div className="mb-8 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
                {actionError}
              </div>
            )}

            {actionSuccess && (
              <div className="mb-8 p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm text-center">
                {actionSuccess}
              </div>
            )}

            {mostrarAcciones && (
              <div className="p-8 rounded-2xl bg-[var(--card-bg)] border border-[var(--bg-secondary)] mb-8">
                <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-6 text-center">
                  ¿Qué deseas hacer con el presupuesto?
                </h2>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => handleBudgetAction("APPROVED")}
                    disabled={actionLoading}
                    className="px-8 py-4 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {actionLoading ? "Procesando..." : "Aprobar presupuesto"}
                  </button>
                  <button
                    onClick={() => handleBudgetAction("REJECTED")}
                    disabled={actionLoading}
                    className="px-8 py-4 rounded-lg border border-red-500/30 text-red-400 font-semibold hover:bg-red-500/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {actionLoading ? "Procesando..." : "Rechazar presupuesto"}
                  </button>
                </div>
              </div>
            )}

            <div className="p-8 rounded-2xl bg-[var(--card-bg)] border border-[var(--bg-secondary)]">
              <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-6">Historial</h2>
              <div className="space-y-0">
                {order.historial.map((h, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-3 h-3 rounded-full ${estados[h.estado]?.color || "bg-gray-500"}`}
                      />
                      {i < order.historial.length - 1 && (
                        <div className="w-0.5 h-10 bg-[var(--bg-secondary)]" />
                      )}
                    </div>
                    <div className="pb-4">
                      <p className="text-sm font-medium text-[var(--text-primary)]">{h.descripcion}</p>
                      <p className="text-xs text-[var(--text-secondary)] mt-1">
                        {new Date(h.fecha).toLocaleDateString("es-CO", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}
