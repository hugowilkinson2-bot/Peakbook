"use client";

import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { ResponsivePhoto } from "@/components/responsive-photo";
import { IconButton, SectionTitle } from "@/components/ui";
import { useAdventures } from "@/features/adventures/application/adventure-provider";
import { AdventureCard } from "@/features/adventures/components/adventure-card";
import { AdventureEmpty, AdventureError, AdventureLoading } from "@/features/adventures/components/adventure-states";
import { formatDate, formatDistance, formatDuration, formatElevation } from "@/features/adventures/presentation/formatters";
import { ArrowRight, CalendarDays, Clock3, Footprints, Mountain, Plus, Route, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export default function Home() {
  const { adventures, isLoading, error, reload } = useAdventures();
  const latest = adventures[0];
  const latestCover = latest?.photos.find(photo => photo.portada) ?? latest?.photos[0];
  const latestImage = latestCover?.url ?? latest?.peak?.fotoPrincipalUrl ?? "/peakbook-hero.png";
  const totalDistance = adventures.reduce((total,item)=>total+item.distancia,0);
  const totalElevation = adventures.reduce((total,item)=>total+item.desnivelPositivo,0);

  return <AppShell><PageHeader/><div className="stagger-in">
    <section className="premium-card relative min-h-[31rem] overflow-hidden rounded-[2rem] bg-forest shadow-[0_26px_80px_rgba(14,30,22,.2)] md:min-h-[35rem]">
      <ResponsivePhoto src={latestImage} fallbackSrc="/peakbook-hero.png" alt={latest ? `Portada de ${latest.peak?.nombre ?? latest.titulo}` : "Aventura de montaña al amanecer en los Pirineos"} priority sizes="(max-width: 1152px) 100vw, 1056px" className="object-cover"/>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,16,13,.12)_0%,rgba(10,16,13,.08)_35%,rgba(10,16,13,.88)_100%)]"/>
      <div className="absolute inset-x-5 top-5 flex items-center justify-between md:inset-x-7 md:top-7"><span className="rounded-full border border-white/20 bg-black/20 px-3.5 py-2 text-[10px] font-bold uppercase tracking-[.18em] text-white backdrop-blur-xl">{latest ? "Última aventura" : "PeakBook"}</span><Link href={latest?`/adventures/${latest.id}`:"/adventures/new"} aria-label={latest?"Ver última aventura":"Crear primera aventura"} className="tap-scale grid h-11 w-11 place-items-center rounded-full border border-white/25 bg-white/90 text-ink shadow-float backdrop-blur">{latest?<ArrowRight size={18}/>:<Plus size={18}/>}</Link></div>
      <div className="absolute inset-x-5 bottom-5 text-white md:inset-x-7 md:bottom-7">{isLoading ? <div className="h-28 animate-pulse rounded-2xl bg-white/10"/> : latest ? <><div className="mb-3 flex items-center gap-1.5 text-xs text-white/68"><CalendarDays size={14}/>{formatDate(latest.fecha)}</div><h1 className="max-w-xl text-[2.55rem] font-semibold leading-[.98] tracking-[-.06em] md:text-6xl">{latest.titulo}</h1><div className="mt-6 grid grid-cols-3 divide-x divide-white/15 rounded-[1.3rem] border border-white/15 bg-white/10 px-2 py-4 backdrop-blur-xl md:max-w-xl"><HeroMetric icon={Route} value={formatDistance(latest.distancia)} label="Distancia"/><HeroMetric icon={Mountain} value={formatElevation(latest.desnivelPositivo)} label="Desnivel"/><HeroMetric icon={Clock3} value={formatDuration(latest.tiempo)} label="Tiempo"/></div></> : <><p className="text-xs font-semibold uppercase tracking-[.18em] text-lime">Tu historia en la montaña</p><h1 className="mt-3 max-w-xl text-[2.55rem] font-semibold leading-[.98] tracking-[-.06em] md:text-6xl">Tu primera aventura empieza aquí.</h1><Link href="/adventures/new" className="tap-scale mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-xs font-semibold text-forest">Crear aventura<ArrowRight size={15}/></Link></>}</div>
    </section>

    <section className="my-8 grid grid-cols-3 gap-2.5 md:gap-4"><Stat icon={Footprints} value={formatDistance(totalDistance)} label="recorridos"/><Stat icon={TrendingUp} value={formatElevation(totalElevation)} label="ascendidos"/><Stat icon={Mountain} value={adventures.length.toString()} label="aventuras"/></section>

    {error && adventures.length === 0 ? <AdventureError message={error} onRetry={()=>void reload()}/> : isLoading ? <AdventureLoading cards={2}/> : adventures.length === 0 ? <AdventureEmpty/> : <section><SectionTitle eyebrow="Tu archivo" title="Aventuras recientes" action={<Link href="/adventures"><IconButton icon={ArrowRight} label="Ver todas las aventuras"/></Link>}/><div className="grid gap-5 md:grid-cols-2">{adventures.slice(0,2).map(adventure=><AdventureCard key={adventure.id} adventure={adventure} compact/>)}</div></section>}
  </div></AppShell>;
}

function HeroMetric({ icon: Icon, value, label }: { icon: LucideIcon; value: string; label: string }) { return <div className="flex items-center justify-center gap-2 px-1"><Icon size={17} strokeWidth={1.7} className="shrink-0 text-lime"/><div><strong className="block text-xs font-semibold sm:text-sm">{value}</strong><span className="block text-[9px] text-white/50 sm:text-[10px]">{label}</span></div></div>; }
function Stat({ icon: Icon, value, label }: { icon: LucideIcon; value: string; label: string }) { return <div className="premium-card rounded-[1.45rem] border border-black/[.035] bg-white p-4 shadow-card md:flex md:items-center md:gap-4 md:p-5"><span className="mb-5 grid h-9 w-9 place-items-center rounded-xl bg-forest/[.07] text-forest md:mb-0"><Icon size={17} strokeWidth={1.8}/></span><div><strong className="block text-sm font-semibold tracking-[-.04em] sm:text-lg md:text-xl">{value}</strong><span className="mt-0.5 block text-[9px] leading-tight text-ink/42 md:text-[11px]">{label}</span></div></div>; }
