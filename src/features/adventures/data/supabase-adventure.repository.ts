import { withTimeout } from "@/lib/async-timeout";
import { ensureSupabaseSession, type createClient } from "@/lib/supabase/client";
import type { Tables, TablesInsert } from "@/types/database.types";
import { validatePhotoDraft } from "../application/photo-policy";
import type { Adventure, AdventureMutation, AdventurePhoto, AdventureSaveResult, PeakReference, PhotoDraft } from "../domain/adventure";
import type { AdventureRepository } from "../domain/adventure-repository";
import { toAdventure, toAdventureInsert, toAdventureUpdate } from "./adventure.mapper";

const PHOTO_BUCKET = "adventure-photos";
const PHOTO_FALLBACK = "/peakbook-hero.png";
const SIGNED_URL_TTL = 60 * 60 * 6;
const STORAGE_TIMEOUT_MS = 28_000;
const SIGNING_TIMEOUT_MS = 8_000;
const DATABASE_TIMEOUT_MS = 28_000;
const TEMPORARY_ORDER_BASE = 20_000;

type RelationRow = { adventure_id: string; peak_id: string; peaks: Tables<"peaks"> | null };
type PhotoRow = Tables<"photos">;

export class SupabaseAdventureRepository implements AdventureRepository {
  constructor(private readonly client: NonNullable<ReturnType<typeof createClient>>) {}

