"use client";

import { useEffect, useMemo, useState } from "react";
import type { Adventure } from "@/features/adventures/domain/adventure";
import { createClient } from "@/lib/supabase/client";
import { SupabaseMemoryRepository } from "../data/supabase-memory.repository";
import type { AdventureMemory, MemoryEnrichment } from "../domain/memory";

const editorialCovers = [
  "/memories-dawn.png",
  "/memories-lake.png",
  "/memories-summit.png",
] as const;

const emptyEnrichment: MemoryEnrichment = {
  peaksByAdventure: new Map(),
  photosByAdventure: new Map(),
};

export function useMemoryAlbum(adventures: Adventure[]) {
  const [enrichment, setEnrichment] = useState<MemoryEnrichment>(emptyEnrichment);
  const [isEnriching, setIsEnriching] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const client = createClient();

    if (!client || adventures.length === 0) {
      setEnrichment(emptyEnrichment);
      setIsEnriching(false);
      return () => { cancelled = true; };
    }

    setIsEnriching(true);
    const repository = new SupabaseMemoryRepository(client);
    void repository
      .getEnrichment(adventures.map(({ id }) => id))
      .then((result) => { if (!cancelled) setEnrichment(result); })
      .catch(() => { if (!cancelled) setEnrichment(emptyEnrichment); })
      .finally(() => { if (!cancelled) setIsEnriching(false); });

    return () => { cancelled = true; };
  }, [adventures]);

  const memories = useMemo(
    () => curateMemories(adventures, enrichment),
    [adventures, enrichment],
  );

  const anniversary = useMemo(() => findOneYearMemory(memories), [memories]);
  const bestPhotograph = memories.find(({ cover }) => cover.isPrimary) ?? memories[0] ?? null;
  const latestSummit = memories.find(({ peaks }) => peaks.length > 0) ?? null;

  return { memories, anniversary, bestPhotograph, latestSummit, isEnriching };
}

export function curateMemories(
  adventures: Adventure[],
  enrichment: MemoryEnrichment = emptyEnrichment,
): AdventureMemory[] {
  return adventures.map((adventure) => {
    const photos = enrichment.photosByAdventure.get(adventure.id) ?? [];
    const primary = photos.find(({ portada }) => portada) ?? photos[0];
    const fallback = editorialCovers[stableCoverIndex(adventure.id)];
    return {
      adventure,
      photos,
      peaks: enrichment.peaksByAdventure.get(adventure.id) ?? [],
      cover: {
        src: primary?.url ?? fallback,
        alt: primary?.descripcion ?? `Recuerdo de ${adventure.titulo}`,
        isPrimary: Boolean(primary?.portada),
      },
    };
  });
}

export function findOneYearMemory(
  memories: AdventureMemory[],
  now = new Date(),
): AdventureMemory | null {
  const target = new Date(now);
  target.setHours(12, 0, 0, 0);
  target.setFullYear(target.getFullYear() - 1);

  return memories
    .map((memory) => ({
      memory,
      distance: Math.abs(parseAdventureDate(memory.adventure.fecha).getTime() - target.getTime()),
    }))
    .filter(({ distance }) => distance <= 7 * 24 * 60 * 60 * 1000)
    .sort((a, b) => a.distance - b.distance)[0]?.memory ?? null;
}

function parseAdventureDate(value: string) {
  return new Date(`${value}T12:00:00`);
}

function stableCoverIndex(id: string) {
  let hash = 0;
  for (const character of id) hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  return hash % editorialCovers.length;
}

