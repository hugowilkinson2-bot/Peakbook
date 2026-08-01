import { ArrowUpRight, Clock3, Mountain, Route } from "lucide-react";
import type { MountainRoute } from "@/lib/routes";

export function RouteCard({ route, compact = false }: { route: MountainRoute; compact?: boolean }) {
  return (
    <article className="overflow-hidden rounded-4xl bg-white shadow-card">
      <div className={`relative ${compact ? "h-36" : "h-52"} bg-gradient-to-br ${route.tone} p-5 text-white`}>
        <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_20%_70%,transparent_0,transparent_18%,white_18.5%,transparent_19%),linear-gradient(150deg,transparent_45%,white_46%,transparent_47%)]" />
        <div className="relative flex items-start justify-between">
          <span className="rounded-full bg-black/20 px-3 py-1.5 text-xs font-medium backdrop-blur-md">{route.difficulty}</span>
          <button aria-label={`Abrir ${route.name}`} className="grid h-10 w-10 place-items-center rounded-full bg-white/90 text-ink"><ArrowUpRight size={18} /></button>
        </div>
        <div className="absolute bottom-5 left-5"><p className="text-xs text-white/75">{route.place}</p><h3 className="mt-1 text-xl font-semibold tracking-tight">{route.name}</h3></div>
      </div>
      <div className="grid grid-cols-3 gap-2 p-5 text-ink">
        <Metric icon={Route} value={route.distance} label="Distancia" />
        <Metric icon={Mountain} value={route.elevation} label="Desnivel" />
        <Metric icon={Clock3} value={route.duration} label="Tiempo" />
      </div>
    </article>
  );
}

function Metric({ icon: Icon, value, label }: { icon: typeof Route; value: string; label: string }) {
  return <div><Icon size={15} className="mb-2 text-moss"/><strong className="block text-sm font-semibold">{value}</strong><span className="text-[11px] text-ink/45">{label}</span></div>;
}
