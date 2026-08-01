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
}

export type AdventureInput = Omit<Adventure, "id" | "createdAt">;
export type AdventureUpdate = Partial<AdventureInput>;

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
