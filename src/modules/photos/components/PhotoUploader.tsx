import { useState, useRef } from "react";

interface PhotoUploaderProps {
  repairOrderId: string;
  onUploaded: () => void;
  onCancel: () => void;
}

export default function PhotoUploader({ repairOrderId, onUploaded, onCancel }: PhotoUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    if (f) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(f);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async () => {
    if (!file) return;
    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("repairOrderId", repairOrderId);
      if (caption) formData.append("caption", caption);

      const res = await fetch("/api/photos/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        onUploaded();
      } else {
        const json = await res.json();
        setError(json.error || "Error al subir la foto");
      }
    } catch {
      setError("Error de conexión");
    }

    setUploading(false);
  };

  return (
    <div className="space-y-4">
      <div
        onClick={() => fileRef.current?.click()}
        className="border-2 border-dashed border-[var(--bg-secondary)] rounded-xl p-6 text-center cursor-pointer hover:border-[var(--accent)] transition-colors"
      >
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        {preview ? (
          <img
            src={preview}
            alt="Previsualización"
            className="max-h-48 mx-auto rounded-lg object-contain"
          />
        ) : (
          <div>
            <svg className="h-10 w-10 mx-auto mb-3 text-[var(--text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            <p className="text-sm text-[var(--text-secondary)]">Hacé clic para seleccionar una foto</p>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
          Descripción
        </label>
        <input
          type="text"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder='Ej: "Daño en pantalla", "Cargador incluido"'
          className="w-full px-4 py-3 rounded-lg bg-[var(--bg)] border border-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-colors"
        />
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-3 justify-end">
        <button
          onClick={onCancel}
          disabled={uploading}
          className="px-4 py-2 rounded-lg border border-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors text-sm"
        >
          Cancelar
        </button>
        <button
          onClick={handleSubmit}
          disabled={!file || uploading}
          className="px-4 py-2 rounded-lg bg-[var(--accent)] text-white text-sm font-medium hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50"
        >
          {uploading ? "Subiendo..." : "Subir foto"}
        </button>
      </div>
    </div>
  );
}
