import type { Adventure, AdventureInput, AdventurePhoto, AdventureUpdate, PeakReference } from "../domain/adventure";
import type { Tables, TablesInsert, TablesUpdate } from "@/types/database.types";

export function toAdventure(row: Tables<"adventures">, enrichment?: { peak?: PeakReference | null; photos?: AdventurePhoto[] }): Adventure {
  return {
    id: row.id,
    titulo: row.titulo,
    fecha: row.fecha,
    notas: row.notas,
    distancia: row.distancia,
    desnivelPositivo: row.desnivel_positivo,
    desnivelNegativo: row.desnivel_negativo,
    tiempo: row.tiempo,
    dificultad: row.dificultad,
    sensaciones: row.sensaciones,
    meteorologia: row.meteorologia,
    createdAt: row.created_at,
    peak: enrichment?.peak ?? null,
    photos: enrichment?.photos ?? [],
  };
}

export function toAdventureInsert(input: AdventureInput): TablesInsert<"adventures"> {
  return {
    titulo: input.titulo,
    fecha: input.fecha,
    notas: input.notas,
    distancia: input.distancia,
    desnivel_positivo: input.desnivelPositivo,
    desnivel_negativo: input.desnivelNegativo,
    tiempo: input.tiempo,
    dificultad: input.dificultad,
    sensaciones: input.sensaciones,
    meteorologia: input.meteorologia,
  };
}

export function toAdventureUpdate(input: AdventureUpdate): TablesUpdate<"adventures"> {
  const row: TablesUpdate<"adventures"> = {};
  if (input.titulo !== undefined) row.titulo = input.titulo;
  if (input.fecha !== undefined) row.fecha = input.fecha;
  if (input.notas !== undefined) row.notas = input.notas;
  if (input.distancia !== undefined) row.distancia = input.distancia;
  if (input.desnivelPositivo !== undefined) row.desnivel_positivo = input.desnivelPositivo;
  if (input.desnivelNegativo !== undefined) row.desnivel_negativo = input.desnivelNegativo;
  if (input.tiempo !== undefined) row.tiempo = input.tiempo;
  if (input.dificultad !== undefined) row.dificultad = input.dificultad;
  if (input.sensaciones !== undefined) row.sensaciones = input.sensaciones;
  if (input.meteorologia !== undefined) row.meteorologia = input.meteorologia;
  return row;
}
