"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Expand, Images, X } from "lucide-react";
import { ResponsivePhoto } from "@/components/responsive-photo";
import type { AdventurePhoto } from "../domain/adventure";

export function AdventureGallery({ photos, title }: { photos: AdventurePhoto[]; title: string }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const ordered = [...photos].sort((a, b) => a.orden - b.orden);

  useEffect(() => {
    if (activeIndex === null) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveIndex(null);
      if (event.key === "ArrowRight") setActiveIndex(index => index === null ? null : (index + 1) % ordered.length);
      if (event.key === "ArrowLeft") setActiveIndex(index => index === null ? null : (index - 1 + ordered.length) % ordered.length);
    };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener("keydown", onKey); };
  }, [activeIndex, ordered.length]);

  if (ordered.length === 0) return null;
  const active = activeIndex === null ? null : ordered[activeIndex];

  return <section>
    <div className="mb-4 flex items-end justify-between"><div><p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.16em] text-moss"><Images size={14}/>Galería</p><h2 className="mt-1 text-xl font-semibold tracking-[-.035em]">{ordered.length} {ordered.length === 1 ? "fotografía" : "fotografías"}</h2></div><p className="hidden text-xs text-ink/35 sm:block">Toca una imagen para verla completa</p></div>
    <div className={`grid gap-2 ${ordered.length === 1 ? "grid-cols-1" : "grid-cols-2 md:grid-cols-3"}`}>
      {ordered.map((photo, index) => <button key={photo.id} type="button" onClick={() => setActiveIndex(index)} aria-label={`Abrir fotografía ${index + 1}`} className={`group relative overflow-hidden rounded-[1.15rem] bg-canvas ${index === 0 && ordered.length > 2 ? "col-span-2 row-span-2 aspect-[4/3] md:col-span-2" : "aspect-square"}`}>
        <ResponsivePhoto src={photo.url} fallbackSrc="/peakbook-hero.png" alt={photo.descripcion ?? `${title}, fotografía ${index + 1}`} sizes={index === 0 ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 50vw, 33vw"} className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"/>
        <span className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-black/35 text-white opacity-0 backdrop-blur-xl transition-opacity group-hover:opacity-100"><Expand size={15}/></span>
        {photo.portada && <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[.12em] text-forest backdrop-blur-xl">Portada</span>}
      </button>)}
    </div>

    {active && <div role="dialog" aria-modal="true" aria-label={`Visor de imágenes de ${title}`} className="fixed inset-0 z-[100] grid place-items-center bg-[#07110d]/95 p-3 backdrop-blur-xl sm:p-8">
      <button type="button" onClick={() => setActiveIndex(null)} aria-label="Cerrar visor" className="tap-scale absolute right-4 top-[max(1rem,env(safe-area-inset-top))] z-10 grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-xl"><X size={19}/></button>
      <div className="relative h-[82vh] w-full max-w-6xl overflow-hidden rounded-[1.5rem]"><ResponsivePhoto src={active.url} fallbackSrc="/peakbook-hero.png" alt={active.descripcion ?? `${title}, fotografía ${activeIndex! + 1}`} sizes="100vw" priority className="object-contain"/></div>
      {ordered.length > 1 && <><button type="button" onClick={() => setActiveIndex(index => index === null ? null : (index - 1 + ordered.length) % ordered.length)} aria-label="Fotografía anterior" className="tap-scale absolute left-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white backdrop-blur-xl sm:left-6"><ChevronLeft size={23}/></button><button type="button" onClick={() => setActiveIndex(index => index === null ? null : (index + 1) % ordered.length)} aria-label="Fotografía siguiente" className="tap-scale absolute right-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white backdrop-blur-xl sm:right-6"><ChevronRight size={23}/></button></>}
      <p className="absolute bottom-[max(1rem,env(safe-area-inset-bottom))] rounded-full bg-black/35 px-4 py-2 text-xs font-semibold text-white/75 backdrop-blur-xl">{activeIndex! + 1} de {ordered.length}</p>
    </div>}
  </section>;
}
