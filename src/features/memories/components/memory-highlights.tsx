import Link from "next/link";
import { ArrowUpRight, CalendarHeart, Camera, Mountain } from "lucide-react";
import { formatDate } from "@/features/adventures/presentation/formatters";
import type { AdventureMemory } from "../domain/memory";
import { MemoryPhoto } from "./memory-photo";
import { MemoryReveal } from "./memory-reveal";

export function MemoryHighlights({
  anniversary,
  bestPhotograph,
  latestSummit,
}: {
  anniversary: AdventureMemory | null;
  bestPhotograph: AdventureMemory | null;
  latestSummit: AdventureMemory | null;
}) {
  if (!bestPhotograph) return null;

  return (
    <section className="mt-10 sm:mt-14">
      {anniversary && <Anniversary memory={anniversary} />}

      <div className="mb-5 mt-12 flex items-end justify-between gap-4 sm:mb-6 sm:mt-16">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[.2em] text-moss">Elegidos para ti</p>
          <h2 className="mt-1.5 text-3xl font-semibold tracking-[-.055em] sm:text-4xl">Momentos que se quedan.</h2>
        </div>
        <span className="hidden text-xs text-ink/35 sm:block">Tu álbum, curado automáticamente</span>
      </div>

      <div className={`grid gap-4 sm:gap-5 ${latestSummit ? "md:grid-cols-[1.35fr_.85fr]" : ""}`}>
        <MemoryReveal>
          <Link
            href={`/adventures/${bestPhotograph.adventure.id}`}
            className="memory-highlight group relative block min-h-[27rem] overflow-hidden rounded-[2rem] shadow-[0_24px_70px_rgba(18,32,25,.15)] sm:min-h-[32rem]"
          >
            <MemoryPhoto
              src={bestPhotograph.cover.src}
              alt={bestPhotograph.cover.alt}
              sizes="(max-width: 768px) 100vw, 650px"
              className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,14,11,.06),rgba(9,14,11,.06)_42%,rgba(9,14,11,.82))]" />
            <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-white/20 bg-black/20 px-3.5 py-2 text-[10px] font-bold uppercase tracking-[.16em] text-white backdrop-blur-xl sm:left-6 sm:top-6">
              <Camera size={14} /> Tu mejor fotografía
            </div>
            <div className="absolute inset-x-5 bottom-5 text-white sm:inset-x-6 sm:bottom-6">
              <p className="text-xs text-white/58">Portada de {formatDate(bestPhotograph.adventure.fecha)}</p>
              <div className="mt-1 flex items-end justify-between gap-4">
                <h3 className="max-w-lg text-3xl font-semibold leading-none tracking-[-.055em] sm:text-4xl">{bestPhotograph.adventure.titulo}</h3>
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-ink transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"><ArrowUpRight size={18} /></span>
              </div>
            </div>
          </Link>
        </MemoryReveal>

        {latestSummit && <LatestSummit memory={latestSummit} />}
      </div>
    </section>
  );
}

function Anniversary({ memory }: { memory: AdventureMemory }) {
  return (
    <MemoryReveal>
      <Link
        href={`/adventures/${memory.adventure.id}`}
        className="memory-anniversary group relative grid min-h-[32rem] overflow-hidden rounded-[2rem] bg-forest shadow-[0_26px_85px_rgba(20,48,35,.2)] sm:min-h-[36rem] md:min-h-[30rem] md:grid-cols-[.95fr_1.05fr]"
      >
        <div className="relative min-h-[20rem] overflow-hidden md:order-2 md:min-h-full">
          <MemoryPhoto src={memory.cover.src} alt={memory.cover.alt} sizes="(max-width: 768px) 100vw, 550px" className="object-cover transition-transform duration-[1.3s] ease-out group-hover:scale-[1.035]" />
          <div className="absolute inset-0 bg-gradient-to-t from-forest via-transparent to-transparent md:bg-gradient-to-r md:from-forest/70 md:via-transparent md:to-transparent" />
        </div>
        <div className="relative z-10 flex flex-col justify-end p-6 text-white sm:p-9 md:order-1 md:justify-center md:p-10 lg:p-12">
          <span className="mb-auto flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-2 text-[10px] font-bold uppercase tracking-[.18em] text-lime backdrop-blur-xl md:mb-12">
            <CalendarHeart size={14} /> Hace un año
          </span>
          <p className="text-xs text-white/50">{formatDate(memory.adventure.fecha)}</p>
          <h2 className="mt-2 max-w-md text-[2.45rem] font-semibold leading-[.96] tracking-[-.06em] sm:text-5xl">Parece que fue ayer.</h2>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/62">Volviste de {memory.adventure.titulo} con algo más que kilómetros. Hoy PeakBook te lo devuelve.</p>
          <span className="mt-7 inline-flex w-fit items-center gap-2 text-xs font-semibold text-white">Revivir la aventura <ArrowUpRight size={15} /></span>
        </div>
      </Link>
    </MemoryReveal>
  );
}

function LatestSummit({ memory }: { memory: AdventureMemory }) {
  const summit = memory.peaks[memory.peaks.length - 1];
  return (
    <MemoryReveal delay={90}>
      <Link
        href={`/adventures/${memory.adventure.id}`}
        className="memory-highlight group relative block min-h-[27rem] overflow-hidden rounded-[2rem] bg-ink shadow-[0_24px_70px_rgba(18,32,25,.15)] sm:min-h-[32rem]"
      >
        <MemoryPhoto src={memory.cover.src} alt={`Última cima conseguida: ${summit.nombre}`} sizes="(max-width: 768px) 100vw, 420px" className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,14,11,.04),rgba(9,14,11,.18)_40%,rgba(9,14,11,.9))]" />
        <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-white/20 bg-black/20 px-3.5 py-2 text-[10px] font-bold uppercase tracking-[.16em] text-white backdrop-blur-xl sm:left-6 sm:top-6"><Mountain size={14} /> Última cima</div>
        <div className="absolute inset-x-5 bottom-5 text-white sm:inset-x-6 sm:bottom-6">
          <p className="text-xs text-lime">{summit.altitud.toLocaleString("es-ES")} m</p>
          <h3 className="mt-1 text-3xl font-semibold leading-none tracking-[-.055em] sm:text-4xl">{summit.nombre}</h3>
          <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-white/55">Conseguida durante {memory.adventure.titulo}</p>
        </div>
      </Link>
    </MemoryReveal>
  );
}

