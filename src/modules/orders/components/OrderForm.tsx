import { useState, useEffect, FormEvent } from "react";
import DeviceSelect from "@/modules/devices/components/DeviceSelect";

interface ClientOption {
  id: string;
  name: string;
}

interface OrderFormProps {
  clients: ClientOption[];
  clientsLoading: boolean;
  onSubmit: (data: {
    clientId: string;
    deviceType: string;
    deviceBrand: string;
    deviceModel: string;
    deviceSerial: string;
    deviceId?: string;
    issue: string;
    notes: string;
    guaranteeDays: number;
  }) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

const deviceTypes = [
  { value: "PC", label: "PC de escritorio" },
  { value: "LAPTOP", label: "Portátil" },
  { value: "PHONE", label: "Teléfono" },
  { value: "TABLET", label: "Tablet" },
  { value: "OTHER", label: "Otro" },
];

export default function OrderForm({ clients, clientsLoading, onSubmit, onCancel, loading }: OrderFormProps) {
  const [clientId, setClientId] = useState("");
  const [deviceType, setDeviceType] = useState("");
  const [deviceBrand, setDeviceBrand] = useState("");
  const [deviceModel, setDeviceModel] = useState("");
  const [deviceSerial, setDeviceSerial] = useState("");
  const [issue, setIssue] = useState("");
  const [notes, setNotes] = useState("");
  const [guaranteeDays, setGuaranteeDays] = useState(10);
  const [deviceId, setDeviceId] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onSubmit({
      clientId,
      deviceType,
      deviceBrand,
      deviceModel,
      deviceSerial,
      deviceId: deviceId || undefined,
      issue,
      notes,
      guaranteeDays,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="clientId" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
          Cliente *
        </label>
        <select
          id="clientId"
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-lg bg-[var(--bg)] border border-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-colors"
        >
          <option value="">{clientsLoading ? "Cargando..." : "Seleccionar cliente"}</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {clientId && (
        <DeviceSelect
          clientId={clientId}
          value={deviceId}
          onChange={setDeviceId}
          onRegisterNew={() => {
            const w = window as any;
            if (w.__orderFormClientId) return;
            w.__orderFormClientId = clientId;
          }}
        />
      )}

      <div>
        <label htmlFor="deviceType" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
          Tipo de dispositivo *
        </label>
        <select
          id="deviceType"
          value={deviceType}
          onChange={(e) => setDeviceType(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-lg bg-[var(--bg)] border border-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-colors"
        >
          <option value="">Seleccionar tipo</option>
          {deviceTypes.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="deviceBrand" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
            Marca
          </label>
          <input
            type="text"
            id="deviceBrand"
            value={deviceBrand}
            onChange={(e) => setDeviceBrand(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-[var(--bg)] border border-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-colors"
            placeholder="Dell, HP, Samsung..."
          />
        </div>
        <div>
          <label htmlFor="deviceModel" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
            Modelo
          </label>
          <input
            type="text"
            id="deviceModel"
            value={deviceModel}
            onChange={(e) => setDeviceModel(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-[var(--bg)] border border-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-colors"
            placeholder="Latitude 5490, Galaxy S23..."
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="deviceSerial" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
            N° de serie
          </label>
          <input
            type="text"
            id="deviceSerial"
            value={deviceSerial}
            onChange={(e) => setDeviceSerial(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-[var(--bg)] border border-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-colors"
            placeholder="SN-123456"
          />
        </div>
        <div>
          <label htmlFor="guaranteeDays" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
            Días de garantía
          </label>
          <input
            type="number"
            id="guaranteeDays"
            value={guaranteeDays}
            onChange={(e) => setGuaranteeDays(Number(e.target.value))}
            min={0}
            max={365}
            className="w-full px-4 py-3 rounded-lg bg-[var(--bg)] border border-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-colors"
          />
        </div>
      </div>

      <div>
        <label htmlFor="issue" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
          Problema reportado *
        </label>
        <textarea
          id="issue"
          value={issue}
          onChange={(e) => setIssue(e.target.value)}
          required
          rows={4}
          className="w-full px-4 py-3 rounded-lg bg-[var(--bg)] border border-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-colors resize-none"
          placeholder="Describe el problema del equipo..."
        />
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
          Notas internas
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full px-4 py-3 rounded-lg bg-[var(--bg)] border border-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-colors resize-none"
          placeholder="Notas para el técnico..."
        />
      </div>

      <div className="flex gap-3 justify-end pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 rounded-lg border border-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors text-sm font-medium"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 rounded-lg bg-[var(--accent)] text-white font-medium hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          {loading ? "Creando..." : "Crear orden"}
        </button>
      </div>
    </form>
  );
}
