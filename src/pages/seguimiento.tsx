import { useState, FormEvent } from "react";
import Head from "next/head";
import Link from "next/link";
import Layout from "@/modules/core/components/Layout";
import { config } from "@/modules/core/lib/config";

export default function Seguimiento() {
  const [codigo, setCodigo] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!codigo.trim()) return;

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch(`/api/tracking/${codigo.trim().toUpperCase()}`);
      if (res.ok) {
        window.location.href = `/seguimiento/${codigo.trim().toUpperCase()}`;
      } else {
        const data = await res.json();
        setStatus("error");
        setErrorMessage(data.error || "Código no encontrado");
      }
    } catch {
      setStatus("error");
      setErrorMessage("Error de conexión. Intenta de nuevo.");
    }
  };

  return (
    <>
      <Head>
        <title>{`Seguimiento - ${config.appName}`}</title>
        <meta name="description" content={`Consulta el estado de tu reparación en ${config.appName}.`} />
      </Head>
      <Layout>
        <section className="py-20 sm:py-28">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-6">
              Seguimiento de reparación
            </h1>
            <p className="text-lg text-[var(--text-secondary)] mb-10">
              Ingresa el código de seguimiento que recibiste al dejar tu equipo para consultar el estado actual.
            </p>

            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  placeholder={`Ej: ${config.trackingPrefix}-123456`}
                  className="flex-1 px-5 py-4 rounded-lg bg-[var(--bg)] border border-[var(--bg-secondary)] text-[var(--text-primary)] text-lg font-mono tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-colors uppercase"
                  maxLength={20}
                />
              </div>

              {status === "error" && (
                <div className="mt-4 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={status === "loading" || !codigo.trim()}
                className="mt-6 w-full px-8 py-4 rounded-lg bg-[var(--accent)] text-white font-semibold hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === "loading" ? "Consultando..." : "Consultar estado"}
              </button>
            </form>

            <div className="mt-16 p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--bg-secondary)]">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">
                ¿No tienes un código?
              </h3>
              <p className="text-[var(--text-secondary)] text-sm mb-4">
                Si aún no has dejado tu equipo con nosotros, solicita tu servicio ahora.
              </p>
              <Link
                href="/contacto"
                className="inline-flex items-center justify-center px-6 py-2 rounded-lg border border-[var(--accent)] text-[var(--accent)] font-medium hover:bg-[var(--accent)] hover:text-white transition-colors text-sm"
              >
                Solicitar servicio
              </Link>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}
