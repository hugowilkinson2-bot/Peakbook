"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Adventure, AdventureMutation, AdventureSaveResult } from "../domain/adventure";
import { SupabaseAdventureRepository } from "../data/supabase-adventure.repository";

type AdventureContextValue = {
  adventures: Adventure[];
  isLoading: boolean;
  error: string | null;
  notice: string | null;
  reload: () => Promise<void>;
  createAdventure: (mutation: AdventureMutation) => Promise<AdventureSaveResult>;
  updateAdventure: (id: string, mutation: AdventureMutation) => Promise<AdventureSaveResult>;
  deleteAdventure: (id: string) => Promise<void>;
  clearError: () => void;
  clearNotice: () => void;
};

const AdventureContext = createContext<AdventureContextValue | null>(null);
const byNewest = (a: Adventure, b: Adventure) => b.fecha.localeCompare(a.fecha);
const configurationMessage = "Conecta Supabase en .env.local para guardar tus aventuras.";

export function AdventureProvider({ children }: { children: React.ReactNode }) {
  const [adventures, setAdventures] = useState<Adventure[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const repository = useMemo(() => {
    const client = createClient();
    return client ? new SupabaseAdventureRepository(client) : null;
  }, []);

  const reload = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    if (!repository) {
      setError(configurationMessage);
      setIsLoading(false);
      return;
    }
    try {
      setAdventures(await repository.list());
    } catch (cause) {
      setError(readError(cause, "No hemos podido cargar tus aventuras."));
    } finally {
      setIsLoading(false);
    }
  }, [repository]);

  useEffect(() => { void reload(); }, [reload]);

  const createAdventure = useCallback(async (mutation: AdventureMutation) => {
    if (!repository) throw new Error(configurationMessage);
    const temporaryId = `optimistic-${crypto.randomUUID()}`;
    const temporary: Adventure = {
      ...mutation.input,
      id: temporaryId,
      createdAt: new Date().toISOString(),
      peak: mutation.peak,
      photos: mutation.photos.map(photo => ({
        id: photo.id,
        adventureId: temporaryId,
        storagePath: photo.storagePath ?? "",
        url: photo.previewUrl,
        portada: photo.portada,
        descripcion: photo.descripcion,
        orden: photo.orden,
        width: photo.width,
        height: photo.height,
        bytes: photo.bytes,
        mimeType: photo.mimeType,
      })),
    };
    setAdventures(current => [temporary, ...current].sort(byNewest));
    setError(null);
    try {
      const result = await repository.create(mutation);
      setAdventures(current => current.map(item => item.id === temporary.id ? result.adventure : item).sort(byNewest));
      setNotice(result.warning);
      return result;
    } catch (cause) {
      setAdventures(current => current.filter(item => item.id !== temporary.id));
      const message = readError(cause, "No hemos podido guardar la aventura.");
      setError(message);
      throw new Error(message);
    }
  }, [repository]);

  const updateAdventure = useCallback(async (id: string, mutation: AdventureMutation) => {
    if (!repository) throw new Error(configurationMessage);
    const previous = adventures.find(item => item.id === id);
    if (!previous) throw new Error("La aventura ya no está disponible.");
    const optimistic: Adventure = {
      ...previous,
      ...mutation.input,
      peak: mutation.peak,
      photos: mutation.photos.map(photo => ({
        id: photo.id,
        adventureId: id,
        storagePath: photo.storagePath ?? "",
        url: photo.previewUrl,
        portada: photo.portada,
        descripcion: photo.descripcion,
        orden: photo.orden,
        width: photo.width,
        height: photo.height,
        bytes: photo.bytes,
        mimeType: photo.mimeType,
      })),
    };
    setAdventures(current => current.map(item => item.id === id ? optimistic : item).sort(byNewest));
    setError(null);
    try {
      const result = await repository.update(id, mutation);
      setAdventures(current => current.map(item => item.id === id ? result.adventure : item).sort(byNewest));
      setNotice(result.warning);
      return result;
    } catch (cause) {
      setAdventures(current => current.map(item => item.id === id ? previous : item).sort(byNewest));
      const message = readError(cause, "No hemos podido actualizar la aventura.");
      setError(message);
      throw new Error(message);
    }
  }, [adventures, repository]);

  const deleteAdventure = useCallback(async (id: string) => {
    if (!repository) throw new Error(configurationMessage);
    const previous = adventures.find(item => item.id === id);
    setAdventures(current => current.filter(item => item.id !== id));
    setError(null);
    try {
      await repository.delete(id);
    } catch (cause) {
      if (previous) setAdventures(current => [...current, previous].sort(byNewest));
      const message = readError(cause, "No hemos podido eliminar la aventura.");
      setError(message);
      throw new Error(message);
    }
  }, [adventures, repository]);

  const value = useMemo<AdventureContextValue>(() => ({ adventures, isLoading, error, notice, reload, createAdventure, updateAdventure, deleteAdventure, clearError: () => setError(null), clearNotice: () => setNotice(null) }), [adventures, isLoading, error, notice, reload, createAdventure, updateAdventure, deleteAdventure]);
  return <AdventureContext.Provider value={value}>{children}</AdventureContext.Provider>;
}

export function useAdventures() {
  const context = useContext(AdventureContext);
  if (!context) throw new Error("useAdventures debe usarse dentro de AdventureProvider.");
  return context;
}

function readError(cause: unknown, fallback: string) {
  if (!(cause instanceof Error) || !cause.message) return fallback;
  if (cause.message.includes("Failed to fetch")) return "No hay conexión con Supabase. Revisa tu red e inténtalo de nuevo.";
  return cause.message;
}
