"use client";

import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Camera, Check, GripVertical, ImagePlus, LoaderCircle, Star, Trash2 } from "lucide-react";
import { ResponsivePhoto } from "@/components/responsive-photo";
import { optimizeImage } from "../application/optimize-image";
import type { PhotoDraft } from "../domain/adventure";

const MAX_PHOTOS = 12;

export function PhotoManager({ photos, onChange }: { photos: PhotoDraft[]; onChange: (photos: PhotoDraft[]) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const draggedId = useRef<string | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function addFiles(files: FileList | null) {
    if (!files?.length) return;
    const remaining = MAX_PHOTOS - photos.length;
    if (remaining <= 0) { setError(`Puedes guardar hasta ${MAX_PHOTOS} fotografías por aventura.`); return; }
    setIsOptimizing(true);
    setError(null);
    try {
      const drafts: PhotoDraft[] = [];
      for (const file of Array.from(files).slice(0, remaining)) {
        const optimized = await optimizeImage(file);
        drafts.push({
          id: crypto.randomUUID(),
          storagePath: null,
          previewUrl: URL.createObjectURL(optimized.blob),
          portada: photos.length === 0 && drafts.length === 0,
          descripcion: null,
          orden: photos.length + drafts.length + 1,
          ...optimized,
        });
      }
      onChange(normalize([...photos, ...drafts]));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudieron preparar las fotografías.");
    } finally {
      setIsOptimizing(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function remove(id: string) {
    const removed = photos.find(photo => photo.id === id);
    if (removed?.blob) URL.revokeObjectURL(removed.previewUrl);
    onChange(normalize(photos.filter(photo => photo.id !== id)));
  }

  function setCover(id: string) { onChange(photos.map(photo => ({ ...photo, portada: photo.id === id }))); }

  function move(id: string, delta: number) {
    const from = photos.findIndex(photo => photo.id === id);
    const to = Math.max(0, Math.min(photos.length - 1, from + delta));
    if (from === to) return;
    const next = [...photos];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(normalize(next));
  }

  function drop(targetId: string) {
    if (!draggedId.current || draggedId.current === targetId) return;
    const source = photos.findIndex(photo => photo.id === draggedId.current);
    const target = photos.findIndex(photo => photo.id === targetId);
    const next = [...photos];
    const [item] = next.splice(source, 1);
    next.splice(target, 0, item);
    draggedId.current = null;
    onChange(normalize(next));
  }

  return <section className="rounded-[1.8rem] border border-black/[.035] bg-white p-5 shadow-card sm:p-7">
    <div className="flex items-start justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-moss">Tu álbum</p><h2 className="mt-1 text-xl font-semibold tracking-[-.035em]">Fotografías</h2><p className="mt-2 max-w-xl text-xs leading-5 text-ink/45">Se optimizan antes de subirlas. Arrastra para ordenar y elige la imagen que abrirá el recuerdo.</p></div><span className="rounded-full bg-canvas px-3 py-1.5 text-[10px] font-bold text-moss">{photos.length}/{MAX_PHOTOS}</span></div>

    <input ref={inputRef} type="file" multiple accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={event => void addFiles(event.target.files)}/>
    <button type="button" disabled={isOptimizing || photos.length >= MAX_PHOTOS} onClick={() => inputRef.current?.click()} className="tap-scale mt-5 flex min-h-28 w-full items-center justify-center gap-3 rounded-[1.35rem] border border-dashed border-forest/20 bg-forest/[.025] text-sm font-semibold text-forest transition-colors hover:bg-forest/[.055] disabled:opacity-50">
      {isOptimizing ? <><LoaderCircle size={20} className="animate-spin"/>Optimizando fotografías…</> : <><ImagePlus size={20}/>Añadir fotografías</>}
    </button>

    {photos.length > 0 && <div className="mt-4 grid gap-3 sm:grid-cols-2">
      {photos.map((photo, index) => <article key={photo.id} draggable onDragStart={() => { draggedId.current = photo.id; }} onDragOver={event => event.preventDefault()} onDrop={() => drop(photo.id)} className="group overflow-hidden rounded-[1.25rem] border border-black/[.05] bg-canvas/55">
        <div className="relative aspect-[4/3] overflow-hidden"><ResponsivePhoto src={photo.previewUrl} fallbackSrc="/peakbook-hero.png" alt={`Fotografía ${index + 1}`} sizes="(max-width: 640px) 100vw, 50vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.025]"/>
          <div className="absolute inset-x-3 top-3 flex items-center justify-between"><span className="flex h-8 items-center gap-1 rounded-full bg-black/45 px-2.5 text-[10px] font-semibold text-white backdrop-blur-xl"><GripVertical size={13}/> {index + 1}</span>{photo.portada && <span className="flex h-8 items-center gap-1 rounded-full bg-[#d9f27b] px-3 text-[10px] font-bold text-forest"><Check size={13}/>Portada</span>}</div>
        </div>
        <div className="flex items-center gap-2 p-3"><button type="button" onClick={() => setCover(photo.id)} className={`tap-scale flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-[11px] font-semibold ${photo.portada ? "bg-forest text-white" : "bg-white text-forest"}`}><Star size={14}/>{photo.portada ? "Es portada" : "Usar de portada"}</button><button type="button" disabled={index === 0} onClick={() => move(photo.id, -1)} aria-label="Mover fotografía a la izquierda" className="tap-scale grid h-9 w-9 place-items-center rounded-xl bg-white text-ink/55 disabled:opacity-25"><ArrowLeft size={14}/></button><button type="button" disabled={index === photos.length - 1} onClick={() => move(photo.id, 1)} aria-label="Mover fotografía a la derecha" className="tap-scale grid h-9 w-9 place-items-center rounded-xl bg-white text-ink/55 disabled:opacity-25"><ArrowRight size={14}/></button><button type="button" onClick={() => remove(photo.id)} aria-label="Eliminar fotografía" className="tap-scale grid h-9 w-9 place-items-center rounded-xl bg-[#a84539]/10 text-[#a84539]"><Trash2 size={14}/></button></div>
      </article>)}
    </div>}

    {photos.length === 0 && <div className="mt-5 flex items-center gap-3 rounded-[1.25rem] bg-canvas/70 p-4 text-ink/45"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-moss"><Camera size={18}/></span><p className="text-xs leading-5">Puedes guardar la aventura sin fotos y añadirlas después.</p></div>}
    {error && <p role="alert" className="mt-4 rounded-xl bg-[#b85143]/[.07] px-4 py-3 text-xs text-[#913e34]">{error}</p>}
  </section>;
}

function normalize(photos: PhotoDraft[]) {
  const hasCover = photos.some(({ portada }) => portada);
  return photos.map((photo, index) => ({ ...photo, orden: index + 1, portada: hasCover ? photo.portada : index === 0 }));
}
