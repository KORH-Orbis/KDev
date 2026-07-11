import { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import Link from "next/link";
import Layout from "@/modules/core/components/Layout";
import DeviceTable from "@/modules/devices/components/DeviceTable";
import { config } from "@/modules/core/lib/config";

export default function DevicesListPage() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchDevices = useCallback(async (searchTerm?: string) => {
    setLoading(true);
    try {
      const params = searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : "";
      const res = await fetch(`/api/devices${params}`);
      const json = await res.json();
      setDevices(json.data || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchDevices(); }, [fetchDevices]);

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); fetchDevices(search); };

  return (
    <>
      <Head><title>{`Dispositivos - ${config.appName}`}</title></Head>
      <Layout>
        <section className="py-10 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Dispositivos</h1>
                <p className="text-[var(--text-secondary)]">{devices.length} dispositivo{devices.length !== 1 ? "s" : ""}</p>
              </div>
              <Link href="/admin/dispositivos/nuevo" className="inline-flex items-center px-5 py-3 rounded-lg bg-[var(--accent)] text-white font-medium hover:bg-[var(--accent-hover)] transition-colors text-sm">
                + Nuevo dispositivo
              </Link>
            </div>
            <div className="mb-6">
              <form onSubmit={handleSearch} className="flex gap-3">
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar por marca, modelo, serie, IMEI o cliente..."
                  className="flex-1 px-4 py-3 rounded-lg bg-[var(--bg)] border border-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-colors text-sm" />
                <button type="submit" className="px-5 py-3 rounded-lg border border-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors text-sm font-medium">Buscar</button>
              </form>
            </div>
            <div className="rounded-2xl bg-[var(--card-bg)] border border-[var(--bg-secondary)]">
              <DeviceTable devices={devices} loading={loading} />
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}
