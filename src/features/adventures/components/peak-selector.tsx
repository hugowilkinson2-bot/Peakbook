"use client";

import { useState } from "react";
import { Check, LoaderCircle, MapPin, Mountain, Search, X } from "lucide-react";
import { ResponsivePhoto } from "@/components/responsive-photo";
import { usePeakSearch } from "../application/use-peak-search";
import type { PeakReference } from "../domain/adventure";

export function PeakSelector({ value, onChange }: { value: PeakReference | null; onChange: (peak: PeakReference) => void }) {
  const [query, setQuery] = useState(value?.nombre ?? "");
  const [isOpen, setIsOpen] = useState(!value);
  const { peaks, isLoading, error } = usePeakSearch(query, isOpen);

  function select(peak: PeakReference) {
    setQuery(peak.nombre);
    setIsOpen(false);
    onChange(peak);
  }

  return <div className="relative">
    <label className="block rounded-[1.4rem] border border-black/[.055] bg-canvas/60 p-4 transition-all focus-within:border-forest/25 focus-within:bg-white focus-within:shadow-sm">
      <span className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.15em] text-moss"><Mountain size={14}/>¿Qué montaña has subido?</span>
      <span className="flex items-center gap-3"><Search size={18} className="shrink-0 text-ink/35"/><input
        autoFocus={!value}
        role="combobox"
        aria-expanded={isOpen}
        aria-controls="peak-suggestions"
        aria-autocomplete="list"
        value={query}
        onFocus={() => setIsOpen(true)}
        onChange={event => { setQuery(event.target.value); setIsOpen(true); }}
        placeholder="Busca Aneto, Roca…"
        className="field-input min-w-0 flex-1 text-base"
      />{isLoading ? <LoaderCircle size={17} className="animate-spin text-forest"/> : query && <button type="button" aria-label="Limpiar búsqueda" onClick={() => { setQuery(""); setIsOpen(true); }} className="grid h-7 w-7 place-items-center rounded-full bg-black/[.045]"><X size={14}/></button>}</span>
    </label>

    {isOpen && <div id="peak-suggestions" role="listbox" className="absolute inset-x-0 z-30 mt-2 max-h-[24rem] overflow-y-auto rounded-[1.5rem] border border-black/[.06] bg-white p-2 shadow-[0_24px_70px_rgba(17,35,26,.18)]">
      {error ? <p className="px-4 py-5 text-sm text-[#913e34]">{error}</p> : peaks.length === 0 && !isLoading ? <p className="px-4 py-5 text-sm text-ink/45">No encontramos esa cima en el catálogo.</p> : peaks.map(peak => <button
        key={peak.id}
        type="button"
        role="option"
        aria-selected={peak.id === value?.id}
        onClick={() => select(peak)}
        className="group flex w-full items-center gap-3 rounded-[1.05rem] p-2 text-left transition-colors hover:bg-canvas"
      >
        <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-canvas"><ResponsivePhoto src={peak.fotoPrincipalUrl ?? "/peakbook-hero.png"} fallbackSrc="/peakbook-hero.png" alt={peak.nombre} sizes="56px" className="object-cover"/></span>
        <span className="min-w-0 flex-1"><strong className="block truncate text-sm font-semibold">{peak.nombre}</strong><span className="mt-1 flex items-center gap-1 truncate text-[11px] text-ink/45"><MapPin size={11}/>{peak.provincia ? `${peak.provincia}, ` : ""}{peak.pais}</span></span>
        <span className="text-right"><strong className="block text-sm font-semibold text-forest">{peak.altitud.toLocaleString("es-ES")} m</strong><span className="text-[9px] uppercase tracking-[.12em] text-ink/35">Altitud</span></span>
      </button>) }
    </div>}

    {value && !isOpen && <div className="mt-3 grid gap-3 rounded-[1.35rem] border border-forest/10 bg-forest/[.045] p-4 sm:grid-cols-[1fr_auto] sm:items-center">
      <div><p className="flex items-center gap-2 text-sm font-semibold text-forest"><Check size={16}/>Cima identificada</p><p className="mt-1 text-xs text-ink/50">{value.altitud.toLocaleString("es-ES")} m · {value.provincia ? `${value.provincia}, ` : ""}{value.pais}</p><p className="mt-1 text-[11px] text-ink/35">{value.latitud.toFixed(5)}, {value.longitud.toFixed(5)} · {value.globeId}</p></div>
      <button type="button" onClick={() => setIsOpen(true)} className="tap-scale rounded-full border border-forest/10 bg-white px-4 py-2 text-[11px] font-semibold text-forest">Cambiar cima</button>
    </div>}
  </div>;
}
