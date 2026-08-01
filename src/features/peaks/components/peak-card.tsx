import Link from "next/link";
import { ArrowUpRight, Check, Circle, Mountain, Route } from "lucide-react";
import { ScrollReveal } from "@/components/scroll-reveal";
import { formatDifficulty } from "@/features/adventures/presentation/formatters";
import type { PeakProfile } from "../domain/peak";
import { formatPeakAltitude } from "../presentation/formatters";
import { PeakPhoto } from "./peak-photo";

export function PeakCard({ peak, index }: { peak: PeakProfile; index: number }) {
  const featured = index === 0;
  return (
    <ScrollReveal className={featured ? "md:col-span-2" : ""} delay={Math.min(index * 60, 180)}>
      <Link
        href={`/peaks/${peak.id}`}
        aria-label={`Abrir la ficha de ${peak.name}`}
        className={`peak-card group relative block overflow-hidden rounded-[2rem] bg-ink text-white shadow-[0_26px_85px_rgba(16,31,23,.18)] ${featured ? "min-h-[34rem] sm:min-h-[38rem]" : "min-h-[31rem]"}`}
      >
        <PeakPhoto
          src={peak.heroImage}
          alt={`${peak.name}, ${formatPeakAltitude(peak.altitude)}`}
          sizes={featured ? "(max-width: 768px) 100vw, 1050px" : "(max-width: 768px) 100vw, 520px"}
          priority={featured}
          className="object-cover transition-transform duration-[1.3s] ease-out group-hover:scale-[1.035]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,14,10,.05)_5%,rgba(8,14,10,.08)_38%,rgba(8,14,10,.9)_100%)]" />
        <div className="absolute inset-x-5 top-5 flex items-start justify-between gap-3 sm:inset-x-6 sm:top-6">
          <span className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-[10px] font-bold uppercase tracking-[.16em] backdrop-blur-xl ${peak.status === "conquered" ? "border-lime/30 bg-forest/55 text-lime" : "border-white/20 bg-black/20 text-white/80"}`}>
            {peak.status === "conquered" ? <Check size={14} strokeWidth={2.5} /> : <Circle size={13} strokeWidth={2} />}
            {peak.status === "conquered" ? "Conseguida" : "Pendiente"}
          </span>
          <span className="grid h-11 w-11 place-items-center rounded-full border border-white/25 bg-white/90 text-ink shadow-lg transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"><ArrowUpRight size={18} /></span>
        </div>

        <div className="absolute inset-x-5 bottom-5 sm:inset-x-7 sm:bottom-7">
          <div className="mb-3 flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-[.16em] text-white/58">
            <span>{peak.province}</span><span className="h-1 w-1 rounded-full bg-lime" /><span>{peak.country}</span>
          </div>
          <div className="flex items-end justify-between gap-5">
            <div>
              <h2 className={`${featured ? "text-[3.2rem] sm:text-6xl" : "text-[2.55rem] sm:text-5xl"} font-semibold leading-[.9] tracking-[-.07em]`}>{peak.name}</h2>
              <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-white/75"><Mountain size={16} className="text-lime" /> {formatPeakAltitude(peak.altitude)}</p>
            </div>
            <div className="hidden shrink-0 items-center gap-3 rounded-[1.2rem] border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-xl min-[420px]:flex">
              <Route size={17} className="text-lime" />
              <div><strong className="block text-sm">{peak.stats.ascentCount}</strong><span className="text-[9px] text-white/45">{peak.stats.ascentCount === 1 ? "ascensión" : "ascensiones"}</span></div>
            </div>
          </div>
          <div className="mt-5 flex items-center justify-between border-t border-white/15 pt-4 text-[10px] text-white/48">
            <span>{formatDifficulty(peak.difficulty)}</span>
            <span>{peak.stats.ascentCount > 0 ? `${peak.stats.ascentCount} veces en tu historia` : "Aún por descubrir"}</span>
          </div>
        </div>
      </Link>
    </ScrollReveal>
  );
}

