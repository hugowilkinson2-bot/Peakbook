import { ensureSupabaseSession, type createClient } from "@/lib/supabase/client";
import type { Tables, TablesInsert } from "@/types/database.types";
import type { Adventure, AdventureMutation, AdventurePhoto, PeakReference, PhotoDraft } from "../domain/adventure";
import type { AdventureRepository } from "../domain/adventure-repository";
import { toAdventure, toAdventureInsert, toAdventureUpdate } from "./adventure.mapper";

const PHOTO_BUCKET = "adventure-photos";
const SIGNED_URL_TTL = 60 * 60 * 6;

type RelationRow = { adventure_id: string; peak_id: string; peaks: Tables<"peaks"> | null };

export class SupabaseAdventureRepository implements AdventureRepository {
  constructor(private readonly client: NonNullable<ReturnType<typeof createClient>>) {}

  async list(): Promise<Adventure[]> {
    await ensureSupabaseSession(this.client);
    const { data, error } = await this.client.from("adventures").select("*").order("fecha", { ascending: false });
    if (error) throw new Error(error.message);
    return this.enrich(data);
  }

  async findById(id: string): Promise<Adventure | null> {
    await ensureSupabaseSession(this.client);
    const { data, error } = await this.client.from("adventures").select("*").eq("id", id).maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) return null;
    return (await this.enrich([data]))[0] ?? null;
  }

  async create(mutation: AdventureMutation): Promise<Adventure> {
    const session = await ensureSupabaseSession(this.client);
    const createdPaths: string[] = [];
    const { data, error } = await this.client.from("adventures").insert([toAdventureInsert(mutation.input)]).select("*").single();
    if (error) throw new Error(error.message);

    try {
      const relation = await this.client.from("adventure_peaks").insert({ adventure_id: data.id, peak_id: mutation.peak.id, orden: 1 });
      if (relation.error) throw new Error(relation.error.message);
      const rows = await this.preparePhotoRows(data.id, session.user.id, mutation.photos, createdPaths);
      if (rows.length > 0) {
        const photoResult = await this.client.from("photos").insert(rows);
        if (photoResult.error) throw new Error(photoResult.error.message);
      }
      return (await this.findById(data.id)) ?? toAdventure(data, { peak: mutation.peak });
    } catch (cause) {
      if (createdPaths.length > 0) await this.client.storage.from(PHOTO_BUCKET).remove(createdPaths);
      await this.client.from("adventures").delete().eq("id", data.id);
      throw cause;
    }
  }

  async update(id: string, mutation: AdventureMutation): Promise<Adventure> {
    const session = await ensureSupabaseSession(this.client);
    const previous = await this.findById(id);
    if (!previous) throw new Error("La aventura ya no está disponible.");

    const { error } = await this.client.from("adventures").update(toAdventureUpdate(mutation.input)).eq("id", id);
    if (error) throw new Error(error.message);

    const removeRelation = await this.client.from("adventure_peaks").delete().eq("adventure_id", id);
    if (removeRelation.error) throw new Error(removeRelation.error.message);
    const relation = await this.client.from("adventure_peaks").insert({ adventure_id: id, peak_id: mutation.peak.id, orden: 1 });
    if (relation.error) throw new Error(relation.error.message);

    const createdPaths: string[] = [];
    try {
      for (let index = 0; index < previous.photos.length; index += 1) {
        const photo = previous.photos[index];
        const shifted = await this.client.from("photos").update({ orden: 1000 + index, portada: false }).eq("id", photo.id);
        if (shifted.error) throw new Error(shifted.error.message);
      }

      const rows = await this.preparePhotoRows(id, session.user.id, mutation.photos, createdPaths);
      for (const row of rows) {
        const upserted = await this.client.from("photos").upsert(row);
        if (upserted.error) throw new Error(upserted.error.message);
      }

      const retainedIds = new Set(rows.map(({ id: photoId }) => photoId).filter(Boolean));
      const removed = previous.photos.filter(({ id: photoId }) => !retainedIds.has(photoId));
      if (removed.length > 0) {
        const deleted = await this.client.from("photos").delete().in("id", removed.map(({ id: photoId }) => photoId));
        if (deleted.error) throw new Error(deleted.error.message);
        const paths = removed.map(({ storagePath }) => storageObjectPath(storagePath)).filter((path): path is string => Boolean(path));
        if (paths.length > 0) await this.client.storage.from(PHOTO_BUCKET).remove(paths);
      }

      return (await this.findById(id)) ?? { ...previous, ...mutation.input, peak: mutation.peak };
    } catch (cause) {
      if (createdPaths.length > 0) await this.client.storage.from(PHOTO_BUCKET).remove(createdPaths);
      throw cause;
    }
  }

  async delete(id: string): Promise<void> {
    await ensureSupabaseSession(this.client);
    const { data: photos, error: photoError } = await this.client.from("photos").select("url").eq("adventure_id", id);
    if (photoError) throw new Error(photoError.message);
    const paths = photos.map(({ url }) => storageObjectPath(url)).filter((path): path is string => Boolean(path));
    if (paths.length > 0) await this.client.storage.from(PHOTO_BUCKET).remove(paths);
    const { error } = await this.client.from("adventures").delete().eq("id", id);
    if (error) throw new Error(error.message);
  }

  private async enrich(rows: Tables<"adventures">[]): Promise<Adventure[]> {
    if (rows.length === 0) return [];
    const ids = rows.map(({ id }) => id);
    const [relationsResult, photosResult] = await Promise.all([
      this.client.from("adventure_peaks").select("adventure_id, peak_id, peaks(*)").in("adventure_id", ids).order("orden"),
      this.client.from("photos").select("*").in("adventure_id", ids).order("orden"),
    ]);
    if (relationsResult.error) throw new Error(relationsResult.error.message);
    if (photosResult.error) throw new Error(photosResult.error.message);

    const peaks = new Map<string, PeakReference>();
    for (const relation of relationsResult.data as unknown as RelationRow[]) {
      if (relation.peaks) peaks.set(relation.adventure_id, mapPeak(relation.peaks));
    }

    const signed = await Promise.all((photosResult.data as Tables<"photos">[]).map(async row => mapPhoto(row, await this.resolvePhotoUrl(row.url))));
    const photosByAdventure = new Map<string, AdventurePhoto[]>();
    for (const photo of signed) photosByAdventure.set(photo.adventureId, [...(photosByAdventure.get(photo.adventureId) ?? []), photo]);

    return rows.map(row => toAdventure(row, { peak: peaks.get(row.id) ?? null, photos: photosByAdventure.get(row.id) ?? [] }));
  }

  private async preparePhotoRows(adventureId: string, userId: string, drafts: PhotoDraft[], createdPaths: string[]) {
    const rows: TablesInsert<"photos">[] = [];
    for (let index = 0; index < drafts.length; index += 1) {
      const draft = drafts[index];
      let path = draft.storagePath;
      if (draft.blob) {
        path = `${userId}/${adventureId}/${crypto.randomUUID()}.webp`;
        const upload = await this.client.storage.from(PHOTO_BUCKET).upload(path, draft.blob, { contentType: draft.mimeType, cacheControl: "31536000", upsert: false });
        if (upload.error) throw new Error(`No se pudo subir una fotografía: ${upload.error.message}`);
        createdPaths.push(path);
      }
      if (!path) continue;
      rows.push({
        id: draft.id,
        adventure_id: adventureId,
        url: path,
        portada: draft.portada,
        descripcion: draft.descripcion,
        orden: index + 1,
        width: draft.width || null,
        height: draft.height || null,
        bytes: draft.bytes || null,
        mime_type: draft.mimeType || null,
      });
    }
    if (rows.length > 0 && !rows.some(({ portada }) => portada)) rows[0].portada = true;
    if (rows.filter(({ portada }) => portada).length > 1) {
      const coverIndex = rows.findIndex(({ portada }) => portada);
      rows.forEach((row, index) => { row.portada = index === coverIndex; });
    }
    return rows;
  }

  private async resolvePhotoUrl(path: string) {
    if (/^(https?:\/\/|\/)/.test(path)) return path;
    const { data, error } = await this.client.storage.from(PHOTO_BUCKET).createSignedUrl(path, SIGNED_URL_TTL);
    if (error) return "/peakbook-hero.png";
    return data.signedUrl;
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

function mapPhoto(row: Tables<"photos">, url: string): AdventurePhoto {
  return {
    id: row.id,
    adventureId: row.adventure_id,
    storagePath: row.url,
    url,
    portada: row.portada,
    descripcion: row.descripcion,
    orden: row.orden,
    width: row.width,
    height: row.height,
    bytes: row.bytes,
    mimeType: row.mime_type,
  };
}

function storageObjectPath(value: string) {
  return /^(https?:\/\/|\/)/.test(value) ? null : value;
}
