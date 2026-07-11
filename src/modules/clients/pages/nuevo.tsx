import { useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Layout from "@/modules/core/components/Layout";
import ClientForm from "@/modules/clients/components/ClientForm";
import { config } from "@/modules/core/lib/config";

export default function NewClientPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (data: { name: string; email: string; phone: string }) => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (res.ok) {
        router.push(`/admin/clientes/${json.data.id}`);
      } else {
        setError(json.error || "Error al crear el cliente");
      }
    } catch {
      setError("Error de conexión");
    }

    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>{`Nuevo cliente - ${config.appName}`}</title>
      </Head>
      <Layout>
        <section className="py-10 sm:py-16">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Nuevo cliente</h1>
              <p className="text-[var(--text-secondary)]">Registrá un nuevo cliente en el sistema.</p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="p-8 rounded-2xl bg-[var(--card-bg)] border border-[var(--bg-secondary)]">
              <ClientForm
                onSubmit={handleSubmit}
                onCancel={() => router.push("/admin/clientes")}
                loading={loading}
              />
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}
