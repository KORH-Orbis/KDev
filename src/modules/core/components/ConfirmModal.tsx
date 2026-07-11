interface ConfirmModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function ConfirmModal({ title, message, onConfirm, onCancel, loading }: ConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
      onClick={onCancel}>
      <div className="bg-[var(--card-bg)] rounded-2xl p-8 max-w-sm w-full border border-[var(--bg-secondary)] shadow-2xl animate-fadeIn"
        onClick={(e) => e.stopPropagation()}>
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <svg className="h-7 w-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">{title}</h3>
          <p className="text-sm text-[var(--text-secondary)]">{message}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel}
            className="flex-1 py-3 rounded-xl border border-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors font-medium text-sm">
            Cancelar
          </button>
          <button onClick={onConfirm} disabled={loading}
            className="flex-1 py-3 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-colors text-sm disabled:opacity-50">
            Sí, salir
          </button>
        </div>
      </div>
    </div>
  );
}
