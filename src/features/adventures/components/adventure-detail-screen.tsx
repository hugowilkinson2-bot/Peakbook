"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { useAdventures } from "../application/adventure-provider";
import { AdventureError, AdventureLoading } from "./adventure-states";
import { formatDate, formatDifficulty, formatDistance, formatDuration, formatElevation, formatWeather } from "../presentation/formatters";
import { ArrowLeft, CalendarDays, Clock3, CloudSun, Gauge, HeartPulse, Mountain, NotebookPen, Pencil, Route, Trash2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export function AdventureDetailScreen({ id }: { id: string }) {
  const router = useRouter();
  const { adventures, isLoading, error, reload, deleteAdventure } = useAdventures();
  const [isDeleting, setIsDeleting] = useState(false);
  const adventure = adventures.find(item => item.id === id);

  if (isLoading) return <AppShell><AdventureLoading cards={1}/></AppShell>;
  if (!adventure && error) return <AppShell><AdventureError message={error} onRetry={()=>void reload()}/></AppShell>;
  if (!adventure) return <AppShell><div className="rounded-[1.75rem] bg-white p-8 text-center shadow-card"><h1 className="text-xl font-semibold">Aventura no encontrada</h1><p className="mt-2 text-sm text-ink/45">Puede que se haya eliminado o ya no esté disponible.</p><Link href="/adventures" className="mt-5 inline-flex rounded-full bg-forest px-5 py-3 text-xs font-semibold text-white">Volver a aventuras</Link></div></AppShell>;

  async function handleDelete() {
    if (!window.confirm(`¿Eliminar “${adventure!.titulo}”? Esta acción no se puede deshacer.`)) return;
    setIsDeleting(true);
    router.replace("/adventures");
    try { await deleteAdventure(id); }
    catch { setIsDeleting(false); }
  }

  return <AppShell>
    <header className="mb-5 flex items-center justify-between"><Link href="/adventures" aria-label="Volver a aventuras" className="tap-scale grid h-11 w-11 place-items-center rounded-full border border-black/[.05] bg-white shadow-sm"><ArrowLeft size={18}/></Link><div className="flex gap-2"><Link href={`/adventures/${id}/edit`} className="tap-scale flex h-11 items-center gap-2 rounded-full border border-black/[.05] bg-white px-4 text-xs font-semibold shadow-sm"><Pencil size={15}/>Editar</Link><button disabled={isDeleting} onClick={()=>void handleDelete()} aria-label="Eliminar aventura" className="tap-scale grid h-11 w-11 place-items-center rounded-full bg-[#a84539] text-white shadow-sm disabled:opacity-50"><Trash2 size={17}/></button></div></header>

    <article className="overflow-hidden rounded-[2rem] bg-white shadow-card">
      <section className="relative min-h-[25rem] overflow-hidden md:min-h-[31rem]"><Image src="/peakbook-hero.png" alt={`Paisaje de ${adventure.titulo}`} fill priority className="object-cover"/><div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/15 to-black/10"/><div className="absolute inset-x-6 bottom-6 text-white md:inset-x-8 md:bottom-8"><span className="rounded-full border border-white/20 bg-black/20 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.14em] backdrop-blur-xl">{formatDifficulty(adventure.dificultad)}</span><h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-none tracking-[-.06em] md:text-6xl">{adventure.titulo}</h1><p className="mt-3 flex items-center gap-2 text-sm text-white/65"><CalendarDays size={15}/>{formatDate(adventure.fecha)}</p></div></section>

      <div className="space-y-7 p-5 sm:p-7 md:p-9">
        <section className="grid grid-cols-2 gap-3 md:grid-cols-4"><Metric icon={Route} label="Distancia" value={formatDistance(adventure.distancia)}/><Metric icon={Mountain} label="Desnivel +" value={formatElevation(adventure.desnivelPositivo)}/><Metric icon={Clock3} label="Tiempo" value={formatDuration(adventure.tiempo)}/><Metric icon={Gauge} label="Dificultad" value={formatDifficulty(adventure.dificultad)}/></section>
        <section className="grid gap-4 md:grid-cols-2"><Info icon={CloudSun} label="Meteorología" value={formatWeather(adventure.meteorologia)}/><Info icon={HeartPulse} label="Sensaciones" value={adventure.sensaciones || "Sin registrar"}/></section>
        <section className="rounded-[1.5rem] bg-canvas p-5 sm:p-6"><p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.16em] text-moss"><NotebookPen size={14}/>Notas</p><p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-ink/65">{adventure.notas || "No añadiste notas a esta aventura."}</p></section>
      </div>
    </article>
  </AppShell>;
}

function Metric({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) { return <div className="rounded-[1.35rem] border border-black/[.04] bg-canvas/55 p-4"><Icon size={17} className="text-forest"/><span className="mt-4 block text-[9px] font-bold uppercase tracking-[.12em] text-moss">{label}</span><strong className="mt-1 block text-sm font-semibold">{value}</strong></div>; }
function Info({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) { return <div className="flex items-center gap-4 rounded-[1.35rem] border border-black/[.04] p-4"><span className="grid h-11 w-11 place-items-center rounded-xl bg-forest/[.07] text-forest"><Icon size={18}/></span><div><span className="text-[9px] font-bold uppercase tracking-[.13em] text-moss">{label}</span><strong className="mt-1 block text-sm font-semibold">{value}</strong></div></div>; }
