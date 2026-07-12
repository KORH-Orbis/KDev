import { useEffect, useState } from "react";
import Head from "next/head";
import Layout from "@/modules/core/components/Layout";
import { config } from "@/modules/core/lib/config";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  service: string | null;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function MensajesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/admin/mensajes");
      const json = await res.json();
      setMessages(json.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMessages(); }, []);

  const markAsRead = async (id: string) => {
    await fetch(`/api/admin/mensajes/${id}`, { method: "PATCH" });
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read: true } : m)));
  };

  const deleteMessage = async (id: string) => {
    if (!confirm("¿Eliminar este mensaje?")) return;
    await fetch(`/api/admin/mensajes/${id}`, { method: "DELETE" });
    setMessages((prev) => prev.filter((m) => m.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  const unread = messages.filter((m) => !m.read).length;

  return (
    <>
      <Head><title>Mensajes - {config.appName}</title></Head>
      <Layout>
        <section className="py-10 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-[var(--text-primary)]">
                Mensajes
                {unread > 0 && (
                  <span className="ml-3 text-sm font-medium text-cyan-300 bg-cyan-500/10 px-3 py-1 rounded-full">
                    {unread} sin leer
                  </span>
                )}
              </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 space-y-2 max-h-[70vh] overflow-y-auto">
                {loading ? (
                  <p className="text-[var(--text-secondary)]">Cargando...</p>
                ) : messages.length === 0 ? (
                  <p className="text-[var(--text-secondary)]">No hay mensajes todavía.</p>
                ) : (
                  messages.map((msg) => (
                    <button
                      key={msg.id}
                      onClick={() => { setSelected(msg); if (!msg.read) markAsRead(msg.id); }}
                      className={`w-full text-left p-4 rounded-xl border transition-colors ${
                        selected?.id === msg.id
                          ? "border-[var(--accent)] bg-[var(--accent)]/5"
                          : "border-[var(--bg-secondary)] hover:border-[var(--accent)]/50"
                      } ${!msg.read ? "bg-[var(--accent)]/5" : ""}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-[var(--text-primary)] text-sm truncate">{msg.name}</span>
                        {!msg.read && <span className="w-2 h-2 rounded-full bg-cyan-400 flex-shrink-0" />}
                      </div>
                      <p className="text-xs text-[var(--text-secondary)] truncate">{msg.email}</p>
                      <p className="text-xs text-[var(--text-secondary)] mt-1">
                        {new Date(msg.createdAt).toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </button>
                  ))
                )}
              </div>

              <div className="lg:col-span-2">
                {selected ? (
                  <div className="p-6 sm:p-8 rounded-2xl bg-[var(--card-bg)] border border-[var(--bg-secondary)]">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h2 className="text-xl font-bold text-[var(--text-primary)]">{selected.name}</h2>
                        <p className="text-sm text-[var(--text-secondary)]">{selected.email}</p>
                        {selected.phone && <p className="text-sm text-[var(--text-secondary)]">{selected.phone}</p>}
                        {selected.service && (
                          <span className="inline-block mt-2 text-xs font-medium text-[var(--accent)] bg-[var(--accent)]/10 px-3 py-1 rounded-full">
                            {selected.service}
                          </span>
                        )}
                      </div>
                      <button onClick={() => deleteMessage(selected.id)} className="text-red-400 hover:text-red-300 text-sm">
                        Eliminar
                      </button>
                    </div>
                    <div className="p-4 rounded-xl bg-[var(--bg-secondary)]/50">
                      <p className="text-[var(--text-primary)] whitespace-pre-wrap">{selected.message}</p>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] mt-4">
                      {new Date(selected.createdAt).toLocaleString("es-AR")}
                    </p>
                  </div>
                ) : (
                  <div className="p-8 rounded-2xl bg-[var(--card-bg)] border border-[var(--bg-secondary)] text-center text-[var(--text-secondary)]">
                    Seleccioná un mensaje para verlo
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}
