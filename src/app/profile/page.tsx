import { AppShell } from "@/components/app-shell";
import { ScreenHeader } from "@/components/ui";
import { Award, ChevronRight, Cloud, Heart, LogOut, Mountain, Settings, ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const menu = [
  { icon: Heart, label: "Rutas favoritas" },
  { icon: Mountain, label: "Cimas conquistadas" },
  { icon: Cloud, label: "Sincronización", value: "Activa" },
  { icon: ShieldCheck, label: "Privacidad" },
  { icon: Settings, label: "Ajustes" },
];

export default function ProfilePage() {
  return <AppShell><ScreenHeader eyebrow="Tu identidad en la montaña" title="Perfil"/>
    <div className="grid gap-6 lg:grid-cols-[.9fr_1.1fr]">
      <div className="space-y-6">
        <section className="premium-card overflow-hidden rounded-[1.85rem] border border-black/[.035] bg-white shadow-card"><div className="h-28 bg-[radial-gradient(circle_at_20%_30%,rgba(217,242,123,.55),transparent_35%),linear-gradient(125deg,#153c2c,#243a31)]"/><div className="px-6 pb-6"><div className="-mt-10 grid h-20 w-20 place-items-center rounded-[1.55rem] border-4 border-white bg-[#d9f27b] text-xl font-semibold text-forest shadow-sm">HW</div><p className="mt-4 text-[10px] font-bold uppercase tracking-[.18em] text-moss">Explorador · nivel 12</p><h2 className="mt-1 text-2xl font-semibold tracking-[-.04em]">Hugo Wilkinson</h2><p className="mt-1 text-xs text-ink/38">Miembro desde 2026</p><div className="mt-6 grid grid-cols-3 divide-x divide-black/[.06]"><ProfileStat value="38" label="Rutas"/><ProfileStat value="27" label="Cimas"/><ProfileStat value="412" label="Kilómetros"/></div></div></section>
        <section className="premium-card relative overflow-hidden rounded-[1.75rem] bg-forest p-6 text-white shadow-card"><div className="absolute -right-5 -top-7 opacity-10"><Award size={110}/></div><p className="text-[9px] font-bold uppercase tracking-[.2em] text-lime">Próximo nivel</p><h2 className="mt-2 text-2xl font-semibold tracking-[-.04em]">Alpinista</h2><p className="mt-1 text-xs text-white/45">620 m de desnivel por completar</p><div className="mt-5 flex items-center gap-3"><div className="h-1.5 flex-1 rounded-full bg-white/15"><div className="h-full w-3/4 rounded-full bg-lime"/></div><span className="text-xs font-semibold">75%</span></div></section>
      </div>
      <section className="h-fit overflow-hidden rounded-[1.75rem] border border-black/[.035] bg-white p-2 shadow-card"><div>{menu.map(item=><MenuItem key={item.label} {...item}/>)}</div><div className="mx-4 h-px bg-black/[.06]"/><MenuItem icon={LogOut} label="Cerrar sesión" danger/></section>
    </div>
  </AppShell>;
}

function ProfileStat({ value, label }: { value: string; label: string }) { return <div className="text-center"><strong className="block text-lg font-semibold tracking-[-.04em]">{value}</strong><span className="text-[9px] text-ink/38 sm:text-[10px]">{label}</span></div>; }
function MenuItem({ icon: Icon, label, value, danger }: { icon: LucideIcon; label: string; value?: string; danger?: boolean }) { return <button className={`tap-scale flex w-full items-center gap-3 rounded-[1.2rem] px-3 py-3.5 text-left hover:bg-canvas ${danger ? "text-[#b85143]" : "text-ink"}`}><span className={`grid h-10 w-10 place-items-center rounded-xl ${danger ? "bg-[#b85143]/8" : "bg-forest/[.065] text-forest"}`}><Icon size={17} strokeWidth={1.8}/></span><span className="flex-1 text-sm font-medium">{label}</span>{value&&<span className="rounded-full bg-forest/[.06] px-2.5 py-1 text-[10px] font-semibold text-moss">{value}</span>}<ChevronRight size={15} strokeWidth={1.8} className="opacity-25"/></button>; }
