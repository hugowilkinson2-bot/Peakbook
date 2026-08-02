import type { Json } from "@/types/database.types";

export type AdventureDifficulty = "facil" | "moderada" | "dificil" | "experta";

export interface Adventure {
  id: string;
  titulo: string;
  fecha: string;
  notas: string | null;
  distancia: number;
  desnivelPositivo: number;
  desnivelNegativo: number;
  tiempo: number;
  dificultad: AdventureDifficulty;
  sensaciones: string | null;
  meteorologia: Json;
  createdAt: string;
  peak: PeakReference | null;
  photos: AdventurePhoto[];
}

export type AdventureInput = Omit<Adventure, "id" | "createdAt" | "peak" | "photos">;
export type AdventureUpdate = Partial<AdventureInput>;

export interface PeakReference {
  id: string;
  nombre: string;
  altitud: number;
  latitud: number;
  longitud: number;
  provincia: string | null;
  pais: string;
  dificultad: AdventureDifficulty;
  fotoPrincipalUrl: string | null;
  globeId: string;
}

export interface AdventurePhoto {
  id: string;
  adventureId: string;
  storagePath: string;
  url: string;
  portada: boolean;
  descripcion: string | null;
  orden: number;
  width: number | null;
  height: number | null;
  bytes: number | null;
  mimeType: string | null;
}

export interface PhotoDraft {
  id: string;
  storagePath: string | null;
  previewUrl: string;
  blob: Blob | null;
  portada: boolean;
  descripcion: string | null;
  orden: number;
  width: number;
  height: number;
  bytes: number;
  mimeType: string;
}

export interface AdventureMutation {
  input: AdventureInput;
  peak: PeakReference;
  photos: PhotoDraft[];
}

export interface AdventureSaveResult {
  adventure: Adventure;
  warning: string | null;
}

export interface Peak { id: string; nombre: string; altitud: number; latitud: number; longitud: number; provincia: string | null; pais: string }
export interface AdventurePeak { adventureId: string; peakId: string; orden: number }
export interface Photo { id: string; adventureId: string; url: string; portada: boolean; descripcion: string | null }
export interface Equipment { id: string; nombre: string; categoria: string; marca: string | null; modelo: string | null }
export interface AdventureEquipment { adventureId: string; equipmentId: string }
export interface Person { id: string; nombre: string }
export interface AdventurePerson { adventureId: string; personId: string }

export type AdventureDetail = Adventure & {
  peaks: Array<Peak & { orden: number }>;
  photos: Photo[];
  equipment: Equipment[];
  people: Person[];
};
