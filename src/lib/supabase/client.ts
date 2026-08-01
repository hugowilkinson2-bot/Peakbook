import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Session, SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

type PeakBookSupabaseClient = SupabaseClient<Database>;

let browserClient: PeakBookSupabaseClient | null = null;
let sessionPromise: Promise<Session> | null = null;

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) return null;
  if (browserClient) return browserClient;

  browserClient = createSupabaseClient<Database>(url, key, {
    auth: {
      autoRefreshToken: true,
      detectSessionInUrl: false,
      persistSession: true,
    },
  });

  return browserClient;
}

export async function ensureSupabaseSession(client: PeakBookSupabaseClient): Promise<Session> {
  if (!sessionPromise) {
    sessionPromise = openSession(client).catch((cause) => {
      sessionPromise = null;
      throw cause;
    });
  }

  return sessionPromise;
}

async function openSession(client: PeakBookSupabaseClient): Promise<Session> {
  const { data: current, error: sessionError } = await client.auth.getSession();
  if (sessionError) throw new Error(`No se pudo recuperar la sesión de Supabase: ${sessionError.message}`);
  if (current.session) return current.session;

  const { data, error } = await client.auth.signInAnonymously();
  if (error) {
    if (error.message.toLowerCase().includes("anonymous")) {
      throw new Error("Activa Anonymous Sign-Ins en Supabase Auth para guardar aventuras.");
    }
    throw new Error(`No se pudo iniciar la sesión de PeakBook: ${error.message}`);
  }
  if (!data.session) throw new Error("Supabase no devolvió una sesión válida.");

  return data.session;
}
