import StatusBadge from "./StatusBadge";

interface TimelineEvent {
  status: string;
  date?: string;
  description?: string;
}

interface HistoryTimelineProps {
  order: {
    status: string;
    createdAt: string;
    completedAt?: string | null;
    deliveredAt?: string | null;
  };
}

export default function HistoryTimeline({ order }: HistoryTimelineProps) {
  const events: TimelineEvent[] = [
    {
      status: "RECEIVED",
      date: order.createdAt,
      description: "Orden recibida",
    },
  ];

  if (order.status !== "RECEIVED" || order.completedAt) {
    events.push({
      status: "DIAGNOSING",
      description: "En diagnóstico",
    });
  }

  if (order.completedAt) {
    events.push({
      status: "REPAIRED",
      date: order.completedAt,
      description: "Reparación completada",
    });
  }

  if (order.deliveredAt) {
    events.push({
      status: "DELIVERED",
      date: order.deliveredAt,
      description: "Entregado al cliente",
    });
  }

  events.push({
    status: order.status,
    description: "Estado actual",
  });

  return (
    <div className="space-y-0">
      {events.map((event, i) => (
        <div key={i} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className={`w-3 h-3 rounded-full border-2 ${i === events.length - 1 ? "border-[var(--accent)] bg-[var(--accent)]" : "border-[var(--bg-secondary)] bg-[var(--bg-secondary)]"}`} />
            {i < events.length - 1 && <div className="w-0.5 h-8 bg-[var(--bg-secondary)]" />}
          </div>
          <div className="pb-4 -mt-0.5">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-[var(--text-primary)]">
                {event.description}
              </p>
              <StatusBadge status={event.status} />
            </div>
            {event.date && (
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                {new Date(event.date).toLocaleDateString("es-CO", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
