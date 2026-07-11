import { useState, useEffect } from "react";

interface Device {
  id: string;
  type: string;
  brand: string | null;
  model: string | null;
  serialNumber: string | null;
}

interface DeviceSelectProps {
  clientId: string;
  value: string;
  onChange: (deviceId: string) => void;
  onRegisterNew: () => void;
}

export default function DeviceSelect({ clientId, value, onChange, onRegisterNew }: DeviceSelectProps) {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!clientId) {
      setDevices([]);
      return;
    }
    setLoading(true);
    fetch(`/api/devices?clientId=${clientId}`)
      .then((res) => res.json())
      .then((json) => setDevices(json.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [clientId]);

  return (
    <div>
      <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
        Dispositivo (opcional)
      </label>
      <div className="flex gap-3">
        <select
          value={value}
          onChange={(e) => {
            if (e.target.value === "__new__") {
              onRegisterNew();
            } else {
              onChange(e.target.value);
            }
          }}
          className="flex-1 px-4 py-3 rounded-lg bg-[var(--bg)] border border-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-colors"
        >
          <option value="">Sin dispositivo vinculado</option>
          {loading ? (
            <option disabled>Cargando...</option>
          ) : (
            devices.map((d) => (
              <option key={d.id} value={d.id}>
                {[d.type, d.brand, d.model, d.serialNumber].filter(Boolean).join(" — ")}
              </option>
            ))
          )}
          <option value="__new__">+ Registrar nuevo dispositivo</option>
        </select>
      </div>
    </div>
  );
}
