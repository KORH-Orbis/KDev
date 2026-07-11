import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import Layout from "@/modules/core/components/Layout";
import StatusBadge from "@/modules/orders/components/StatusBadge";
import StatusActions from "@/modules/orders/components/StatusActions";
import HistoryTimeline from "@/modules/orders/components/HistoryTimeline";
import BudgetForm from "@/modules/orders/components/BudgetForm";
import PaymentList from "@/modules/payments/components/PaymentList";
import PaymentSummary from "@/modules/payments/components/PaymentSummary";
import PaymentForm from "@/modules/payments/components/PaymentForm";
import PhotoGallery from "@/modules/photos/components/PhotoGallery";
import PhotoUploader from "@/modules/photos/components/PhotoUploader";
import SparePartSelector from "@/modules/spare-parts/components/SparePartSelector";
import { config } from "@/modules/core/lib/config";

interface OrderData {
  id: string;
  trackingCode: string;
  status: string;
  deviceType: string;
  deviceBrand: string | null;
  deviceModel: string | null;
  deviceSerial: string | null;
  issue: string;
  budgetAmount: string | null;
  budgetStatus: string | null;
  notes: string | null;
  guaranteeDays: number;
  completedAt: string | null;
  deliveredAt: string | null;
  createdAt: string;
  updatedAt: string;
  client: { id: string; name: string; email: string | null; phone: string | null };
  technician: { id: number; name: string } | null;
  device: { id: string; type: string; brand: string | null; model: string | null } | null;
}

