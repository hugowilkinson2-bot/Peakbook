"use client";

import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { useAdventures } from "@/features/adventures/application/adventure-provider";
import { useMemoryAlbum } from "@/features/memories/application/use-memory-album";
import { MemoriesEmpty, MemoriesSkeleton } from "@/features/memories/components/memories-empty";
import { MemoryCard } from "@/features/memories/components/memory-card";
import { MemoryHighlights } from "@/features/memories/components/memory-highlights";
import { BookHeart, Sparkles } from "lucide-react";

export default function MemoriesPage() {
  const { adventures, isLoading } = useAdventures();
  const { memories, anniversary, bestPhotograph, latestSummit, isEnriching } = useMemoryAlbum(adventures);

  return (
    <AppShell>
      <PageHeader />

      <header className="memories-intro relative overflow-hidden py-4 sm:py-8 md:py-12">
        <div className="pointer-events-none absolute -left-20 top-0 h-56 w-56 rounded-full bg-lime/15 blur-3xl" />
        <div className="relative">
          <div className="mb-5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.22em] text-forest/60">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-forest text-lime shadow-sm"><BookHeart size={15} /></span>
            Recuerdos
          </div>
          <h1 className="max-w-4xl text-[3.25rem] font-semibold leading-[.9] tracking-[-.075em] text-ink sm:text-6xl md:text-7xl lg:text-[5.4rem]">
            Todo lo que sentiste <span className="text-forest/38">sigue aquí.</span>
          </h1>
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <p className="max-w-lg text-sm leading-relaxed text-ink/48 sm:text-base">Un álbum vivo de los lugares que alcanzaste, las cimas que te cambiaron y los días que no quieres olvidar.</p>
            {memories.length > 0 && (
              <div className="flex items-center gap-2 text-xs font-semibold text-forest">
                <Sparkles size={15} className={isEnriching ? "animate-pulse" : ""} />
                {memories.length} {memories.length === 1 ? "historia guardada" : "historias guardadas"}
              </div>
            )}
          </div>
        </div>
      </header>

      {isLoading ? (
        <MemoriesSkeleton />
      ) : memories.length === 0 ? (
        <MemoriesEmpty />
      ) : (
        <>
          <MemoryHighlights anniversary={anniversary} bestPhotograph={bestPhotograph} latestSummit={latestSummit} />

          <section className="mt-16 sm:mt-24">
            <div className="mb-8 sm:mb-11 md:pl-14">
              <p className="text-[10px] font-bold uppercase tracking-[.2em] text-moss">Tu historia</p>
              <h2 className="mt-1.5 text-3xl font-semibold tracking-[-.055em] sm:text-4xl">Una vida, aventura a aventura.</h2>
            </div>
            <div className="memory-timeline relative space-y-8 pb-8 sm:space-y-12">
              {memories.map((memory, index) => <MemoryCard key={memory.adventure.id} memory={memory} index={index} />)}
            </div>
          </section>
        </>
      )}
    </AppShell>
  );
}

