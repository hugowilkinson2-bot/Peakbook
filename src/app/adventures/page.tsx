"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { IconButton, ScreenHeader } from "@/components/ui";
import { useAdventures } from "@/features/adventures/application/adventure-provider";
import { AdventureCard } from "@/features/adventures/components/adventure-card";
import { AdventureEmpty, AdventureError, AdventureLoading } from "@/features/adventures/components/adventure-states";
import { ArrowDownUp, Plus, Search } from "lucide-react";

type DateOrder = "desc" | "asc";

export default function AdventuresPage() {
  const { adventures, isLoading, error, reload, clearError } = useAdventures();
  const [query, setQuery] = useState("");
  const [year, setYear] = useState("all");
  const [order, setOrder] = useState<DateOrder>("desc");
  const years = useMemo(() => [...new Set(adventures.map(adventure => adventure.fecha.slice(0,4)))].sort((a,b)=>b.localeCompare(a)), [adventures]);
  const visible = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("es");
    return adventures.filter(adventure => {
      const matchesText = !normalized || [adventure.titulo, adventure.sensaciones, adventure.notas].some(value => value?.toLocaleLowerCase("es").includes(normalized));
      return matchesText && (year === "all" || adventure.fecha.startsWith(year));
    }).sort((a,b) => order === "desc" ? b.fecha.localeCompare(a.fecha) : a.fecha.localeCompare(b.fecha));
  }, [adventures, order, query, year]);

  return <AppShell><div className="flex items-start justify-between gap-4"><ScreenHeader eyebrow="Tu archivo de montaña" title="Aventuras" description="Busca, ordena y vuelve a cada historia."/><Link href="/adventures/new" className="mt-2"><IconButton icon={Plus} label="Crear aventura" dark/></Link></div>
    <section className="mb-7 grid gap-3 rounded-[1.5rem] border border-black/[.035] bg-white p-3 shadow-card sm:grid-cols-[1fr_auto_auto]">
      <label className="flex h-11 items-center gap-3 rounded-xl bg-canvas/70 px-3"><Search size={17} strokeWidth={1.8} className="text-moss"/><input value={query} onChange={event=>setQuery(event.target.value)} aria-label="Buscar aventuras" placeholder="Buscar por título, notas o sensaciones" className="min-w-0 flex-1 bg-transparent text-sm placeholder:text-ink/30"/></label>
      <select value={year} onChange={event=>setYear(event.target.value)} aria-label="Filtrar por año" className="h-11 rounded-xl border border-black/[.05] bg-white px-3 text-xs font-semibold text-ink/60"><option value="all">Todos los años</option>{years.map(item=><option key={item} value={item}>{item}</option>)}</select>
      <button onClick={()=>setOrder(current=>current==="desc"?"asc":"desc")} className="tap-scale flex h-11 items-center justify-center gap-2 rounded-xl border border-black/[.05] bg-white px-3 text-xs font-semibold text-ink/60"><ArrowDownUp size={15}/>{order === "desc" ? "Más recientes" : "Más antiguas"}</button>
    </section>

    {error && adventures.length > 0 && <div role="alert" className="mb-5 flex items-center justify-between gap-3 rounded-2xl border border-[#b85143]/15 bg-[#b85143]/[.07] px-4 py-3 text-sm text-[#913e34]"><span>{error}</span><button onClick={clearError} className="text-xs font-semibold underline underline-offset-2">Cerrar</button></div>}

    {isLoading ? <AdventureLoading/> : error && adventures.length === 0 ? <AdventureError message={error} onRetry={()=>void reload()}/> : visible.length === 0 ? <AdventureEmpty filtered={adventures.length > 0}/> : <div className="stagger-in grid gap-5 md:grid-cols-2 xl:grid-cols-3">{visible.map(adventure=><AdventureCard key={adventure.id} adventure={adventure} compact/>)}</div>}
  </AppShell>;
}
