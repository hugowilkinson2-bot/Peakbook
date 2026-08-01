import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { RouteCard } from "@/components/route-card";
import { routes } from "@/lib/routes";
import { ArrowRight, Flame, Footprints, MountainSnow, TrendingUp } from "lucide-react";

export default function Home() {
  return <AppShell><PageHeader/><section className="mb-8"><p className="text-sm font-medium text-moss">Buenos días, Hugo</p><div className="mt-2 flex items-end justify-between gap-4"><h1 className="max-w-sm text-4xl font-semibold leading-[1.05] tracking-[-0.055em] md:text-5xl">Tu próxima cima empieza aquí.</h1><span className="hidden rounded-full bg-lime p-4 md:block"><MountainSnow/></span></div></section>
    <section className="mb-8 grid grid-cols-3 gap-3"><Stat icon={Footprints} value="142" label="km este mes"/><Stat icon={TrendingUp} value="6.840" label="m ascendidos"/><Stat icon={Flame} value="8" label="días activos"/></section>
    <section className="mb-8"><div className="mb-4 flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-[.18em] text-moss">Continúa tu aventura</p><h2 className="mt-1 text-2xl font-semibold tracking-tight">Ruta en curso</h2></div><Link href="/routes" className="grid h-10 w-10 place-items-center rounded-full border border-ink/10 bg-white" aria-label="Ver mis rutas"><ArrowRight size={18}/></Link></div><RouteCard route={routes[0]}/></section>
    <section className="rounded-4xl bg-forest p-6 text-white"><p className="text-xs font-semibold uppercase tracking-[.18em] text-lime">Reto de agosto</p><div className="mt-3 flex items-end justify-between"><div><strong className="text-3xl tracking-tight">4 de 6 cimas</strong><p className="mt-1 text-sm text-white/60">A dos pasos de tu insignia Pirineos.</p></div><span className="text-2xl">67%</span></div><div className="mt-5 h-2 overflow-hidden rounded-full bg-white/15"><div className="h-full w-2/3 rounded-full bg-lime"/></div></section>
  </AppShell>;
}
function Stat({icon: Icon,value,label}:{icon:typeof Footprints;value:string;label:string}) { return <div className="rounded-3xl bg-white p-4 shadow-sm"><Icon size={18} className="mb-5 text-moss"/><strong className="block text-lg tracking-tight">{value}</strong><span className="mt-1 block text-[10px] leading-tight text-ink/45">{label}</span></div>; }
