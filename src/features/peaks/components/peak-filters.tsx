"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import type { PeakDifficulty, PeakStatus } from "../domain/peak";

export type AltitudeFilter = "all" | "under-3000" | "3000-3499" | "3500-plus";
export type StatusFilter = "all" | PeakStatus;

export type PeakFilterState = {
  query: string;
  country: string;
  province: string;
  altitude: AltitudeFilter;
  difficulty: "all" | PeakDifficulty;
  status: StatusFilter;
};

export const defaultPeakFilters: PeakFilterState = {
  query: "",
  country: "all",
  province: "all",
  altitude: "all",
  difficulty: "all",
  status: "all",
};

export function PeakFilters({
  value,
  countries,
  provinces,
  onChange,
}: {
  value: PeakFilterState;
  countries: string[];
  provinces: string[];
  onChange: (next: PeakFilterState) => void;
}) {
  const update = <Key extends keyof PeakFilterState>(key: Key, nextValue: PeakFilterState[Key]) => onChange({ ...value, [key]: nextValue });

  return (
    <section className="peak-filter-panel sticky top-3 z-30 my-8 rounded-[1.7rem] border border-white/80 bg-white/85 p-2.5 shadow-[0_18px_55px_rgba(20,37,29,.1)] backdrop-blur-2xl sm:my-10 sm:p-3">
      <label className="flex h-12 items-center gap-3 rounded-[1.15rem] bg-ink/[.035] px-4">
        <Search size={18} className="shrink-0 text-forest/55" />
        <input value={value.query} onChange={(event) => update("query", event.target.value)} placeholder="Busca una montaña…" className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-ink placeholder:font-medium placeholder:text-ink/30" />
        <SlidersHorizontal size={16} className="text-ink/25" />
      </label>

      <div className="mt-2 flex gap-2 overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <FilterSelect label="País" value={value.country} onChange={(next) => onChange({ ...value, country: next, province: "all" })} options={[{ value: "all", label: "Todos los países" }, ...countries.map((country) => ({ value: country, label: country }))]} />
        <FilterSelect label="Provincia" value={value.province} onChange={(next) => update("province", next)} options={[{ value: "all", label: "Todas las provincias" }, ...provinces.map((province) => ({ value: province, label: province }))]} />
        <FilterSelect label="Altitud" value={value.altitude} onChange={(next) => update("altitude", next as AltitudeFilter)} options={[{ value: "all", label: "Cualquier altitud" }, { value: "under-3000", label: "Menos de 3.000 m" }, { value: "3000-3499", label: "3.000–3.499 m" }, { value: "3500-plus", label: "3.500 m o más" }]} />
        <FilterSelect label="Dificultad" value={value.difficulty} onChange={(next) => update("difficulty", next as PeakFilterState["difficulty"])} options={[{ value: "all", label: "Cualquier dificultad" }, { value: "facil", label: "Fácil" }, { value: "moderada", label: "Moderada" }, { value: "dificil", label: "Difícil" }, { value: "experta", label: "Experta" }]} />
      </div>

      <div className="mt-2 grid grid-cols-3 gap-1 rounded-[1.1rem] bg-ink/[.035] p-1">
        {([{"value":"all","label":"Todas"},{"value":"conquered","label":"✓ Conseguidas"},{"value":"pending","label":"○ Pendientes"}] as const).map((option) => (
          <button key={option.value} type="button" onClick={() => update("status", option.value)} className={`tap-scale rounded-[.85rem] px-2 py-2.5 text-[10px] font-bold sm:text-[11px] ${value.status === option.value ? "bg-white text-forest shadow-sm" : "text-ink/38"}`}>{option.label}</button>
        ))}
      </div>
    </section>
  );
}

function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: Array<{ value: string; label: string }> }) {
  return (
    <label className="relative shrink-0">
      <span className="sr-only">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="h-10 appearance-none rounded-xl border border-black/[.045] bg-white pl-3.5 pr-8 text-[10px] font-semibold text-ink/62 shadow-sm">
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[9px] text-ink/30">↓</span>
    </label>
  );
}
