import { AppShell } from "@/components/app-shell";
import { MapCanvas } from "@/components/map-canvas";
import { IconButton, ScreenHeader } from "@/components/ui";
import { LocateFixed, Search, SlidersHorizontal } from "lucide-react";

export default function MapPage() {
  return <AppShell><ScreenHeader eyebrow="Explora el terreno" title="Mapa" description="Tus aventuras y cimas, situadas en el paisaje."/>
    <section className="relative h-[calc(100vh-16rem)] min-h-[34rem] overflow-hidden rounded-[2rem] border border-black/[.04] bg-[#dce2d3] shadow-[0_24px_70px_rgba(20,37,29,.14)]"><MapCanvas/>
      <div className="pointer-events-none absolute inset-x-4 top-4 flex gap-2 md:inset-x-6 md:top-6 md:max-w-md"><label className="pointer-events-auto flex h-12 flex-1 items-center gap-3 rounded-2xl border border-white/70 bg-white/88 px-4 shadow-float backdrop-blur-xl"><Search size={17} strokeWidth={1.8}/><input aria-label="Buscar en el mapa" placeholder="Buscar una zona" className="min-w-0 flex-1 bg-transparent text-sm placeholder:text-ink/30"/></label><div className="pointer-events-auto"><IconButton icon={SlidersHorizontal} label="Filtros del mapa" dark/></div></div>
      <button aria-label="Usar mi ubicación" className="tap-scale absolute bottom-28 right-4 grid h-11 w-11 place-items-center rounded-full border border-black/[.05] bg-white text-forest shadow-float md:right-6"><LocateFixed size={19} strokeWidth={1.9}/></button>
      <div className="absolute inset-x-4 bottom-4 rounded-[1.5rem] border border-white/70 bg-white/88 p-5 shadow-float backdrop-blur-2xl md:inset-x-auto md:bottom-6 md:left-6 md:w-96"><div className="flex items-center justify-between"><div><span className="text-[9px] font-bold uppercase tracking-[.2em] text-moss">Cerca de ti</span><h2 className="mt-1.5 font-semibold tracking-[-.02em]">Parque Natural del Cadí</h2><p className="mt-1 text-xs text-ink/40">8 aventuras · 3 cimas destacadas</p></div><span className="grid h-11 w-11 place-items-center rounded-full bg-forest text-sm font-semibold text-white">8</span></div></div>
    </section>
  </AppShell>;
}
