import type { createClient } from "@/lib/supabase/client";
import type { Adventure, AdventureInput, AdventureUpdate } from "../domain/adventure";
import type { AdventureRepository } from "../domain/adventure-repository";
import { toAdventure, toAdventureInsert, toAdventureUpdate } from "./adventure.mapper";

export class SupabaseAdventureRepository implements AdventureRepository {
  constructor(private readonly client: NonNullable<ReturnType<typeof createClient>>) {}

  async list(): Promise<Adventure[]> {
    const { data, error } = await this.client.from("adventures").select("*").order("fecha", { ascending: false });
    if (error) throw new Error(error.message);
    return data.map(toAdventure);
  }

  async findById(id: string): Promise<Adventure | null> {
    const { data, error } = await this.client.from("adventures").select("*").eq("id", id).maybeSingle();
    if (error) throw new Error(error.message);
    return data ? toAdventure(data) : null;
  }

  async create(input: AdventureInput): Promise<Adventure> {
    const { data, error } = await this.client.from("adventures").insert([toAdventureInsert(input)]).select("*").single();
    if (error) throw new Error(error.message);
    return toAdventure(data);
  }

  async update(id: string, input: AdventureUpdate): Promise<Adventure> {
    const { data, error } = await this.client.from("adventures").update(toAdventureUpdate(input)).eq("id", id).select("*").single();
    if (error) throw new Error(error.message);
    return toAdventure(data);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.client.from("adventures").delete().eq("id", id);
    if (error) throw new Error(error.message);
  }
}
