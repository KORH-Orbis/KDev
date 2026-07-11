import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import Layout from "@/modules/core/components/Layout";
import StatsCards from "@/modules/admin/components/StatsCards";
import { config } from "@/modules/core/lib/config";

const STATUS_ORDER = ["RECEIVED","DIAGNOSING","BUDGETED","APPROVED","REPAIRING","REPAIRED","DELIVERED","REJECTED"] as const;

const STATUS_COLORS: Record<string, { bg: string; dot: string; ring: string }> = {
  RECEIVED:    { bg: "bg-yellow-500/10", dot: "bg-yellow-400", ring: "ring-yellow-500/20" },
  DIAGNOSING:  { bg: "bg-blue-500/10",   dot: "bg-blue-400",   ring: "ring-blue-500/20" },
  BUDGETED:    { bg: "bg-purple-500/10", dot: "bg-purple-400", ring: "ring-purple-500/20" },
  APPROVED:    { bg: "bg-indigo-500/10", dot: "bg-indigo-400", ring: "ring-indigo-500/20" },
  REPAIRING:   { bg: "bg-orange-500/10",dot: "bg-orange-400", ring: "ring-orange-500/20" },
  REPAIRED:    { bg: "bg-green-500/10", dot: "bg-green-400",  ring: "ring-green-500/20" },
  DELIVERED:   { bg: "bg-emerald-500/10",dot:"bg-emerald-400",ring: "ring-emerald-500/20" },
  REJECTED:    { bg: "bg-red-500/10",   dot: "bg-red-400",    ring: "ring-red-500/20" },
};

const STATUS_SHORT: Record<string, string> = {
  RECEIVED: "Recibido", DIAGNOSING: "Diag.", BUDGETED: "Presup.",
  APPROVED: "Aprobado", REPAIRING: "Repar.", REPAIRED: "Reparado",
  DELIVERED: "Entregado", REJECTED: "Rechazado",
};

