"use client";

import { useRouter } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { ScreenHeader } from "@/components/ui";
import { useAdventures } from "@/features/adventures/application/adventure-provider";
import { AdventureForm } from "@/features/adventures/components/adventure-form";

export default function NewAdventurePage() {
  const router = useRouter();
  const { createAdventure } = useAdventures();
  return <AppShell><ScreenHeader eyebrow="Un nuevo recuerdo" title="Nueva aventura" description="Registra lo esencial. Podrás volver y editarlo cuando quieras."/>
    <AdventureForm submitLabel="Crear aventura" onSubmit={async input => { const created = await createAdventure(input); router.replace(`/adventures/${created.id}`); }}/>
  </AppShell>;
}
