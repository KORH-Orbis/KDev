import { useState, FormEvent } from "react";

interface ClientOption {
  id: string;
  name: string;
}

interface DeviceFormProps {
  clients: ClientOption[];
  clientsLoading: boolean;
  initialData?: {
    type?: string;
    brand?: string;
    model?: string;
    serialNumber?: string;
    imei?: string;
    color?: string;
    accessories?: string;
    notes?: string;
  };
  onSubmit: (data: {
    clientId: string;
    type: string;
    brand: string;
    model: string;
    serialNumber: string;
    imei: string;
    color: string;
    accessories: string;
    notes: string;
  }) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
  hideClient?: boolean;
  fixedClientId?: string;
}

const deviceTypes = [
  { value: "PC", label: "PC de escritorio" },
  { value: "LAPTOP", label: "Portátil" },
  { value: "PHONE", label: "Teléfono" },
  { value: "TABLET", label: "Tablet" },
  { value: "OTHER", label: "Otro" },
];

export default function DeviceForm({
  clients,
  clientsLoading,
  initialData,
  onSubmit,
  onCancel,
  loading,
  hideClient,
  fixedClientId,
}: DeviceFormProps) {
  const [clientId, setClientId] = useState(fixedClientId || "");
  const [type, setType] = useState(initialData?.type || "");
  const [brand, setBrand] = useState(initialData?.brand || "");
  const [model, setModel] = useState(initialData?.model || "");
  const [serialNumber, setSerialNumber] = useState(initialData?.serialNumber || "");
  const [imei, setImei] = useState(initialData?.imei || "");
  const [color, setColor] = useState(initialData?.color || "");
  const [accessories, setAccessories] = useState(initialData?.accessories || "");
  const [notes, setNotes] = useState(initialData?.notes || "");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onSubmit({ clientId: fixedClientId || clientId, type, brand, model, serialNumber, imei, color, accessories, notes });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {!hideClient && (
        <div>
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Cliente *</label>
          <select
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg bg-[var(--bg)] border border-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-colors"
          >
            <option value="">{clientsLoading ? "Cargando..." : "Seleccionar cliente"}</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Tipo *</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-lg bg-[var(--bg)] border border-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-colors"
        >
          <option value="">Seleccionar tipo</option>
          {deviceTypes.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Marca</label>
          <input type="text" value={brand} onChange={(e) => setBrand(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-[var(--bg)] border border-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-colors"
            placeholder="Dell, Samsung..." />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Modelo</label>
          <input type="text" value={model} onChange={(e) => setModel(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-[var(--bg)] border border-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-colors"
            placeholder="Latitude 5490..." />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">N° de serie</label>
          <input type="text" value={serialNumber} onChange={(e) => setSerialNumber(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-[var(--bg)] border border-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-colors"
            placeholder="SN-123456" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">IMEI</label>
          <input type="text" value={imei} onChange={(e) => setImei(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-[var(--bg)] border border-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-colors"
            placeholder="Solo para teléfonos" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Color</label>
          <input type="text" value={color} onChange={(e) => setColor(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-[var(--bg)] border border-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-colors"
            placeholder="Negro, Plateado..." />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Accesorios</label>
          <input type="text" value={accessories} onChange={(e) => setAccessories(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-[var(--bg)] border border-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-colors"
            placeholder="Cargador, funda, auriculares" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Notas</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full px-4 py-3 rounded-lg bg-[var(--bg)] border border-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-colors resize-none"
          placeholder="Estado físico, detalles..." />
      </div>

      <div className="flex gap-3 justify-end pt-2">
        <button type="button" onClick={onCancel}
          className="px-5 py-3 rounded-lg border border-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors text-sm font-medium">
          Cancelar
        </button>
        <button type="submit" disabled={loading}
          className="px-5 py-3 rounded-lg bg-[var(--accent)] text-white font-medium hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50 text-sm">
          {loading ? "Guardando..." : "Guardar dispositivo"}
        </button>
      </div>
    </form>
  );
}
