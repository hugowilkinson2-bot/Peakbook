"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { PeakReference } from "../domain/adventure";
import { SupabasePeakSearchRepository } from "../data/supabase-peak-search.repository";

export function usePeakSearch(query: string, enabled = true) {
  const [peaks, setPeaks] = useState<PeakReference[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const repository = useMemo(() => {
    const client = createClient();
    return client ? new SupabasePeakSearchRepository(client) : null;
  }, []);

  useEffect(() => {
    if (!repository || !enabled) return;
    let cancelled = false;
    const timeout = window.setTimeout(() => {
      setIsLoading(true);
      setError(null);
      void repository.search(query.trim())
        .then(result => { if (!cancelled) setPeaks(result); })
        .catch(cause => { if (!cancelled) setError(cause instanceof Error ? cause.message : "No se pudieron buscar cimas."); })
        .finally(() => { if (!cancelled) setIsLoading(false); });
    }, query.trim() ? 180 : 0);
    return () => { cancelled = true; window.clearTimeout(timeout); };
  }, [enabled, query, repository]);

  return { peaks, isLoading, error };
}
