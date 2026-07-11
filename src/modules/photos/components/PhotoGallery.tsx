import { useState } from "react";
import PhotoLightbox from "./PhotoLightbox";

interface Photo {
  id: string;
  url: string;
  caption: string | null;
  createdAt: string;
}

interface PhotoGalleryProps {
  photos: Photo[];
  loading: boolean;
}

export default function PhotoGallery({ photos, loading }: PhotoGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (loading) {
    return (
      <div className="text-center py-6 text-[var(--text-secondary)] text-sm">
        Cargando fotos...
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="text-center py-6 text-[var(--text-secondary)] text-sm">
        No hay fotos del equipo. Subí la primera.
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {photos.map((photo, i) => (
          <button
            key={photo.id}
            onClick={() => setLightboxIndex(i)}
            className="group relative aspect-square rounded-xl overflow-hidden bg-[var(--bg)] border border-[var(--bg-secondary)] hover:border-[var(--accent)] transition-colors"
          >
            <img
              src={photo.url}
              alt={photo.caption || "Foto del equipo"}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {photo.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                <p className="text-white text-xs truncate">{photo.caption}</p>
              </div>
            )}
          </button>
        ))}
      </div>

      {lightboxIndex !== null && (
        <PhotoLightbox
          photos={photos}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={() =>
            setLightboxIndex(
              lightboxIndex > 0 ? lightboxIndex - 1 : photos.length - 1
            )
          }
          onNext={() =>
            setLightboxIndex(
              lightboxIndex < photos.length - 1 ? lightboxIndex + 1 : 0
            )
          }
        />
      )}
    </>
  );
}
