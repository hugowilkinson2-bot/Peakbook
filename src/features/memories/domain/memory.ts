import type { Adventure } from "@/features/adventures/domain/adventure";

export type MemoryPeak = {
  id: string;
  nombre: string;
  altitud: number;
  orden: number;
};

export type MemoryPhoto = {
  id: string;
  adventureId: string;
  url: string;
  portada: boolean;
  descripcion: string | null;
};

export type MemoryEnrichment = {
  peaksByAdventure: Map<string, MemoryPeak[]>;
  photosByAdventure: Map<string, MemoryPhoto[]>;
};

export type AdventureMemory = {
  adventure: Adventure;
  peaks: MemoryPeak[];
  photos: MemoryPhoto[];
  cover: {
    src: string;
    alt: string;
    isPrimary: boolean;
  };
};

