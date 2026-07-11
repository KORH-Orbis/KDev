interface Photo {
  id: string;
  url: string;
  caption: string | null;
  createdAt: string;
}

interface PhotoLightboxProps {
  photos: Photo[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function PhotoLightbox({ photos, currentIndex, onClose, onPrev, onNext }: PhotoLightboxProps) {
  const photo = photos[currentIndex];
  if (!photo) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-10"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {photos.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            className="absolute left-4 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-10"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            className="absolute right-4 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-10"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </>
      )}

      <div
        className="max-w-[90vw] max-h-[90vh] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={photo.url}
          alt={photo.caption || "Foto del equipo"}
          className="max-w-full max-h-[80vh] object-contain rounded-lg"
        />
        {photo.caption && (
          <p className="text-white/70 text-sm mt-4 text-center">{photo.caption}</p>
        )}
        <p className="text-white/50 text-xs mt-2">
          {currentIndex + 1} / {photos.length}
        </p>
      </div>
    </div>
  );
}
