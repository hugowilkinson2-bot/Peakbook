"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { curatedPeakCatalog } from "../data/curated-peak-catalog";
import { SupabasePeakRepository } from "../data/supabase-peak.repository";
import type { PeakProfile } from "../domain/peak";

export function usePeakAlbum() {
  const client = useMemo(() => createClient(), []);
  const [peaks, setPeaks] = useState<PeakProfile[]>(curatedPeakCatalog);
  const [isLoading, setIsLoading] = useState(Boolean(client));

  useEffect(() => {
    if (!client) return;
    let cancelled = false;
    const repository = new SupabasePeakRepository(client);
    void repository.list()
      .then((result) => {
        if (!cancelled && result.length > 0) setPeaks(result);
      })
      .catch(() => {
        if (!cancelled) setPeaks(curatedPeakCatalog);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => { cancelled = true; };
  }, [client]);

  return { peaks, isLoading };
}