export default function OrderDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(false);
  const [budgetLoading, setBudgetLoading] = useState(false);
  const [showBudget, setShowBudget] = useState(false);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [payments, setPayments] = useState<any[]>([]);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [photos, setPhotos] = useState<any[]>([]);
  const [photosLoading, setPhotosLoading] = useState(false);
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [orderParts, setOrderParts] = useState<any[]>([]);
  const [orderPartsLoading, setOrderPartsLoading] = useState(false);
  const [partAdding, setPartAdding] = useState(false);

  const fetchOrderParts = () => {
    if (!id) return;
    setOrderPartsLoading(true);
    fetch(`/api/spare-parts/order-parts?orderId=${id}`)
      .then((res) => res.json())
      .then((json) => setOrderParts(json.data || []))
      .catch(() => {})
      .finally(() => setOrderPartsLoading(false));
  };

  const handleAddPart = async (part: any, quantity: number, unitPrice: number) => {
    setPartAdding(true);
    setError("");
    try {
      const res = await fetch("/api/spare-parts/order-parts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sparePartId: part.id, repairOrderId: id, quantity, unitPrice }),
      });
      if (res.ok) {
        fetchOrderParts();
      } else {
        const json = await res.json();
        setError(json.error || "Error al agregar repuesto");
      }
    } catch {
      setError("Error de conexión");
    }
    setPartAdding(false);
  };

  const handleRemovePart = async (orderPartId: string) => {
    try {
      await fetch(`/api/spare-parts/order-parts?id=${orderPartId}`, { method: "DELETE" });
      fetchOrderParts();
    } catch { setError("Error al quitar repuesto"); }
  };

  const fetchPhotos = () => {
    if (!id) return;
    setPhotosLoading(true);
    fetch(`/api/photos?orderId=${id}`)
      .then((res) => res.json())
      .then((json) => setPhotos(json.data || []))
      .catch(() => {})
      .finally(() => setPhotosLoading(false));
  };

  const fetchPayments = () => {
    if (!id) return;
    setPaymentsLoading(true);
    fetch(`/api/payments?orderId=${id}`)
      .then((res) => res.json())
      .then((json) => setPayments(json.data || []))
      .catch(() => {})
      .finally(() => setPaymentsLoading(false));
  };

  const handleAddPayment = async (data: { amount: number; method: string; reference: string; notes: string }) => {
    setPaymentLoading(true);
    setError("");

    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repairOrderId: id,
          amount: data.amount,
          method: data.method,
          reference: data.reference,
          notes: data.notes,
        }),
      });

      const json = await res.json();

      if (res.ok) {
        setPaymentSuccess(true);
        setShowPaymentForm(false);
        fetchPayments();
        setTimeout(() => setPaymentSuccess(false), 3000);
      } else {
        setError(json.error || "Error al registrar pago");
      }
    } catch {
      setError("Error de conexión");
    }

    setPaymentLoading(false);
  };

  const totalPaid = payments.reduce((sum, p) => sum + Number(p.amount), 0);

  const fetchOrder = () => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/repair-orders/${id}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.data) setOrder(json.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrder();
    fetchPayments();
    fetchPhotos();
    fetchOrderParts();
  }, [id]);

  const handleStatusChange = async (newStatus: string) => {
    setStatusLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/repair-orders/${id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();

      if (res.ok) {
        setOrder(json.data);
      } else {
        setError(json.error || "Error al cambiar estado");
      }
    } catch {
      setError("Error de conexión");
    }

    setStatusLoading(false);
  };

  const handleBudgetSave = async (amount: number, note: string) => {
    setBudgetLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/repair-orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          budgetAmount: amount,
          budgetStatus: note || "Presupuesto enviado",
          status: "BUDGETED",
        }),
      });
      const json = await res.json();

      if (res.ok) {
        setOrder(json.data);
        setShowBudget(false);
      } else {
        setError(json.error || "Error al guardar presupuesto");
      }
    } catch {
      setError("Error de conexión");
    }

    setBudgetLoading(false);
  };

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de eliminar esta orden?")) return;
    setDeleting(true);

    try {
      await fetch(`/api/repair-orders/${id}`, { method: "DELETE" });
      router.push("/admin/reparaciones");
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

  if (!order) {
    return (
      <Layout>
        <div className="py-20 text-center">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Orden no encontrada</h2>
          <Link href="/admin/reparaciones" className="text-[var(--accent)] hover:underline">
            Volver al listado
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Head>
        <title>{`${order.trackingCode} - ${config.appName}`}</title>
      </Head>
      <Layout>
        <section className="py-10 sm:py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-8">
              <Link
                href="/admin/reparaciones"
                className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
              >
                ← Reparaciones
              </Link>
              <span className="text-[var(--text-secondary)]">/</span>
              <span className="font-mono text-[var(--accent)] font-medium">{order.trackingCode}</span>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="p-8 rounded-2xl bg-[var(--card-bg)] border border-[var(--bg-secondary)]">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                        Estado
                      </h2>
                      <StatusBadge status={order.status} />
                    </div>
                    {order.technician && (
                      <span className="text-sm text-[var(--text-secondary)]">
                        Técnico: {order.technician.name}
                      </span>
                    )}
                  </div>
                  <StatusActions
                    currentStatus={order.status}
                    onStatusChange={handleStatusChange}
                    loading={statusLoading}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="p-8 rounded-2xl bg-[var(--card-bg)] border border-[var(--bg-secondary)]">
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Dispositivo</h3>
                    <dl className="space-y-3 text-sm">
                      <div>
                        <dt className="text-[var(--text-secondary)]">Tipo</dt>
                        <dd className="text-[var(--text-primary)] font-medium">{order.deviceType}</dd>
                      </div>
                      {order.deviceBrand && (
                        <div>
                          <dt className="text-[var(--text-secondary)]">Marca</dt>
                          <dd className="text-[var(--text-primary)]">{order.deviceBrand}</dd>
                        </div>
                      )}
                      {order.deviceModel && (
                        <div>
                          <dt className="text-[var(--text-secondary)]">Modelo</dt>
                          <dd className="text-[var(--text-primary)]">{order.deviceModel}</dd>
                        </div>
                      )}
                      {order.deviceSerial && (
                        <div>
                          <dt className="text-[var(--text-secondary)]">N° de serie</dt>
                          <dd className="text-[var(--text-primary)] font-mono">{order.deviceSerial}</dd>
                        </div>
                      )}
                      <div>
                        <dt className="text-[var(--text-secondary)]">Garantía</dt>
                        <dd className="text-[var(--text-primary)]">{order.guaranteeDays} días</dd>
                      </div>
                      {order.device && (
                        <div>
                          <dt className="text-[var(--text-secondary)]">Dispositivo vinculado</dt>
                          <dd>
                            <Link href={`/admin/dispositivos/${order.device.id}`} className="text-[var(--accent)] hover:underline text-sm">
                              {[order.device.type, order.device.brand, order.device.model].filter(Boolean).join(" ")}
                            </Link>
                          </dd>
                        </div>
                      )}
                    </dl>
                  </div>

                  <div className="p-8 rounded-2xl bg-[var(--card-bg)] border border-[var(--bg-secondary)]">
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Problema</h3>
                    <p className="text-sm text-[var(--text-secondary)] whitespace-pre-wrap">{order.issue}</p>
                    {order.notes && (
                      <div className="mt-4 pt-4 border-t border-[var(--bg-secondary)]">
                        <h4 className="text-sm font-medium text-[var(--text-primary)] mb-2">Notas internas</h4>
                        <p className="text-sm text-[var(--text-secondary)] whitespace-pre-wrap">{order.notes}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-8 rounded-2xl bg-[var(--card-bg)] border border-[var(--bg-secondary)]">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-[var(--text-primary)]">Fotos del equipo</h3>
                    {!showPhotoUpload && (
                      <button
                        onClick={() => setShowPhotoUpload(true)}
                        className="px-4 py-2 rounded-lg bg-[var(--accent)] text-white text-sm font-medium hover:bg-[var(--accent-hover)] transition-colors"
                      >
                        + Subir foto
                      </button>
                    )}
                  </div>

                  {showPhotoUpload && (
                    <div className="mb-6 p-4 rounded-xl bg-[var(--bg)] border border-[var(--bg-secondary)]">
                      <PhotoUploader
                        repairOrderId={order.id}
                        onUploaded={() => {
                          setShowPhotoUpload(false);
                          fetchPhotos();
                        }}
                        onCancel={() => setShowPhotoUpload(false)}
                      />
                    </div>
                  )}

                  <PhotoGallery photos={photos} loading={photosLoading} />
                </div>

                <div className="p-8 rounded-2xl bg-[var(--card-bg)] border border-[var(--bg-secondary)]">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-[var(--text-primary)]">Presupuesto</h3>
                    {!showBudget && (
                      <button
                        onClick={() => setShowBudget(true)}
                        className="px-4 py-2 rounded-lg border border-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors text-sm"
                      >
                        {order.budgetAmount ? "Editar" : "Agregar presupuesto"}
                      </button>
                    )}
                  </div>

                  {showBudget ? (
                    <BudgetForm
                      onSubmit={handleBudgetSave}
                      onCancel={() => setShowBudget(false)}
                      loading={budgetLoading}
                      currentAmount={order.budgetAmount ? Number(order.budgetAmount) : null}
                      currentNote={order.budgetStatus}
                    />
                  ) : order.budgetAmount ? (
                    <div>
                      <div className="text-2xl font-bold text-[var(--text-primary)] mb-2">
                        ${Number(order.budgetAmount).toLocaleString("es-CO")}
                      </div>
                      {order.budgetStatus && (
                        <p className="text-sm text-[var(--text-secondary)]">{order.budgetStatus}</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-[var(--text-secondary)]">No se ha definido un presupuesto.</p>
                  )}
                </div>

                <div className="p-8 rounded-2xl bg-[var(--card-bg)] border border-[var(--bg-secondary)]">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                      Pagos
                    </h3>
                    {!showPaymentForm && (
                      <button
                        onClick={() => { setShowPaymentForm(true); setPaymentSuccess(false); }}
                        className="px-4 py-2 rounded-lg bg-[var(--accent)] text-white text-sm font-medium hover:bg-[var(--accent-hover)] transition-colors"
                      >
                        + Registrar pago
                      </button>
                    )}
                  </div>

                  {paymentSuccess && (
                    <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm text-center">
                      Pago registrado correctamente.
                    </div>
                  )}

                  {order.budgetAmount && (
                    <div className="mb-6">
                      <PaymentSummary
                        budgetAmount={Number(order.budgetAmount)}
                        totalPaid={totalPaid}
                      />
                    </div>
                  )}

                  {showPaymentForm && (
                    <div className="mb-6 p-4 rounded-xl bg-[var(--bg)] border border-[var(--bg-secondary)]">
                      <PaymentForm
                        onSubmit={handleAddPayment}
                        onCancel={() => setShowPaymentForm(false)}
                        loading={paymentLoading}
                        maxAmount={order.budgetAmount ? Math.max(0, Number(order.budgetAmount) - totalPaid) : undefined}
                      />
                    </div>
                  )}

                  <PaymentList payments={payments} loading={paymentsLoading} />
                </div>

                <div className="p-8 rounded-2xl bg-[var(--card-bg)] border border-[var(--bg-secondary)]">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-[var(--text-primary)]">Repuestos utilizados</h3>
                  </div>

                  <SparePartSelector onAdd={handleAddPart} loading={partAdding} />

                  {orderPartsLoading ? (
                    <div className="text-center py-6 text-[var(--text-secondary)] text-sm">Cargando...</div>
                  ) : orderParts.length > 0 ? (
                    <div className="mt-4 space-y-2">
                      {orderParts.map((op: any) => (
                        <div key={op.id} className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg)] border border-[var(--bg-secondary)]">
                          <div>
                            <p className="text-sm text-[var(--text-primary)] font-medium">{op.sparePart?.name || "Repuesto"}</p>
                            <p className="text-xs text-[var(--text-secondary)]">
                              ${Number(op.unitPrice).toLocaleString("es-CO")} × {op.quantity} = ${(Number(op.unitPrice) * op.quantity).toLocaleString("es-CO")}
                            </p>
                          </div>
                          <button onClick={() => handleRemovePart(op.id)} className="text-red-400 hover:text-red-300 text-xs transition-colors">Quitar</button>
                        </div>
                      ))}
                      <div className="text-right text-sm font-semibold text-[var(--text-primary)] pt-2">
                        Total repuestos: $
                        {orderParts.reduce((sum: number, op: any) => sum + Number(op.unitPrice) * op.quantity, 0).toLocaleString("es-CO")}
                      </div>
                    </div>
                  ) : null}
                </div>

                <div className="p-8 rounded-2xl bg-[var(--card-bg)] border border-[var(--bg-secondary)]">
                  <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-6">
                    Historial
                  </h3>
                  <HistoryTimeline order={order} />
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="px-4 py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors text-sm"
                  >
                    {deleting ? "Eliminando..." : "Eliminar orden"}
                  </button>
                </div>
              </div>

              <div>
                <div className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--bg-secondary)] sticky top-20">
                  <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Cliente</h3>
                  <div className="space-y-3 text-sm">
                    <Link
                      href={`/admin/clientes/${order.client.id}`}
                      className="block text-[var(--accent)] font-medium hover:underline"
                    >
                      {order.client.name}
                    </Link>
                    {order.client.email && (
                      <div className="text-[var(--text-secondary)]">{order.client.email}</div>
                    )}
                    {order.client.phone && (
                      <div className="text-[var(--text-secondary)]">{order.client.phone}</div>
                    )}
                  </div>

                  <div className="mt-6 pt-6 border-t border-[var(--bg-secondary)] space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--text-secondary)]">Creado</span>
                      <span className="text-[var(--text-primary)]">
                        {new Date(order.createdAt).toLocaleDateString("es-CO")}
                      </span>
                    </div>
                    {order.completedAt && (
                      <div className="flex justify-between text-sm">
                        <span className="text-[var(--text-secondary)]">Completado</span>
                        <span className="text-[var(--text-primary)]">
                          {new Date(order.completedAt).toLocaleDateString("es-CO")}
                        </span>
                      </div>
                    )}
                    {order.deliveredAt && (
                      <div className="flex justify-between text-sm">
                        <span className="text-[var(--text-secondary)]">Entregado</span>
                        <span className="text-[var(--text-primary)]">
                          {new Date(order.deliveredAt).toLocaleDateString("es-CO")}
                        </span>
                      </div>
                    )}
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