export default function DashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState({ total: 0, active: 0, clients: 0, today: 0 });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({});
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [paymentStats, setPaymentStats] = useState({ today: 0, month: 0 });
  const [lowStock, setLowStock] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/repair-orders")
      .then((r) => r.json()).then((j) => {
        const orders = j.data || [];
        const active = orders.filter((o: any) => !["DELIVERED","REJECTED"].includes(o.status)).length;
        const td = new Date(); td.setHours(0,0,0,0);
        const todayCount = orders.filter((o: any) => new Date(o.createdAt) >= td).length;
        setStats({ total: orders.length, active, clients: 0, today: todayCount });
        setRecentOrders(orders.slice(0, 5));
        const counts: Record<string, number> = {};
        STATUS_ORDER.forEach((s) => { counts[s] = orders.filter((o: any) => o.status === s).length; });
        setStatusCounts(counts);
        setLoadingOrders(false);
      }).catch(() => setLoadingOrders(false));

    fetch("/api/clients").then((r) => r.json()).then((j) => {
      setStats((p) => ({ ...p, clients: j.data?.length || 0 }));
    }).catch(() => {});

    fetch("/api/payments/stats").then((r) => r.json()).then((j) => {
      if (j.data) setPaymentStats({ today: j.data.today || 0, month: j.data.month || 0 });
    }).catch(() => {});

    fetch("/api/spare-parts?lowStock=true").then((r) => r.json()).then((j) => {
      setLowStock(j.data || []);
    }).catch(() => {});
  }, []);

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return "Buenos días";
    if (h < 19) return "Buenas tardes";
    return "Buenas noches";
  }, []);

  const todayStr = useMemo(() => {
    return new Date().toLocaleDateString("es-CO", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  }, []);

  const initials = (session?.user?.name || "A").charAt(0).toUpperCase();

  return (
    <>
      <Head><title>{`Panel - ${config.appName}`}</title></Head>
      <Layout>
        <section
          className="relative py-10 sm:py-16 min-h-screen bg-cover bg-fixed"
          style={{ backgroundImage: "url(/bg-dashboard.png)", backgroundPosition: "center 15%" }}
        >
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-indigo-500/10 via-[var(--card-bg)]/40 to-purple-500/10 backdrop-blur-xl border border-white/5 shadow-[0_0_60px_-10px_rgba(99,102,241,0.10)] mb-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
              <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl translate-y-1/2" />
              <div className="absolute top-1/2 left-3/4 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl" />

              <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-indigo-500/20 flex-shrink-0">
                    {initials}
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                      {greeting}, {session?.user?.name || "Admin"}
                    </h1>
                    <p className="text-white/30 text-sm mt-1 capitalize">{todayStr}</p>
                    <p className="text-white/50 text-sm mt-3">
                      Hoy tenés{" "}
                      <span className="text-cyan-300 font-semibold">{stats.active}</span> órdenes activas
                      {paymentStats.today > 0 && (
                        <> y recaudaste <span className="text-emerald-300 font-semibold">${paymentStats.today.toLocaleString("es-CO")}</span></>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <StatsCards
              ordenesHoy={stats.today}
              recaudadoHoy={paymentStats.today}
              recaudadoMes={paymentStats.month}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-[var(--card-bg)]/60 backdrop-blur-xl border border-white/5 shadow-[0_0_30px_-5px_rgba(99,102,241,0.08)]">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-white/80">Órdenes por estado</h2>
                    <p className="text-5xl font-extrabold text-white tracking-tighter mt-2">{stats.total}</p>
                    <p className="text-sm text-white/30 mt-1">total</p>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {STATUS_ORDER.map((status) => {
                    const c = statusCounts[status] || 0;
                    const col = STATUS_COLORS[status];
                    return (
                      <div
                        key={status}
                        className={`relative p-4 rounded-2xl ${col.bg} border border-white/5 hover:border-white/10 transition-colors`}
                      >
                        <div className={`w-2.5 h-2.5 rounded-full ${col.dot} mb-2 ring-2 ${col.ring}`} />
                        <p className="text-xs text-white/40 truncate">{STATUS_SHORT[status]}</p>
                        <p className="text-xl font-bold text-white mt-1">{c}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex-1 p-6 rounded-3xl bg-[var(--card-bg)]/60 backdrop-blur-xl border border-white/5 shadow-[0_0_30px_-5px_rgba(251,191,36,0.06)] flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                      <svg className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75a4.5 4.5 0 01-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 11-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 016.336-4.486l-3.276 3.276a3.004 3.004 0 002.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-4xl font-extrabold text-amber-300 tracking-tighter">{stats.active}</p>
                      <p className="text-xs text-white/30 mt-0.5">Activas</p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 p-6 rounded-3xl bg-[var(--card-bg)]/60 backdrop-blur-xl border border-white/5 shadow-[0_0_30px_-5px_rgba(16,185,129,0.06)] flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                      <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-4xl font-extrabold text-emerald-300 tracking-tighter">{stats.clients}</p>
                      <p className="text-xs text-white/30 mt-0.5">Clientes</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
              <div className="lg:col-span-3 p-6 sm:p-8 rounded-3xl bg-[var(--card-bg)]/60 backdrop-blur-xl border border-white/5 shadow-[0_0_30px_-5px_rgba(99,102,241,0.06)]">
                <h2 className="text-lg font-semibold text-white/80 mb-6">Últimas órdenes</h2>
                {loadingOrders ? (
                  <div className="text-center py-10 text-white/20 text-sm">Cargando...</div>
                ) : recentOrders.length === 0 ? (
                  <div className="text-center py-10 text-white/30 text-sm">
                    No hay órdenes aún.{" "}
                    <Link href="/admin/reparaciones/nueva" className="text-cyan-400 hover:underline">Creá la primera</Link>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-white/20 text-xs uppercase tracking-wider">
                          <th className="text-left py-3 px-4 font-medium">Código</th>
                          <th className="text-left py-3 px-4 font-medium">Cliente</th>
                          <th className="text-left py-3 px-4 font-medium hidden sm:table-cell">Dispositivo</th>
                          <th className="text-center py-3 px-4 font-medium">Estado</th>
                          <th className="text-right py-3 px-4 font-medium hidden md:table-cell">Fecha</th>
                          <th className="py-3 px-4"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentOrders.map((order: any) => {
                          const st = STATUS_COLORS[order.status] || STATUS_COLORS.RECEIVED;
                          return (
                            <tr key={order.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                              <td className="py-3 px-4 font-mono text-xs text-cyan-400">{order.trackingCode}</td>
                              <td className="py-3 px-4 text-white/70 font-medium">{order.client?.name || "—"}</td>
                              <td className="py-3 px-4 text-white/30 hidden sm:table-cell text-xs">
                                {[order.deviceType, order.deviceBrand, order.deviceModel].filter(Boolean).join(" — ") || "—"}
                              </td>
                              <td className="py-3 px-4 text-center">
                                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${st.bg} ${st.dot.replace("bg-","text-")}`}>
                                  {STATUS_SHORT[order.status]}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-right text-xs text-white/20 hidden md:table-cell">
                                {new Date(order.createdAt).toLocaleDateString("es-CO")}
                              </td>
                              <td className="py-3 px-4 text-right">
                                <Link href={`/admin/reparaciones/${order.id}`} className="text-cyan-400 hover:text-cyan-300 text-xs font-medium transition-colors">
                                  Ver →
                                </Link>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="p-6 rounded-3xl bg-[var(--card-bg)]/60 backdrop-blur-xl border border-white/5 shadow-[0_0_30px_-5px_rgba(99,102,241,0.06)]">
                <h2 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-4">Acciones</h2>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { href: "/admin/reparaciones/nueva", label: "Nueva orden", color: "#fb7185", bg: "bg-rose-500/10", shape: "plus-square" as const },
                    { href: "/admin/clientes/nuevo", label: "Cliente", color: "#60a5fa", bg: "bg-blue-500/10", shape: "circles" as const },
                    { href: "/admin/reparaciones", label: "Órdenes", color: "#fbbf24", bg: "bg-amber-500/10", shape: "lines" as const },
                    { href: "/admin/clientes", label: "Clientes", color: "#34d399", bg: "bg-emerald-500/10", shape: "dot-circle" as const },
                    { href: "/admin/repuestos", label: "Repuestos", color: "#fb923c", bg: "bg-orange-500/10", shape: "hexagon" as const },
                    { href: "/admin/reportes", label: "Reportes", color: "#a78bfa", bg: "bg-violet-500/10", shape: "chart" as const },
                    { href: "/admin/tecnicos", label: "Técnicos", color: "#22d3ee", bg: "bg-cyan-500/10", shape: "circles" as const, adminOnly: true },
                  ].filter((act) => !act.adminOnly || (session?.user as any)?.role === "ADMIN").map((act) => (
                    <Link
                      key={act.href}
                      href={act.href}
                      className={`flex flex-col items-center gap-2 p-4 rounded-2xl ${act.bg} border border-white/5 hover:border-white/10 hover:scale-105 transition-all duration-200 group`}
                    >
                      <div className="h-7 w-7 flex items-center justify-center group-hover:scale-110 transition-transform">
                        {act.shape === "plus-square" && (
                          <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ border: `2px solid ${act.color}33` }}>
                            <span className="text-sm font-bold leading-none mt-px" style={{ color: act.color }}>+</span>
                          </div>
                        )}
                        {act.shape === "circles" && (
                          <div className="relative w-6 h-6">
                            <div className="absolute top-0 left-0 w-3.5 h-3.5 rounded-full" style={{ border: `2px solid ${act.color}33` }} />
                            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full" style={{ border: `2px solid ${act.color}33` }} />
                          </div>
                        )}
                        {act.shape === "lines" && (
                          <div className="flex flex-col gap-[3px] w-6">
                            <div className="h-[2px] rounded-full w-full" style={{ backgroundColor: act.color }} />
                            <div className="h-[3px] rounded-full w-3/4" style={{ backgroundColor: act.color }} />
                            <div className="h-[2px] rounded-full w-1/2" style={{ backgroundColor: act.color }} />
                          </div>
                        )}
                        {act.shape === "dot-circle" && (
                          <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ border: `2px solid ${act.color}33` }}>
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: act.color }} />
                          </div>
                        )}
                        {act.shape === "hexagon" && (
                          <div className="w-6 h-6 relative">
                            <div className="absolute inset-0" style={{ border: `2px solid ${act.color}33`, clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)" }} />
                          </div>
                        )}
                        {act.shape === "chart" && (
                          <div className="flex items-end gap-[3px] h-6">
                            <div className="w-1 h-1/3 rounded-t-sm" style={{ backgroundColor: act.color }} />
                            <div className="w-1 h-2/3 rounded-t-sm" style={{ backgroundColor: act.color }} />
                            <div className="w-1 h-full rounded-t-sm" style={{ backgroundColor: act.color }} />
                            <div className="w-1 h-1/2 rounded-t-sm" style={{ backgroundColor: act.color }} />
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] font-medium opacity-70" style={{ color: act.color }}>{act.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {lowStock.length > 0 && (
              <div className="p-6 sm:p-8 rounded-3xl bg-red-500/5 backdrop-blur-xl border border-red-500/10 shadow-[0_0_30px_-5px_rgba(239,68,68,0.06)]">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-2xl bg-red-500/10 flex items-center justify-center">
                    <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-semibold text-white/70">Repuestos con stock bajo</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {lowStock.map((p: any) => (
                    <Link key={p.id} href={`/admin/repuestos/${p.id}`}
                      className="flex items-center justify-between p-4 rounded-2xl bg-red-500/5 border border-red-500/10 hover:border-red-500/20 transition-colors">
                      <div>
                        <p className="text-sm font-medium text-white/80">{p.name}</p>
                        <p className="text-xs text-white/20">{p.category || "Sin categoría"}</p>
                      </div>
                      <span className="text-red-400 font-bold text-sm">{p.stock} / {p.minStock}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </Layout>
    </>
  );
}