  async list(): Promise<Adventure[]> {
    await ensureSupabaseSession(this.client);
    void this.cleanupFailedPhotos();
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

  async create(mutation: AdventureMutation): Promise<AdventureSaveResult> {
    const session = await ensureSupabaseSession(this.client);
    const creation = await withTimeout(
      this.client.from("adventures").insert([toAdventureInsert(mutation.input)]).select("*").single(),
      DATABASE_TIMEOUT_MS,
      "Supabase tardó demasiado en guardar la aventura.",
    );
    if (creation.error) throw new Error(creation.error.message);

    const relation = await withTimeout(
      this.client.from("adventure_peaks").insert({ adventure_id: creation.data.id, peak_id: mutation.peak.id, orden: 1 }),
      DATABASE_TIMEOUT_MS,
      "Supabase tardó demasiado en asociar la cima.",
    );
    if (relation.error) throw new Error(relation.error.message);

    const photoFailures = await this.addNewPhotos(creation.data.id, session.user.id, mutation.photos);
    const layoutFailure = await this.applyPhotoLayout(creation.data.id, mutation.photos);
    const warning = photoWarning(photoFailures + (layoutFailure ? 1 : 0));
    const fallback = toAdventure(creation.data, { peak: mutation.peak });
    const adventure = await this.loadSavedAdventure(creation.data.id, fallback);
    return { adventure, warning };
  }

  async update(id: string, mutation: AdventureMutation): Promise<AdventureSaveResult> {
    const session = await ensureSupabaseSession(this.client);
    const previous = await this.findById(id);
    if (!previous) throw new Error("La aventura ya no está disponible.");

    const update = await withTimeout(
      this.client.from("adventures").update(toAdventureUpdate(mutation.input)).eq("id", id),
      DATABASE_TIMEOUT_MS,
      "Supabase tardó demasiado en actualizar la aventura.",
    );
    if (update.error) throw new Error(update.error.message);

    const removeRelation = await this.client.from("adventure_peaks").delete().eq("adventure_id", id);
    if (removeRelation.error) throw new Error(removeRelation.error.message);
    const relation = await this.client.from("adventure_peaks").insert({ adventure_id: id, peak_id: mutation.peak.id, orden: 1 });
    if (relation.error) throw new Error(relation.error.message);

    let photoFailures = await this.addNewPhotos(id, session.user.id, mutation.photos.filter(photo => Boolean(photo.blob)));
    const requestedIds = new Set(mutation.photos.map(photo => photo.id));
    const removed = previous.photos.filter(photo => !requestedIds.has(photo.id));
    for (const photo of removed) {
      const removedCleanly = await this.removeStoredPhoto(photo);
      if (!removedCleanly) photoFailures += 1;
    }

    const layoutFailure = await this.applyPhotoLayout(id, mutation.photos);
    if (layoutFailure) photoFailures += 1;
    const fallback: Adventure = { ...previous, ...mutation.input, peak: mutation.peak };
    const adventure = await this.loadSavedAdventure(id, fallback);
    return { adventure, warning: photoWarning(photoFailures) };
  }

  async delete(id: string): Promise<void> {
    await ensureSupabaseSession(this.client);
    const { data: photos, error: photoError } = await this.client.from("photos").select("url").eq("adventure_id", id);
    if (photoError) throw new Error(photoError.message);
    const paths = photos.map(({ url }) => storageObjectPath(url)).filter((path): path is string => Boolean(path));
    if (paths.length > 0 && !(await this.removePaths(paths))) {
      throw new Error("No se pudo eliminar la aventura porque sus fotografías siguen en Storage. Inténtalo de nuevo.");
    }
    const deletion = await withTimeout(
      this.client.from("adventures").delete().eq("id", id),
      DATABASE_TIMEOUT_MS,
      "Supabase tardó demasiado en eliminar la aventura.",
    );
    if (deletion.error) throw new Error(deletion.error.message);
  }

  private async enrich(rows: Tables<"adventures">[]): Promise<Adventure[]> {
    if (rows.length === 0) return [];
    const ids = rows.map(({ id }) => id);
    const [relationsResult, photosResult] = await Promise.all([
      this.client.from("adventure_peaks").select("adventure_id, peak_id, peaks(*)").in("adventure_id", ids).order("orden"),
      this.client.from("photos").select("*").in("adventure_id", ids).eq("upload_status", "ready").order("orden"),
    ]);
    if (relationsResult.error) throw new Error(relationsResult.error.message);
    if (photosResult.error) throw new Error(photosResult.error.message);

    const peaks = new Map<string, PeakReference>();
    for (const relation of relationsResult.data as unknown as RelationRow[]) {
      if (relation.peaks) peaks.set(relation.adventure_id, mapPeak(relation.peaks));
    }

    const photoRows = photosResult.data as PhotoRow[];
    const urls = await this.resolvePhotoUrls(photoRows);
    const photosByAdventure = new Map<string, AdventurePhoto[]>();
    for (const row of photoRows) {
      const photo = mapPhoto(row, urls.get(row.url) ?? PHOTO_FALLBACK);
      photosByAdventure.set(photo.adventureId, [...(photosByAdventure.get(photo.adventureId) ?? []), photo]);
    }

    return rows.map(row => toAdventure(row, { peak: peaks.get(row.id) ?? null, photos: photosByAdventure.get(row.id) ?? [] }));
  }

  private async addNewPhotos(adventureId: string, userId: string, drafts: PhotoDraft[]) {
    let failures = 0;
    for (let index = 0; index < drafts.length; index += 1) {
      const draft = drafts[index];
      if (!draft.blob) continue;
      try {
        validatePhotoDraft(draft);
        await this.persistPhotoIntent(adventureId, userId, draft, index);
      } catch {
        failures += 1;
      }
    }
    return failures;
  }

  private async persistPhotoIntent(adventureId: string, userId: string, draft: PhotoDraft, index: number) {
    const path = `${userId}/${adventureId}/${crypto.randomUUID()}.webp`;
    const intent: TablesInsert<"photos"> = {
      id: draft.id,
      adventure_id: adventureId,
      url: path,
      portada: false,
      descripcion: draft.descripcion,
      orden: TEMPORARY_ORDER_BASE + index,
      width: draft.width,
      height: draft.height,
      bytes: draft.blob!.size,
      mime_type: draft.mimeType,
      upload_status: "pending",
    };
    const inserted = await withTimeout(
      this.client.from("photos").insert(intent),
      DATABASE_TIMEOUT_MS,
      "Supabase tardó demasiado en preparar una fotografía.",
    );
    if (inserted.error) throw new Error(inserted.error.message);

    try {
      const upload = await withTimeout(
        this.client.storage.from(PHOTO_BUCKET).upload(path, draft.blob!, { contentType: draft.mimeType, cacheControl: "31536000", upsert: false }),
        STORAGE_TIMEOUT_MS,
        "La subida de una fotografía superó el tiempo máximo.",
      );
      if (upload.error) throw new Error(upload.error.message);
      const ready = await withTimeout(
        this.client.from("photos").update({ upload_status: "ready" }).eq("id", draft.id),
        DATABASE_TIMEOUT_MS,
        "Supabase tardó demasiado en confirmar una fotografía.",
      );
      if (ready.error) throw new Error(ready.error.message);
    } catch (cause) {
      await this.reconcileFailedUpload(draft.id, path);
      throw cause;
    }
  }

  private async reconcileFailedUpload(photoId: string, path: string) {
    if (await this.removePaths([path])) {
      const deletion = await this.client.from("photos").delete().eq("id", photoId);
      if (!deletion.error) return;
    }
    await this.client.from("photos").update({ upload_status: "cleanup_required", portada: false }).eq("id", photoId);
  }

  private async removeStoredPhoto(photo: AdventurePhoto) {
    const path = storageObjectPath(photo.storagePath);
    if (path && !(await this.removePaths([path]))) return false;
    const deletion = await withTimeout(
      this.client.from("photos").delete().eq("id", photo.id),
      DATABASE_TIMEOUT_MS,
      "Supabase tardó demasiado en eliminar una fotografía.",
    );
    if (!deletion.error) return true;
    await this.client.from("photos").update({ upload_status: "cleanup_required", portada: false }).eq("id", photo.id);
    return false;
  }

  private async applyPhotoLayout(adventureId: string, requested: PhotoDraft[]) {
    try {
      const current = await this.client.from("photos").select("*").eq("adventure_id", adventureId).eq("upload_status", "ready");
      if (current.error) throw new Error(current.error.message);
      const requestedOrder = new Map(requested.map((photo, index) => [photo.id, index]));
      const rows = (current.data as PhotoRow[]).sort((left, right) =>
        (requestedOrder.get(left.id) ?? Number.MAX_SAFE_INTEGER) - (requestedOrder.get(right.id) ?? Number.MAX_SAFE_INTEGER),
      );
      const requestedCover = requested.find(photo => photo.portada && rows.some(row => row.id === photo.id))?.id;
      const coverId = requestedCover ?? rows[0]?.id;

      for (let index = 0; index < rows.length; index += 1) {
        const shifted = await this.client.from("photos").update({ orden: 1_000 + index, portada: false }).eq("id", rows[index].id);
        if (shifted.error) throw new Error(shifted.error.message);
      }
      for (let index = 0; index < rows.length; index += 1) {
        const normalized = await this.client.from("photos").update({ orden: index + 1, portada: rows[index].id === coverId }).eq("id", rows[index].id);
        if (normalized.error) throw new Error(normalized.error.message);
      }
      return false;
    } catch {
      return true;
    }
  }

  private async resolvePhotoUrls(rows: PhotoRow[]) {
    const resolved = new Map<string, string>();
    const paths = [...new Set(rows.map(row => row.url).filter(path => !/^(https?:\/\/|\/)/.test(path)))];
    for (const row of rows) if (/^(https?:\/\/|\/)/.test(row.url)) resolved.set(row.url, row.url);
    if (paths.length === 0) return resolved;

    try {
      const result = await withTimeout(
        this.client.storage.from(PHOTO_BUCKET).createSignedUrls(paths, SIGNED_URL_TTL),
        SIGNING_TIMEOUT_MS,
        "Supabase tardó demasiado en preparar las fotografías.",
      );
      if (result.error) return resolved;
      result.data.forEach((item, index) => {
        if (item.signedUrl) resolved.set(paths[index], item.signedUrl);
      });
    } catch {
      // A signed URL is presentation data: it must never block or roll back a save.
    }
    return resolved;
  }

  private async loadSavedAdventure(id: string, fallback: Adventure) {
    try {
      return (await this.findById(id)) ?? fallback;
    } catch {
      return fallback;
    }
  }

  private async removePaths(paths: string[]) {
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        const removal = await withTimeout(
          this.client.storage.from(PHOTO_BUCKET).remove(paths),
          STORAGE_TIMEOUT_MS,
          "Supabase Storage tardó demasiado en responder.",
        );
        if (!removal.error) return true;
      } catch {
        // Retry once; a timeout may have happened after Storage accepted the operation.
      }
    }
    return false;
  }

  private async cleanupFailedPhotos() {
    try {
      const staleBefore = new Date(Date.now() - 5 * 60_000).toISOString();
      const [failed, stale] = await Promise.all([
        this.client.from("photos").select("id,url").eq("upload_status", "cleanup_required"),
        this.client.from("photos").select("id,url").eq("upload_status", "pending").lt("created_at", staleBefore),
      ]);
      if (failed.error || stale.error) return;
      const recoverable = new Map([...failed.data, ...stale.data].map(photo => [photo.id, photo]));
      for (const photo of recoverable.values()) {
        const path = storageObjectPath(photo.url);
        if ((!path || await this.removePaths([path]))) await this.client.from("photos").delete().eq("id", photo.id);
      }
    } catch {
      // Best-effort repair. The metadata row remains as an ownership marker until cleanup succeeds.
    }
  }
}

function photoWarning(failures: number) {
  if (failures === 0) return null;
  const count = failures === 1 ? "una fotografía" : `${failures} fotografías`;
  return `La aventura se ha guardado, pero no hemos podido completar ${count}. Tus datos están a salvo; abre Editar para intentarlo de nuevo.`;
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

function mapPhoto(row: PhotoRow, url: string): AdventurePhoto {
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
