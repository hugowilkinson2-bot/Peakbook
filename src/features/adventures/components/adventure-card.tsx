import Link from "next/link";
import { ResponsivePhoto } from "@/components/responsive-photo";
import { ArrowUpRight, Clock3, Mountain, Route } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Adventure } from "../domain/adventure";
import { formatDate, formatDifficulty, formatDistance, formatDuration, formatElevation } from "../presentation/formatters";

export function AdventureCard({ adventure, compact = false }: { adventure: Adventure; compact?: boolean }) {
  const cover = adventure.photos.find(photo => photo.portada) ?? adventure.photos[0];
  const image = cover?.url ?? adventure.peak?.fotoPrincipalUrl ?? "/peakbook-hero.png";
  return (
    <article className="premium-card group overflow-hidden rounded-[1.75rem] border border-black/[.035] bg-white shadow-card">
      <div className={`relative overflow-hidden ${compact ? "h-44" : "h-56 md:h-64"}`}>
        <ResponsivePhoto src={image} fallbackSrc="/peakbook-hero.png" alt={`Paisaje de ${adventure.peak?.nombre ?? adventure.titulo}`} sizes={compact ? "(max-width: 768px) 100vw, 50vw" : "100vw"} className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/15" />
        <div className="absolute inset-x-4 top-4 flex items-start justify-between">
          <span className="rounded-full border border-white/20 bg-black/20 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.12em] text-white backdrop-blur-xl">{formatDifficulty(adventure.dificultad)}</span>
          <Link href={`/adventures/${adventure.id}`} aria-label={`Abrir ${adventure.titulo}`} className="tap-scale grid h-10 w-10 place-items-center rounded-full border border-white/30 bg-white/90 text-ink shadow-sm backdrop-blur"><ArrowUpRight size={17} strokeWidth={1.9}/></Link>
        </div>
        <div className="absolute inset-x-5 bottom-5 text-white"><p className="text-[11px] font-medium text-white/70">{formatDate(adventure.fecha)}{adventure.peak ? ` · ${adventure.peak.altitud.toLocaleString("es-ES")} m` : ""}</p><h3 className="mt-1 text-xl font-semibold tracking-[-.035em]">{adventure.peak?.nombre ?? adventure.titulo}</h3></div>
      </div>
      <div className="grid grid-cols-3 divide-x divide-black/[.06] px-2 py-4 text-ink">
        <Metric icon={Route} value={formatDistance(adventure.distancia)} label="Distancia" />
        <Metric icon={Mountain} value={formatElevation(adventure.desnivelPositivo)} label="Desnivel" />
        <Metric icon={Clock3} value={formatDuration(adventure.tiempo)} label="Tiempo" />
      </div>
    </article>
  );
}

function Metric({ icon: Icon, value, label }: { icon: LucideIcon; value: string; label: string }) {
  return <div className="flex items-center justify-center gap-2 px-2"><Icon size={15} strokeWidth={1.8} className="shrink-0 text-moss"/><div><strong className="block text-xs font-semibold leading-none sm:text-sm">{value}</strong><span className="mt-1 block text-[9px] text-ink/40 sm:text-[10px]">{label}</span></div></div>;
}
