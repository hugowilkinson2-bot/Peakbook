"use client";

import { useMemo, useState } from "react";
import { MountainSnow, RotateCcw, Sparkles } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { usePeakAlbum } from "@/features/peaks/application/use-peak-album";
import { PeakCard } from "@/features/peaks/components/peak-card";
import { defaultPeakFilters, PeakFilters, type PeakFilterState } from "@/features/peaks/components/peak-filters";
import type { PeakProfile } from "@/features/peaks/domain/peak";

export default function PeaksPage() {
  const { peaks, isLoading } = usePeakAlbum();
  const [filters, setFilters] = useState<PeakFilterState>(defaultPeakFilters);
  const countries = useMemo(() => unique(peaks.map(({ country }) => country)), [peaks]);
  const provinces = useMemo(() => unique(peaks.filter((peak) => filters.country === "all" || peak.country === filters.country).map(({ province }) => province)), [peaks, filters.country]);
  const filtered = useMemo(() => peaks.filter((peak) => matchesFilters(peak, filters)), [peaks, filters]);
  const conquered = peaks.filter(({ status }) => status === "conquered").length;
  const ascentCount = peaks.reduce((sum, peak) => sum + peak.stats.ascentCount, 0);

  return (
    <AppShell>
      <PageHeader />
      <header className="peak-index-intro relative overflow-hidden pb-2 pt-3 sm:pb-4 sm:pt-8">
        <div className="relative z-10">
          <div className="mb-5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.22em] text-forest/60">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-forest text-lime shadow-sm"><MountainSnow size={16} /></span>
            El corazón de PeakBook
          </div>
          <h1 className="max-w-4xl text-[3.35rem] font-semibold leading-[.89] tracking-[-.078em] sm:text-6xl md:text-7xl lg:text-[5.5rem]">
            Tus montañas. <span className="text-forest/35">Las que alcanzaste y las que aún te llaman.</span>
          </h1>
          <div className="mt-7 grid max-w-xl grid-cols-3 divide-x divide-black/[.07] rounded-[1.4rem] border border-black/[.045] bg-white/65 py-4 shadow-sm backdrop-blur-xl">
            <IndexStat value={peaks.length} label="en tu atlas" />
            <IndexStat value={conquered} label="conseguidas" />
            <IndexStat value={ascentCount} label="ascensiones" />
          </div>
        </div>
      </header>

      <PeakFilters value={filters} countries={countries} provinces={provinces} onChange={setFilters} />

      <div className="mb-5 flex items-center justify-between gap-4 sm:mb-6">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[.2em] text-moss">Atlas personal</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-[-.045em] sm:text-3xl">{filtered.length} {filtered.length === 1 ? "cima" : "cimas"}</h2>
        </div>
        {isLoading && <span className="flex items-center gap-2 text-[10px] font-semibold text-forest/50"><Sparkles size={13} className="animate-pulse" /> Sincronizando</span>}
      </div>

      {filtered.length > 0 ? (
        <section className="grid gap-5 md:grid-cols-2 md:gap-6">
          {filtered.map((peak, index) => <PeakCard key={peak.id} peak={peak} index={index} />)}
        </section>
      ) : (
        <section className="grid min-h-[25rem] place-items-center rounded-[2rem] border border-dashed border-forest/15 bg-white/55 p-8 text-center">
          <div><span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-forest/[.07] text-forest"><MountainSnow size={20} /></span><h2 className="mt-4 text-2xl font-semibold tracking-[-.04em]">Esa montaña todavía no está aquí.</h2><p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink/45">Prueba otra altitud o despeja los filtros para volver a ver tu atlas completo.</p><button type="button" onClick={() => setFilters(defaultPeakFilters)} className="tap-scale mx-auto mt-6 inline-flex items-center gap-2 rounded-full bg-forest px-5 py-3 text-xs font-semibold text-white"><RotateCcw size={14} /> Limpiar filtros</button></div>
        </section>
      )}
    </AppShell>
  );
}

function IndexStat({ value, label }: { value: number; label: string }) {
  return <div className="px-3 text-center"><strong className="block text-xl font-semibold tracking-[-.04em] sm:text-2xl">{value}</strong><span className="mt-0.5 block text-[9px] text-ink/38 sm:text-[10px]">{label}</span></div>;
}

function unique(values: string[]) {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b, "es"));
}

function matchesFilters(peak: PeakProfile, filters: PeakFilterState) {
  const searchable = normalize(`${peak.name} ${peak.province} ${peak.country}`);
  if (filters.query && !searchable.includes(normalize(filters.query))) return false;
  if (filters.country !== "all" && peak.country !== filters.country) return false;
  if (filters.province !== "all" && peak.province !== filters.province) return false;
  if (filters.difficulty !== "all" && peak.difficulty !== filters.difficulty) return false;
  if (filters.status !== "all" && peak.status !== filters.status) return false;
  if (filters.altitude === "under-3000" && peak.altitude >= 3000) return false;
  if (filters.altitude === "3000-3499" && (peak.altitude < 3000 || peak.altitude >= 3500)) return false;
  if (filters.altitude === "3500-plus" && peak.altitude < 3500) return false;
  return true;
}

function normalize(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("es").trim();
}

