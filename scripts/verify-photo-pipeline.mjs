import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
if (!url || !key) throw new Error("Falta la configuración pública de Supabase en .env.local.");

const supabase = createClient(url, key, {
  auth: { autoRefreshToken: false, detectSessionInUrl: false, persistSession: false },
});
const bucket = supabase.storage.from("adventure-photos");
const createdAdventureIds = [];
const testFolders = [];
const onePixelPng = Uint8Array.from(Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Wl2nWQAAAAASUVORK5CYII=",
  "base64",
));

const timed = async (label, operation, timeoutMs = 30_000) => {
  let timeoutId;
  const timeout = new Promise((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(`${label}: timeout de ${timeoutMs} ms`)), timeoutMs);
  });
  try { return await Promise.race([operation, timeout]); }
  finally { clearTimeout(timeoutId); }
};

const expect = (condition, message) => {
  if (!condition) throw new Error(message);
};

try {
  const { data: authData, error: authError } = await supabase.auth.signInAnonymously();
  if (authError || !authData.user) throw authError ?? new Error("No se obtuvo usuario anónimo.");
  const userId = authData.user.id;
  const { data: peak, error: peakError } = await supabase.from("peaks").select("id").limit(1).single();
  if (peakError) throw peakError;

  const createAdventure = async label => {
    const marker = crypto.randomUUID().slice(0, 8);
    const { data, error } = await supabase.from("adventures").insert({
      titulo: `[photo-verification] ${label} ${marker}`,
      fecha: new Date().toISOString().slice(0, 10),
      distancia: 1,
      desnivel_positivo: 100,
      desnivel_negativo: 100,
      tiempo: 600,
      dificultad: "facil",
      meteorologia: { condicion: "despejado" },
    }).select("id").single();
    if (error) throw error;
    createdAdventureIds.push(data.id);
    testFolders.push(`${userId}/${data.id}`);
    const relation = await supabase.from("adventure_peaks").insert({ adventure_id: data.id, peak_id: peak.id, orden: 1 });
    if (relation.error) throw relation.error;
    return data.id;
  };

  const addPhoto = async (adventureId, order, cover = false) => {
    const photoId = crypto.randomUUID();
    const path = `${userId}/${adventureId}/${crypto.randomUUID()}.png`;
    const intent = await supabase.from("photos").insert({
      id: photoId,
      adventure_id: adventureId,
      url: path,
      portada: false,
      orden: 20_000 + order,
      width: 1,
      height: 1,
      bytes: onePixelPng.byteLength,
      mime_type: "image/png",
      upload_status: "pending",
    });
    if (intent.error) throw intent.error;
    const upload = await timed("Subida", bucket.upload(path, onePixelPng, { contentType: "image/png", upsert: false }));
    if (upload.error) throw upload.error;
    const ready = await supabase.from("photos").update({ upload_status: "ready", orden: order, portada: cover }).eq("id", photoId);
    if (ready.error) throw ready.error;
    return { id: photoId, path };
  };

  const withoutPhotos = await createAdventure("sin fotos");
  const withoutResult = await supabase.from("photos").select("id", { count: "exact", head: true }).eq("adventure_id", withoutPhotos);
  expect(withoutResult.count === 0, "La aventura sin fotos creó metadatos inesperados.");
  console.log("✓ Crear una aventura sin fotos");

  const withOne = await createAdventure("una foto");
  await addPhoto(withOne, 1, true);
  const oneResult = await supabase.from("photos").select("id,portada,upload_status").eq("adventure_id", withOne);
  expect(oneResult.data?.length === 1 && oneResult.data[0].portada && oneResult.data[0].upload_status === "ready", "La foto única no quedó lista y como portada.");
  console.log("✓ Crear una aventura con una foto");

  const withSeveral = await createAdventure("varias fotos");
  const several = [];
  for (let order = 1; order <= 3; order += 1) several.push(await addPhoto(withSeveral, order, order === 1));
  const severalResult = await supabase.from("photos").select("id").eq("adventure_id", withSeveral).eq("upload_status", "ready");
  expect(severalResult.data?.length === 3, "No se guardaron las tres fotografías.");
  console.log("✓ Crear una aventura con varias fotos");

  const clearCover = await supabase.from("photos").update({ portada: false }).eq("adventure_id", withSeveral);
  if (clearCover.error) throw clearCover.error;
  const newCover = await supabase.from("photos").update({ portada: true }).eq("id", several[2].id);
  if (newCover.error) throw newCover.error;
  const coverResult = await supabase.from("photos").select("id").eq("adventure_id", withSeveral).eq("portada", true);
  expect(coverResult.data?.length === 1 && coverResult.data[0].id === several[2].id, "El cambio de portada no se persistió.");
  console.log("✓ Cambiar la portada");

  const storageDeletion = await bucket.remove([several[1].path]);
  if (storageDeletion.error) throw storageDeletion.error;
  const metadataDeletion = await supabase.from("photos").delete().eq("id", several[1].id);
  if (metadataDeletion.error) throw metadataDeletion.error;
  const deletedPhoto = await supabase.from("photos").select("id").eq("id", several[1].id).maybeSingle();
  const listedAfterDelete = await bucket.list(`${userId}/${withSeveral}`);
  expect(!deletedPhoto.data && !listedAfterDelete.data?.some(item => item.name === several[1].path.split("/").at(-1)), "La fotografía eliminada sigue en base de datos o Storage.");
  console.log("✓ Eliminar fotografías");

  const protectedAdventure = await createAdventure("fallo de subida");
  const failedPhotoId = crypto.randomUUID();
  const failedPath = `${userId}/${protectedAdventure}/${crypto.randomUUID()}.txt`;
  const failedIntent = await supabase.from("photos").insert({ id: failedPhotoId, adventure_id: protectedAdventure, url: failedPath, portada: false, orden: 20_001, upload_status: "pending" });
  if (failedIntent.error) throw failedIntent.error;
  const rejectedUpload = await bucket.upload(failedPath, new TextEncoder().encode("invalid image"), { contentType: "text/plain" });
  expect(Boolean(rejectedUpload.error), "Storage aceptó un formato no permitido.");
  await bucket.remove([failedPath]);
  await supabase.from("photos").delete().eq("id", failedPhotoId);
  const protectedResult = await supabase.from("adventures").select("id").eq("id", protectedAdventure).single();
  expect(protectedResult.data?.id === protectedAdventure, "El fallo de foto eliminó la aventura.");
  console.log("✓ Un fallo de subida no elimina la aventura");

  for (const folder of testFolders) {
    const objects = await bucket.list(folder);
    const adventureId = folder.split("/").at(-1);
    const rows = await supabase.from("photos").select("url").eq("adventure_id", adventureId);
    const referencedNames = new Set((rows.data ?? []).map(row => row.url.split("/").at(-1)));
    expect((objects.data ?? []).every(object => referencedNames.has(object.name)), `Se detectó un objeto huérfano en ${folder}.`);
  }
  console.log("✓ Sin archivos huérfanos en los casos verificados");
} finally {
  for (const adventureId of createdAdventureIds) {
    const { data: photos } = await supabase.from("photos").select("url").eq("adventure_id", adventureId);
    const paths = (photos ?? []).map(photo => photo.url);
    if (paths.length) await bucket.remove(paths);
    await supabase.from("adventures").delete().eq("id", adventureId);
  }
  await supabase.auth.signOut();
}

console.log("Photo pipeline verified and all temporary data removed.");
