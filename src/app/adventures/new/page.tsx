import { AppShell } from "@/components/app-shell";
import { ScreenHeader } from "@/components/ui";
import { ArrowRight, CalendarDays, MapPin, Mountain, Route, UploadCloud } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export default function NewAdventurePage() {
  return <AppShell><ScreenHeader eyebrow="Añade un nuevo recuerdo" title="Nueva aventura" description="Importa el recorrido y completa los detalles esenciales."/>
    <form className="mx-auto max-w-4xl space-y-5">
      <div className="grid gap-5 md:grid-cols-[.9fr_1.1fr]">
        <div className="premium-card flex min-h-72 flex-col items-center justify-center rounded-[1.75rem] border border-dashed border-forest/20 bg-white/65 p-8 text-center shadow-sm backdrop-blur"><span className="grid h-14 w-14 place-items-center rounded-2xl bg-forest text-white shadow-float"><UploadCloud size={23} strokeWidth={1.8}/></span><h2 className="mt-5 font-semibold tracking-[-.02em]">Importa tu recorrido</h2><p className="mt-1.5 text-xs text-ink/40">Archivos GPX, FIT o TCX</p><button type="button" className="tap-scale mt-6 rounded-full border border-black/[.06] bg-white px-5 py-2.5 text-xs font-semibold shadow-sm">Seleccionar archivo</button></div>
        <div className="space-y-4"><Field icon={Mountain} label="Título de la aventura" placeholder="Ej. Ascenso al Posets"/><Field icon={MapPin} label="Ubicación" placeholder="Parque Natural Posets-Maladeta"/><div className="grid grid-cols-2 gap-4"><Field icon={Route} label="Distancia" placeholder="0,0 km"/><Field icon={CalendarDays} label="Fecha" placeholder="01/08/2026"/></div></div>
      </div>
      <label className="premium-card block rounded-[1.5rem] border border-black/[.035] bg-white p-5 shadow-card"><span className="mb-3 block text-[10px] font-bold uppercase tracking-[.16em] text-moss">Notas de la aventura</span><textarea rows={4} placeholder="Condiciones, compañeros, sensaciones…" className="w-full resize-none bg-transparent text-sm leading-relaxed placeholder:text-ink/25"/></label>
      <button type="submit" className="tap-scale flex h-14 w-full items-center justify-center gap-2 rounded-[1.15rem] bg-forest font-semibold text-white shadow-float">Guardar aventura <ArrowRight size={18} strokeWidth={1.9}/></button>
    </form>
  </AppShell>;
}

function Field({ icon: Icon, label, placeholder }: { icon: LucideIcon; label: string; placeholder: string }) { return <label className="premium-card block rounded-[1.35rem] border border-black/[.035] bg-white p-4 shadow-card"><span className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.13em] text-moss"><Icon size={14} strokeWidth={1.8}/>{label}</span><input placeholder={placeholder} className="w-full bg-transparent text-sm font-medium placeholder:font-normal placeholder:text-ink/25"/></label>; }
