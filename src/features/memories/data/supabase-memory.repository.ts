import { ensureSupabaseSession, type createClient } from "@/lib/supabase/client";
import type { MemoryEnrichment, MemoryPeak, MemoryPhoto } from "../domain/memory";

type PeakRelationRow = {
  adventure_id: string;
  orden: number;
  peaks: { id: string; nombre: string; altitud: number } | null;
};

type PhotoRow = {
  id: string;
  adventure_id: string;
  url: string;
  portada: boolean;
  descripcion: string | null;
};

export class SupabaseMemoryRepository {
  constructor(private readonly client: NonNullable<ReturnType<typeof createClient>>) {}

  async getEnrichment(adventureIds: string[]): Promise<MemoryEnrichment> {
    await ensureSupabaseSession(this.client);
    const [peakResult, photoResult] = await Promise.all([
      this.client
        .from("adventure_peaks")
        .select("adventure_id, orden, peaks(id, nombre, altitud)")
        .in("adventure_id", adventureIds)
        .order("orden", { ascending: true }),
      this.client
        .from("photos")
        .select("id, adventure_id, url, portada, descripcion")
        .in("adventure_id", adventureIds),
    ]);

    if (peakResult.error) throw new Error(peakResult.error.message);
    if (photoResult.error) throw new Error(photoResult.error.message);

    const peaksByAdventure = new Map<string, MemoryPeak[]>();
    for (const row of peakResult.data as unknown as PeakRelationRow[]) {
      if (!row.peaks) continue;
      const current = peaksByAdventure.get(row.adventure_id) ?? [];
      current.push({ ...row.peaks, orden: row.orden });
      peaksByAdventure.set(row.adventure_id, current);
    }

    const photosByAdventure = new Map<string, MemoryPhoto[]>();
    for (const row of photoResult.data as PhotoRow[]) {
      const current = photosByAdventure.get(row.adventure_id) ?? [];
      current.push({
        id: row.id,
        adventureId: row.adventure_id,
        url: row.url,
        portada: row.portada,
        descripcion: row.descripcion,
      });
      photosByAdventure.set(row.adventure_id, current);
    }

    return { peaksByAdventure, photosByAdventure };
  }
}
