"use client";

import { useRouter } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { ScreenHeader } from "@/components/ui";
import { useAdventures } from "../application/adventure-provider";
import { AdventureError, AdventureLoading } from "./adventure-states";
import { AdventureForm } from "./adventure-form";

export function AdventureEditScreen({ id }: { id: string }) {
  const router = useRouter();
  const { adventures, isLoading, error, reload, updateAdventure } = useAdventures();
  const adventure = adventures.find(item => item.id === id);
  if (isLoading) return <AppShell><AdventureLoading cards={1}/></AppShell>;
  if (!adventure) return <AppShell>{error ? <AdventureError message={error} onRetry={()=>void reload()}/> : <AdventureError message="Esta aventura ya no está disponible."/>}</AppShell>;
  return <AppShell><ScreenHeader eyebrow="Actualiza el recuerdo" title="Editar aventura" description="Los cambios se reflejarán al instante en tu archivo."/>
    <AdventureForm initialValue={adventure} submitLabel="Guardar cambios" onSubmit={async mutation => { const updated = await updateAdventure(id, mutation); router.replace(`/adventures/${updated.id}`); }}/>
  </AppShell>;
}
