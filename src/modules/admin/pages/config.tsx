import { useState, useEffect } from "react";
import Head from "next/head";
import Layout from "@/modules/core/components/Layout";

interface ConfigData {
  appName: string; appDescription: string; contactEmail: string;
  phone: string; whatsapp: string; address: string;
  guaranteeDays: number; trackingPrefix: string; sparePartMargin: number;
}

export default function ConfigPage() {
  const [config, setConfig] = useState<ConfigData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/config")
      .then((r) => r.json())
      .then((j) => { setConfig(j.data); setLoading(false); });
  }, []);

  const handleChange = (key: string, value: any) => {
    if (!config) return;
    setConfig({ ...config, [key]: value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setError(""); setSuccess(false);
    try {
      const res = await fetch("/api/admin/config", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(config) });
      if (res.ok) { const j = await res.json(); setConfig(j.data); setSuccess(true); setTimeout(() => setSuccess(false), 3000); }
      else { const j = await res.json(); setError(j.error || "Error"); }
    } catch { setError("Error de conexión"); }
    setSaving(false);
  };

  if (loading) return <Layout><div className="py-20 text-center text-[var(--text-secondary)]">Cargando...</div></Layout>;

  const f = "w-full px-4 py-3 rounded-lg bg-[var(--bg)] border border-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-colors";
  const l = "block text-sm font-medium text-[var(--text-primary)] mb-2";

  return (
    <>
      <Head><title>Configuración - {config?.appName}</title></Head>
      <Layout>
        <section className="py-10 sm:py-16">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-8">Configuración del negocio</h1>
            {success && <div className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm">Configuración guardada.</div>}
            {error && <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>}
            <form onSubmit={handleSave} className="p-8 rounded-2xl bg-[var(--card-bg)] border border-[var(--bg-secondary)] space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div><label className={l}>Nombre del negocio</label><input className={f} value={config?.appName || ""} onChange={(e) => handleChange("appName", e.target.value)} /></div>
                <div><label className={l}>Email de contacto</label><input className={f} value={config?.contactEmail || ""} onChange={(e) => handleChange("contactEmail", e.target.value)} /></div>
              </div>
              <div><label className={l}>Descripción</label><input className={f} value={config?.appDescription || ""} onChange={(e) => handleChange("appDescription", e.target.value)} /></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div><label className={l}>Teléfono</label><input className={f} value={config?.phone || ""} onChange={(e) => handleChange("phone", e.target.value)} /></div>
                <div><label className={l}>WhatsApp</label><input className={f} value={config?.whatsapp || ""} onChange={(e) => handleChange("whatsapp", e.target.value)} /></div>
              </div>
              <div><label className={l}>Dirección</label><input className={f} value={config?.address || ""} onChange={(e) => handleChange("address", e.target.value)} /></div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div><label className={l}>Días de garantía</label><input type="number" className={f} value={config?.guaranteeDays || 10} onChange={(e) => handleChange("guaranteeDays", Number(e.target.value))} /></div>
                <div><label className={l}>Prefijo tracking</label><input className={f} value={config?.trackingPrefix || "LK"} onChange={(e) => handleChange("trackingPrefix", e.target.value.toUpperCase())} /></div>
                <div><label className={l}>Margen repuestos</label><input type="number" step="0.1" className={f} value={config?.sparePartMargin || 1.5} onChange={(e) => handleChange("sparePartMargin", Number(e.target.value))} /></div>
              </div>
              <div className="pt-4"><button type="submit" disabled={saving} className="px-6 py-3 rounded-lg bg-[var(--accent)] text-white font-medium hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50">{saving ? "Guardando..." : "Guardar configuración"}</button></div>
            </form>
          </div>
        </section>
      </Layout>
    </>
  );
}
