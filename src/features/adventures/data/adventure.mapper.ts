import type { Tables } from "@/types/database.types";
import type { Adventure } from "../domain/adventure";

export function toAdventure(row: Tables<"adventures">): Adventure {
  return {
    id: row.id,
    titulo: row.titulo,
    fecha: row.fecha,
    descripcion: row.descripcion,
    distancia: row.distancia,
    desnivelPositivo: row.desnivel_positivo,
    desnivelNegativo: row.desnivel_negativo,
    tiempo: row.tiempo,
    dificultad: row.dificultad,
    sensaciones: row.sensaciones,
    meteorologia: row.meteorologia,
    createdAt: row.created_at,
  };
}
