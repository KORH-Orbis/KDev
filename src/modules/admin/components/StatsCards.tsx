interface StatsCardsProps {
  ordenesHoy: number;
  recaudadoHoy: number;
  recaudadoMes: number;
}

export default function StatsCards({ ordenesHoy, recaudadoHoy, recaudadoMes }: StatsCardsProps) {
  const cards = [
    {
      label: "Órdenes hoy",
      value: ordenesHoy,
      gradient: "from-cyan-500/20 via-cyan-500/10 to-transparent",
      border: "border-cyan-500/30",
      glow: "shadow-[0_0_30px_-5px_rgba(6,182,212,0.15)]",
      textColor: "text-cyan-300",
      subtitle: "nuevas",
    },
    {
      label: "Recaudado hoy",
      value: `$${recaudadoHoy.toLocaleString("es-CO")}`,
      valueSize: recaudadoHoy > 99999 ? "text-4xl" : "text-5xl",
      gradient: "from-emerald-500/20 via-emerald-500/10 to-transparent",
      border: "border-emerald-500/30",
      glow: "shadow-[0_0_30px_-5px_rgba(16,185,129,0.15)]",
      textColor: "text-emerald-300",
      subtitle: "hoy",
    },
    {
      label: "Recaudado este mes",
      value: `$${recaudadoMes.toLocaleString("es-CO")}`,
      valueSize: recaudadoMes > 99999 ? "text-4xl" : "text-5xl",
      gradient: "from-violet-500/20 via-violet-500/10 to-transparent",
      border: "border-violet-500/30",
      glow: "shadow-[0_0_30px_-5px_rgba(139,92,246,0.15)]",
      textColor: "text-violet-300",
      subtitle: "este mes",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`relative overflow-hidden p-6 rounded-3xl border ${card.border} ${card.glow} bg-gradient-to-br ${card.gradient} backdrop-blur-xl hover:scale-[1.02] transition-transform duration-300 animate-fadeIn group cursor-default`}
        >
          <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-white/20 group-hover:bg-white/40 transition-colors" />
          <p className="text-xs font-medium text-white/40 uppercase tracking-widest mb-3">{card.label}</p>
          <p className={`${card.valueSize || "text-5xl"} font-extrabold ${card.textColor} tracking-tighter mb-1`}>
            {card.value}
          </p>
          <p className="text-xs text-white/30">{card.subtitle}</p>
          <div className={`absolute -bottom-6 -right-6 w-32 h-32 rounded-full ${card.textColor} opacity-[0.06] blur-2xl`} />
        </div>
      ))}
    </div>
  );
}
