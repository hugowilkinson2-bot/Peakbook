import Link from "next/link";
import { Clock3, Mountain, Route, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  formatDate,
  formatDistance,
  formatDuration,
  formatElevation,
} from "@/features/adventures/presentation/formatters";
import type { AdventureMemory } from "../domain/memory";
import { MemoryPhoto } from "./memory-photo";
import { MemoryReveal } from "./memory-reveal";

export function MemoryCard({ memory, index }: { memory: AdventureMemory; index: number }) {
  const { adventure, cover, peaks } = memory;
  const alignment = index % 2 === 0
    ? "md:w-[94%]"
    : "md:ml-auto md:w-[84%]";

  return (
    <MemoryReveal className={`relative pl-8 md:pl-14 ${alignment}`}>
      <span className="absolute left-[.15rem] top-12 z-10 grid h-5 w-5 place-items-center rounded-full border-[5px] border-canvas bg-forest shadow-[0_0_0_1px_rgba(21,60,44,.18)] md:left-[.65rem]">
        <span className="h-1.5 w-1.5 rounded-full bg-lime" />
      </span>

      <Link
        href={`/adventures/${adventure.id}`}
        aria-label={`Abrir el recuerdo ${adventure.titulo}`}
        className="memory-card group block overflow-hidden rounded-[2rem] bg-[#111713] text-white shadow-[0_30px_90px_rgba(15,31,23,.18)] ring-1 ring-black/[.04]"
      >
        <div className={`relative overflow-hidden ${index === 0 ? "aspect-[4/5] sm:aspect-[16/11]" : "aspect-[5/4] sm:aspect-[16/10]"}`}>
          <MemoryPhoto
            src={cover.src}
            alt={cover.alt}
            priority={index === 0}
            sizes="(max-width: 768px) calc(100vw - 52px), 860px"
            className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.035]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,14,10,.08)_15%,rgba(8,14,10,.12)_45%,rgba(8,14,10,.92)_100%)]" />

          <div className="absolute inset-x-4 top-4 flex items-center justify-between gap-3 sm:inset-x-6 sm:top-6">
            <span className="rounded-full border border-white/20 bg-black/20 px-3.5 py-2 text-[10px] font-bold uppercase tracking-[.17em] text-white/90 backdrop-blur-xl">
              {formatDate(adventure.fecha)}
            </span>
            <span className="rounded-full border border-white/20 bg-white/12 px-3 py-2 text-[10px] font-semibold text-white/80 backdrop-blur-xl">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>

          <div className="absolute inset-x-4 bottom-4 sm:inset-x-6 sm:bottom-6">
            <p className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[.18em] text-lime">
              <Mountain size={13} strokeWidth={2} />
              {peaks.length > 0 ? "Cimas conseguidas" : "Memoria de montaña"}
            </p>
            <h2 className="max-w-2xl text-[2rem] font-semibold leading-[.98] tracking-[-.055em] sm:text-4xl md:text-[2.75rem]">
              {adventure.titulo}
            </h2>
            {peaks.length > 0 && (
              <p className="mt-3 line-clamp-1 text-xs font-medium text-white/65 sm:text-sm">
                {peaks.map(({ nombre }) => nombre).join(" · ")}
              </p>
            )}
            <div className="mt-5 grid grid-cols-3 divide-x divide-white/15 rounded-[1.2rem] border border-white/15 bg-white/[.09] px-1 py-3.5 backdrop-blur-xl sm:max-w-xl sm:py-4">
              <MemoryMetric icon={Route} value={formatDistance(adventure.distancia)} label="Distancia" />
              <MemoryMetric icon={TrendingUp} value={formatElevation(adventure.desnivelPositivo)} label="Desnivel" />
              <MemoryMetric icon={Clock3} value={formatDuration(adventure.tiempo)} label="Tiempo" />
            </div>
          </div>
        </div>
      </Link>
    </MemoryReveal>
  );
}

function MemoryMetric({ icon: Icon, value, label }: { icon: LucideIcon; value: string; label: string }) {
  return (
    <div className="flex min-w-0 items-center justify-center gap-2 px-1.5 sm:px-3">
      <Icon size={15} strokeWidth={1.8} className="hidden shrink-0 text-lime min-[390px]:block" />
      <div className="min-w-0">
        <strong className="block truncate text-[11px] font-semibold sm:text-sm">{value}</strong>
        <span className="block text-[8px] text-white/45 sm:text-[10px]">{label}</span>
      </div>
    </div>
  );
}

