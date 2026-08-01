import Image from "next/image";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { RouteCard } from "@/components/route-card";
import { IconButton, SectionTitle } from "@/components/ui";
import { routes } from "@/lib/routes";
import { ArrowRight, Clock3, Flame, Footprints, MapPin, Mountain, Route, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export default function Home() {
  const latest = routes[0];
  return <AppShell><PageHeader/>
    <div className="stagger-in">
      <section className="premium-card relative min-h-[31rem] overflow-hidden rounded-[2rem] bg-forest shadow-[0_26px_80px_rgba(14,30,22,.2)] md:min-h-[35rem]">
        <Image src="/peakbook-hero.png" alt="Ruta de montaña al amanecer en los Pirineos" fill priority sizes="(max-width: 1152px) 100vw, 1056px" className="object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,16,13,.12)_0%,rgba(10,16,13,.08)_35%,rgba(10,16,13,.88)_100%)]" />
        <div className="absolute inset-x-5 top-5 flex items-center justify-between md:inset-x-7 md:top-7">
          <span className="rounded-full border border-white/20 bg-black/20 px-3.5 py-2 text-[10px] font-bold uppercase tracking-[.18em] text-white backdrop-blur-xl">Última ruta</span>
          <Link href="/routes" aria-label="Ver detalle de la última ruta" className="tap-scale grid h-11 w-11 place-items-center rounded-full border border-white/25 bg-white/90 text-ink shadow-float backdrop-blur"><ArrowRight size={18} strokeWidth={1.9}/></Link>
        </div>
        <div className="absolute inset-x-5 bottom-5 text-white md:inset-x-7 md:bottom-7">
          <div className="mb-3 flex items-center gap-1.5 text-xs text-white/68"><MapPin size={14} strokeWidth={1.9}/>{latest.place}</div>
          <h1 className="max-w-xl text-[2.55rem] font-semibold leading-[.98] tracking-[-.06em] md:text-6xl">{latest.name}</h1>
          <div className="mt-6 grid grid-cols-3 divide-x divide-white/15 rounded-[1.3rem] border border-white/15 bg-white/10 px-2 py-4 backdrop-blur-xl md:max-w-xl">
            <HeroMetric icon={Route} value={latest.distance} label="Distancia"/><HeroMetric icon={Mountain} value={latest.elevation} label="Desnivel"/><HeroMetric icon={Clock3} value={latest.duration} label="Tiempo"/>
          </div>
        </div>
      </section>

      <section className="my-8 grid grid-cols-3 gap-2.5 md:gap-4"><Stat icon={Footprints} value="142" label="km este mes"/><Stat icon={TrendingUp} value="6.840" label="m ascendidos"/><Stat icon={Flame} value="8" label="días activos"/></section>

      <section className="mb-8"><SectionTitle eyebrow="Tu archivo" title="Rutas recientes" action={<Link href="/routes"><IconButton icon={ArrowRight} label="Ver todas las rutas"/></Link>}/><div className="grid gap-5 md:grid-cols-2"><RouteCard route={routes[1]} compact/><RouteCard route={routes[2]} compact/></div></section>

      <section className="premium-card relative overflow-hidden rounded-[1.75rem] bg-forest p-6 text-white shadow-card md:flex md:items-center md:justify-between md:p-8"><div className="absolute -right-10 -top-14 h-36 w-36 rounded-full border border-white/10"/><div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-lime">Reto de agosto</p><h2 className="mt-2 text-2xl font-semibold tracking-[-.04em]">4 de 6 cimas</h2><p className="mt-1 text-sm text-white/50">A dos pasos de tu insignia Pirineos.</p></div><div className="mt-5 flex items-center gap-4 md:mt-0 md:w-72"><div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/15"><div className="h-full w-2/3 rounded-full bg-lime"/></div><span className="text-sm font-semibold">67%</span></div></section>
    </div>
  </AppShell>;
}

function HeroMetric({ icon: Icon, value, label }: { icon: LucideIcon; value: string; label: string }) { return <div className="flex items-center justify-center gap-2 px-1"><Icon size={17} strokeWidth={1.7} className="shrink-0 text-lime"/><div><strong className="block text-xs font-semibold sm:text-sm">{value}</strong><span className="block text-[9px] text-white/50 sm:text-[10px]">{label}</span></div></div>; }
function Stat({ icon: Icon, value, label }: { icon: LucideIcon; value: string; label: string }) { return <div className="premium-card rounded-[1.45rem] border border-black/[.035] bg-white p-4 shadow-card md:flex md:items-center md:gap-4 md:p-5"><span className="mb-5 grid h-9 w-9 place-items-center rounded-xl bg-forest/[.07] text-forest md:mb-0"><Icon size={17} strokeWidth={1.8}/></span><div><strong className="block text-lg font-semibold tracking-[-.04em] md:text-xl">{value}</strong><span className="mt-0.5 block text-[9px] leading-tight text-ink/42 md:text-[11px]">{label}</span></div></div>; }
