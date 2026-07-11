import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Layout from "@/modules/core/components/Layout";
import DeviceForm from "@/modules/devices/components/DeviceForm";
import { config } from "@/modules/core/lib/config";

export default function NewDevicePage() {
  const router = useRouter();
  const [clients, setClients] = useState<{ id: string; name: string }[]>([]);
  const [clientsLoading, setClientsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/clients")
      .then((res) => res.json())
      .then((json) => setClients(json.data || []))
      .catch(() => {})
      .finally(() => setClientsLoading(false));
  }, []);

  const handleSubmit = async (data: any) => {
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/devices", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data),
      });
      const json = await res.json();
      if (res.ok) router.push(`/admin/dispositivos/${json.data.id}`);
      else setError(json.error || "Error al crear dispositivo");
    } catch { setError("Error de conexión"); }
    setLoading(false);
  };

  return (
    <>
      <Head><title>{`Nuevo dispositivo - ${config.appName}`}</title></Head>
      <Layout>
        <section className="py-10 sm:py-16">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8"><h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Nuevo dispositivo</h1></div>
            {error && <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>}
            <div className="p-8 rounded-2xl bg-[var(--card-bg)] border border-[var(--bg-secondary)]">
              <DeviceForm clients={clients} clientsLoading={clientsLoading} onSubmit={handleSubmit} onCancel={() => router.push("/admin/dispositivos")} loading={loading} />
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}
