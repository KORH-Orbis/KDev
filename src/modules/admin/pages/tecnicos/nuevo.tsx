import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Layout from "@/modules/core/components/Layout";
import TechnicianForm from "@/modules/admin/components/TechnicianForm";
import { config } from "@/modules/core/lib/config";

export default function NewTecnicoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (data: any) => {
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/admin/technicians", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const json = await res.json();
      if (res.ok) router.push("/admin/tecnicos");
      else setError(json.error || "Error al crear");
    } catch { setError("Error de conexión"); }
    setLoading(false);
  };

  return (
    <>
      <Head><title>{`Nuevo técnico - ${config.appName}`}</title></Head>
      <Layout>
        <section className="py-10 sm:py-16">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-8">Nuevo técnico</h1>
            {error && <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>}
            <div className="p-8 rounded-2xl bg-[var(--card-bg)] border border-[var(--bg-secondary)]">
              <TechnicianForm onSubmit={handleSubmit} onCancel={() => router.push("/admin/tecnicos")} loading={loading} />
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}
