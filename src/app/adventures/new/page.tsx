"use client";

import { useRouter } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { ScreenHeader } from "@/components/ui";
import { useAdventures } from "@/features/adventures/application/adventure-provider";
import { AdventureForm } from "@/features/adventures/components/adventure-form";

export default function NewAdventurePage() {
  const router = useRouter();
  const { createAdventure } = useAdventures();
  return <AppShell><ScreenHeader eyebrow="Un nuevo recuerdo" title="Nueva aventura" description="Elige la montaña, guarda lo esencial y deja que PeakBook complete el resto."/>
    <AdventureForm submitLabel="Guardar aventura" onSubmit={async mutation => { const result = await createAdventure(mutation); router.replace(`/adventures/${result.adventure.id}`); }}/>
  </AppShell>;
}
