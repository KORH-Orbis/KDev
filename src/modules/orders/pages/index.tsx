import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import Layout from "@/modules/core/components/Layout";
import OrderTable from "@/modules/orders/components/OrderTable";
import StatusBadge, { getStatusLabel } from "@/modules/orders/components/StatusBadge";
import { config } from "@/modules/core/lib/config";

const statusFilters = [
  { value: "", label: "Todos" },
  { value: "RECEIVED", label: "Recibidos" },
  { value: "DIAGNOSING", label: "Diagnosticando" },
  { value: "BUDGETED", label: "Presupuestados" },
  { value: "APPROVED", label: "Aprobados" },
  { value: "REPAIRING", label: "En reparación" },
  { value: "REPAIRED", label: "Reparados" },
  { value: "DELIVERED", label: "Entregados" },
];

export default function OrdersListPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (statusFilter) params.set("status", statusFilter);

      const res = await fetch(`/api/repair-orders?${params.toString()}`);
      const json = await res.json();
      setOrders(json.data || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
    setLoading(false);
  }, [search, statusFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders();
  };

  return (
    <>
      <Head>
        <title>{`Reparaciones - ${config.appName}`}</title>
      </Head>
      <Layout>
        <section className="py-10 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
                  Reparaciones
                </h1>
                <p className="text-[var(--text-secondary)]">
                  {orders.length} orden{orders.length !== 1 ? "es" : ""}
                </p>
              </div>
              <Link
                href="/admin/reparaciones/nueva"
                className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-[var(--accent)] text-white font-medium hover:bg-[var(--accent-hover)] transition-colors text-sm"
              >
                + Nueva orden
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <form onSubmit={handleSearch} className="flex-1 flex gap-3">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar por código, cliente o problema..."
                  className="flex-1 px-4 py-3 rounded-lg bg-[var(--bg)] border border-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-colors text-sm"
                />
                <button
                  type="submit"
                  className="px-5 py-3 rounded-lg border border-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors text-sm font-medium"
                >
                  Buscar
                </button>
              </form>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 rounded-lg bg-[var(--bg)] border border-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-colors text-sm"
              >
                {statusFilters.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>

            <div className="rounded-2xl bg-[var(--card-bg)] border border-[var(--bg-secondary)]">
              <OrderTable orders={orders} loading={loading} />
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}
