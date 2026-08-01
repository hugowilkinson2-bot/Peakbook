import { AppShell } from "@/components/app-shell";
import { RouteCard } from "@/components/route-card";
import { IconButton, ScreenHeader } from "@/components/ui";
import { routes } from "@/lib/routes";
import { Search, SlidersHorizontal } from "lucide-react";

const filters = ["Todas · 12", "Completadas · 9", "Guardadas · 3"];

export default function RoutesPage() {
  return <AppShell><ScreenHeader eyebrow="Tu archivo de montaña" title="Mis rutas" description="Cada kilómetro, desnivel y cima en un solo lugar."/>
    <div className="mb-6 flex gap-3"><label className="flex h-12 flex-1 items-center gap-3 rounded-[1.15rem] border border-black/[.04] bg-white px-4 shadow-sm transition-shadow focus-within:shadow-card"><Search size={18} strokeWidth={1.8} className="text-moss"/><input aria-label="Buscar rutas" placeholder="Buscar cima o lugar" className="min-w-0 flex-1 bg-transparent text-sm placeholder:text-ink/30"/></label><IconButton icon={SlidersHorizontal} label="Filtrar rutas" dark/></div>
    <div className="mb-7 flex gap-2 overflow-x-auto pb-1 text-[11px] font-semibold [scrollbar-width:none]">{filters.map((filter,index)=><button key={filter} className={`tap-scale whitespace-nowrap rounded-full border px-4 py-2.5 ${index===0?"border-forest bg-forest text-white":"border-black/[.05] bg-white text-ink/45"}`}>{filter}</button>)}</div>
    <div className="stagger-in grid gap-5 md:grid-cols-2 xl:grid-cols-3">{routes.map(route=><RouteCard key={route.id} route={route} compact/>)}</div>
  </AppShell>;
}
