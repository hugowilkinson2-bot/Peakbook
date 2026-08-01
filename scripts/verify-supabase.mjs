import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!url || !key) {
  throw new Error("Faltan NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY en .env.local.");
}

const supabase = createClient(url, key, {
  auth: { autoRefreshToken: false, detectSessionInUrl: false, persistSession: false },
});

let createdId;

try {
  const { data: authData, error: authError } = await supabase.auth.signInAnonymously();
  if (authError) throw authError;
  if (!authData.user) throw new Error("Supabase Auth no devolvió un usuario anónimo.");

  const marker = new Date().toISOString();
  const input = {
    titulo: `PeakBook v0.8 · ${marker}`,
    fecha: marker.slice(0, 10),
    notas: "Registro temporal de verificación CRUD.",
    distancia: 12.4,
    desnivel_positivo: 980,
    desnivel_negativo: 980,
    tiempo: 14400,
    dificultad: "moderada",
    sensaciones: "Verificación automática",
    meteorologia: { condicion: "despejado" },
  };

  const { data: created, error: createError } = await supabase.from("adventures").insert(input).select("*").single();
  if (createError) throw createError;
  createdId = created.id;

  const { data: listed, error: listError } = await supabase.from("adventures").select("id").eq("id", createdId).single();
  if (listError || listed.id !== createdId) throw listError ?? new Error("La aventura no apareció en el listado.");

  const { data: detail, error: detailError } = await supabase.from("adventures").select("*").eq("id", createdId).single();
  if (detailError || detail.titulo !== input.titulo) throw detailError ?? new Error("El detalle no coincide con la aventura creada.");

  const updatedTitle = `${input.titulo} · editada`;
  const { data: updated, error: updateError } = await supabase.from("adventures").update({ titulo: updatedTitle }).eq("id", createdId).select("*").single();
  if (updateError || updated.titulo !== updatedTitle) throw updateError ?? new Error("La edición no se persistió.");

  const { error: deleteError } = await supabase.from("adventures").delete().eq("id", createdId);
  if (deleteError) throw deleteError;

  const { data: deleted, error: verifyDeleteError } = await supabase.from("adventures").select("id").eq("id", createdId).maybeSingle();
  if (verifyDeleteError || deleted) throw verifyDeleteError ?? new Error("La aventura continuó existiendo después de eliminarla.");
  createdId = undefined;

  console.log("Supabase CRUD verified: create, list, detail, update and delete.");
} finally {
  if (createdId) await supabase.from("adventures").delete().eq("id", createdId);
}
