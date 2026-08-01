"use client";

import Link from "next/link";
import { ArrowLeft, Check, Circle, Compass, Flag, Globe2, Gauge, MapPin, Mountain, Navigation } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { ScrollReveal } from "@/components/scroll-reveal";
import { formatDifficulty } from "@/features/adventures/presentation/formatters";
import { usePeakAlbum } from "../application/use-peak-album";
import { formatCoordinates, formatPeakAltitude } from "../presentation/formatters";
import { PeakAscentTimeline } from "./peak-ascent-timeline";
import { PeakGallery } from "./peak-gallery";
import { PeakMap } from "./peak-map";
import { PeakPhoto } from "./peak-photo";
import { PeakStatistics } from "./peak-statistics";

export function PeakDetailScreen({ id }: { id: string }) {
  const { peaks, isLoading } = usePeakAlbum();
  const peak = peaks.find((item) => item.id === id);

  if (!peak && isLoading) return <AppShell><div className="h-[40rem] animate-pulse rounded-[2rem] bg-forest/10" /></AppShell>;
  if (!peak) return <AppShell><div className="grid min-h-[34rem] place-items-center rounded-[2rem] bg-white p-8 text-center shadow-card"><div><Mountain size={25} className="mx-auto text-forest" /><h1 className="mt-4 text-2xl font-semibold">Cima no encontrada</h1><p className="mt-2 text-sm text-ink/45">Puede que todavía no forme parte de tu atlas.</p><Link href="/peaks" className="mt-6 inline-flex rounded-full bg-forest px-5 py-3 text-xs font-semibold text-white">Volver a Cimas</Link></div></div></AppShell>;

  const conquered = peak.status === "conquered";
  return (
    <AppShell>
      <article>
        <section className="peak-detail-hero relative min-h-[43rem] overflow-hidden rounded-[2rem] bg-ink text-white shadow-[0_32px_105px_rgba(15,31,23,.24)] sm:min-h-[48rem]">
          <PeakPhoto src={peak.heroImage} alt={`${peak.name}, protagonista de PeakBook`} priority sizes="(max-width: 1152px) 100vw, 1056px" className="object-cover" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,12,9,.25)_0%,rgba(7,12,9,.04)_34%,rgba(7,12,9,.9)_100%)]" />
          <div className="absolute inset-x-5 top-5 flex items-center justify-between sm:inset-x-7 sm:top-7">
            <Link href="/peaks" aria-label="Volver a Cimas" className="tap-scale grid h-11 w-11 place-items-center rounded-full border border-white/25 bg-black/20 text-white shadow-lg backdrop-blur-xl"><ArrowLeft size={18} /></Link>
            <span className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-[10px] font-bold uppercase tracking-[.16em] backdrop-blur-xl ${conquered ? "border-lime/30 bg-forest/60 text-lime" : "border-white/25 bg-black/20 text-white"}`}>{conquered ? <Check size={14} /> : <Circle size={13} />} {conquered ? "Conseguida" : "Pendiente"}</span>
          </div>

          <div className="absolute inset-x-5 bottom-6 sm:inset-x-8 sm:bottom-8 md:inset-x-10 md:bottom-10">
            <p className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.18em] text-lime"><MapPin size={14} /> {peak.province} · {peak.country}</p>
            <h1 className="max-w-4xl text-[4rem] font-semibold leading-[.82] tracking-[-.085em] sm:text-7xl md:text-[6rem]">{peak.name}</h1>
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-semibold text-white/72"><span className="flex items-center gap-2"><Mountain size={17} className="text-lime" /> {formatPeakAltitude(peak.altitude)}</span><span className="hidden h-1 w-1 rounded-full bg-white/35 sm:block" /><span>{formatDifficulty(peak.difficulty)}</span></div>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/58 sm:text-base">{peak.description}</p>
          </div>
        </section>

        <div className="mt-7 space-y-14 sm:mt-10 sm:space-y-20">
          <ScrollReveal className="grid gap-5 lg:grid-cols-[.78fr_1.22fr]">
            <section className="flex min-h-[28rem] flex-col rounded-[2rem] border border-black/[.04] bg-white p-6 shadow-card sm:min-h-[32rem] sm:p-8">
              <div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-moss">Identidad de la cima</p><h2 className="mt-1.5 text-3xl font-semibold tracking-[-.055em]">Un lugar único.</h2></div>
              <div className="mt-8 space-y-1">
                <IdentityRow icon={Flag} label="Territorio" value={`${peak.province}, ${peak.country}`} />
                <IdentityRow icon={Navigation} label="Coordenadas" value={formatCoordinates(peak.coordinates.latitude, peak.coordinates.longitude)} />
                <IdentityRow icon={Gauge} label="Dificultad" value={formatDifficulty(peak.difficulty)} />
                <IdentityRow icon={Globe2} label="Identificador global" value={peak.globeId} monospace />
              </div>
              <div className="mt-auto rounded-[1.3rem] bg-forest/[.065] p-4"><p className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[.16em] text-forest/55"><Compass size={13} /> Vector planetario</p><p className="mt-2 font-mono text-[10px] leading-relaxed text-forest/70">x {peak.globePosition.x.toFixed(6)} · y {peak.globePosition.y.toFixed(6)} · z {peak.globePosition.z.toFixed(6)}</p></div>
            </section>
            <PeakMap peak={peak} />
          </ScrollReveal>

          <ScrollReveal><PeakStatistics peak={peak} /></ScrollReveal>
          <PeakAscentTimeline peak={peak} />
          <PeakGallery peak={peak} />

          <ScrollReveal>
            <blockquote className="py-8 text-center sm:py-12"><p className="mx-auto max-w-3xl text-[2.6rem] font-semibold leading-[.95] tracking-[-.065em] text-forest sm:text-5xl">“La montaña permanece. Lo que cambia eres tú cada vez que vuelves.”</p><span className="mt-5 block text-[10px] font-bold uppercase tracking-[.2em] text-moss">PeakBook · {peak.name}</span></blockquote>
          </ScrollReveal>
        </div>
      </article>
    </AppShell>
  );
}

function IdentityRow({ icon: Icon, label, value, monospace = false }: { icon: LucideIcon; label: string; value: string; monospace?: boolean }) {
  return <div className="flex items-start gap-3 border-b border-black/[.055] py-4 last:border-0"><span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-forest/[.07] text-forest"><Icon size={15} /></span><div className="min-w-0"><span className="block text-[9px] font-bold uppercase tracking-[.13em] text-moss">{label}</span><strong className={`mt-1 block break-all text-xs font-semibold leading-relaxed ${monospace ? "font-mono text-[10px]" : ""}`}>{value}</strong></div></div>;
}

