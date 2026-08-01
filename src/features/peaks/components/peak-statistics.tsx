import { CalendarCheck2, CalendarDays, Clock3, Footprints, Gauge, Mountain, Route } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { formatDistance, formatElevation } from "@/features/adventures/presentation/formatters";
import type { PeakProfile } from "../domain/peak";
import { formatCompactDuration, formatStatDate } from "../presentation/formatters";

export function PeakStatistics({ peak }: { peak: PeakProfile }) {
  const { stats } = peak;
  const items = [
    { icon: Mountain, label: "Ascensiones", value: stats.ascentCount.toString(), accent: true },
    { icon: CalendarDays, label: "Primera ascensión", value: formatStatDate(stats.firstAscent) },
    { icon: CalendarCheck2, label: "Última ascensión", value: formatStatDate(stats.latestAscent) },
    { icon: Gauge, label: "Mejor tiempo", value: formatCompactDuration(stats.bestTime) },
    { icon: Clock3, label: "Tiempo medio", value: formatCompactDuration(stats.averageTime) },
    { icon: Footprints, label: "Desnivel acumulado", value: formatElevation(stats.totalElevation) },
    { icon: Route, label: "Kilómetros recorridos", value: formatDistance(stats.totalDistance) },
  ];

  return (
    <section className="overflow-hidden rounded-[2rem] bg-[#111713] p-5 text-white shadow-[0_28px_90px_rgba(15,31,23,.2)] sm:p-7 md:p-9">
      <div className="mb-7 flex items-end justify-between gap-5">
        <div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-lime">Tu historia aquí</p><h2 className="mt-1.5 text-3xl font-semibold tracking-[-.055em] sm:text-4xl">Estadísticas personales.</h2></div>
        <span className="hidden text-xs text-white/35 sm:block">Solo cuentan tus ascensiones</span>
      </div>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => <Statistic key={item.label} {...item} />)}
      </div>
    </section>
  );
}

function Statistic({ icon: Icon, label, value, accent = false }: { icon: LucideIcon; label: string; value: string; accent?: boolean }) {
  return (
    <div className={`min-h-36 rounded-[1.35rem] border p-4 sm:min-h-40 sm:p-5 ${accent ? "border-lime/30 bg-lime text-forest" : "border-white/[.08] bg-white/[.055]"}`}>
      <Icon size={17} strokeWidth={1.8} className={accent ? "text-forest" : "text-lime"} />
      <div className="mt-8"><span className={`block text-[9px] font-bold uppercase tracking-[.13em] ${accent ? "text-forest/55" : "text-white/38"}`}>{label}</span><strong className="mt-1.5 block text-sm font-semibold leading-tight sm:text-base">{value}</strong></div>
    </div>
  );
}

