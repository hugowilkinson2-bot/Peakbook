import { ensureSupabaseSession, type createClient } from "@/lib/supabase/client";
import type { Tables } from "@/types/database.types";
import { calculatePeakStats, toGlobePosition, type PeakAscent, type PeakProfile } from "../domain/peak";

type RelationRow = {
  peak_id: string;
  adventure_id: string;
  adventures: Tables<"adventures"> | null;
};

type PhotoRow = Tables<"photos">;

const fallbackImages = ["/peak-aneto.png", "/peak-mulhacen.png", "/peak-teide.png", "/peak-midi-ossau.png"];

export class SupabasePeakRepository {
  constructor(private readonly client: NonNullable<ReturnType<typeof createClient>>) {}

  async list(): Promise<PeakProfile[]> {
    await ensureSupabaseSession(this.client);
    const [peaksResult, relationsResult, photosResult] = await Promise.all([
      this.client.from("peaks").select("*").order("altitud", { ascending: false }),
      this.client.from("adventure_peaks").select("peak_id, adventure_id, adventures(*)"),
      this.client.from("photos").select("*"),
    ]);

    if (peaksResult.error) throw new Error(peaksResult.error.message);
    if (relationsResult.error) throw new Error(relationsResult.error.message);
    if (photosResult.error) throw new Error(photosResult.error.message);

    const resolvedPhotos = await Promise.all((photosResult.data as PhotoRow[]).map(async photo => ({ ...photo, url: await this.resolvePhotoUrl(photo.url) })));
    const photosByAdventure = groupPhotos(resolvedPhotos);
    const ascentsByPeak = new Map<string, PeakAscent[]>();

    for (const relation of relationsResult.data as unknown as RelationRow[]) {
      const adventure = relation.adventures;
      if (!adventure) continue;
      const photos = photosByAdventure.get(relation.adventure_id) ?? [];
      const cover = photos.find(({ portada }) => portada)?.url ?? photos[0]?.url ?? fallbackForId(relation.peak_id);
      const current = ascentsByPeak.get(relation.peak_id) ?? [];
      current.push({
        id: `${relation.peak_id}:${relation.adventure_id}`,
        adventureId: relation.adventure_id,
        title: adventure.titulo,
        date: adventure.fecha,
        distance: adventure.distancia,
        elevationGain: adventure.desnivel_positivo,
        duration: adventure.tiempo,
        difficulty: adventure.dificultad,
        cover,
        note: adventure.notas,
      });
      ascentsByPeak.set(relation.peak_id, current);
    }

    return peaksResult.data.map((row) => {
      const ascents = (ascentsByPeak.get(row.id) ?? []).sort((a, b) => b.date.localeCompare(a.date));
      const coordinates = { latitude: row.latitud, longitude: row.longitud };
      return {
        id: row.id,
        globeId: row.globe_id,
        name: row.nombre,
        altitude: row.altitud,
        province: row.provincia ?? "Provincia por completar",
        country: row.pais,
        coordinates,
        difficulty: row.dificultad,
        heroImage: row.foto_principal_url ?? fallbackForId(row.id),
        description: row.descripcion ?? `Una cima de ${row.altitud.toLocaleString("es-ES")} metros que espera formar parte de tu historia.`,
        ascents,
        stats: calculatePeakStats(ascents),
        status: ascents.length > 0 ? "conquered" : "pending",
        globePosition: toGlobePosition(row.id, coordinates, row.altitud),
      } satisfies PeakProfile;
    });
  }

  private async resolvePhotoUrl(path: string) {
    if (/^(https?:\/\/|\/)/.test(path)) return path;
    const { data, error } = await this.client.storage.from("adventure-photos").createSignedUrl(path, 60 * 60 * 6);
    return error ? fallbackForId(path) : data.signedUrl;
  }
}

function groupPhotos(photos: PhotoRow[]) {
  const grouped = new Map<string, PhotoRow[]>();
  for (const photo of photos) {
    const current = grouped.get(photo.adventure_id) ?? [];
    current.push(photo);
    grouped.set(photo.adventure_id, current);
  }
  return grouped;
}

function fallbackForId(id: string) {
  let hash = 0;
  for (const character of id) hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  return fallbackImages[hash % fallbackImages.length];
}
