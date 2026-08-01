import { ensureSupabaseSession, type createClient } from "@/lib/supabase/client";
import type { Tables } from "@/types/database.types";
import type { PeakReference } from "../domain/adventure";

export class SupabasePeakSearchRepository {
  constructor(private readonly client: NonNullable<ReturnType<typeof createClient>>) {}

  async search(query: string, limit = 8): Promise<PeakReference[]> {
    await ensureSupabaseSession(this.client);
    const { data, error } = await this.client.rpc("search_peaks", { p_query: query, p_limit: limit });
    if (error) throw new Error(error.message);
    return data.map(mapPeak);
  }
}

function mapPeak(row: Tables<"peaks">): PeakReference {
  return {
    id: row.id,
    nombre: row.nombre,
    altitud: row.altitud,
    latitud: row.latitud,
    longitud: row.longitud,
    provincia: row.provincia,
    pais: row.pais,
    dificultad: row.dificultad,
    fotoPrincipalUrl: row.foto_principal_url,
    globeId: row.globe_id,
  };
}
