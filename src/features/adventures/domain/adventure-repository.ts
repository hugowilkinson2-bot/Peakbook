import type { Adventure, AdventureMutation, AdventureSaveResult } from "./adventure";

export interface AdventureRepository {
  list(): Promise<Adventure[]>;
  findById(id: string): Promise<Adventure | null>;
  create(mutation: AdventureMutation): Promise<AdventureSaveResult>;
  update(id: string, mutation: AdventureMutation): Promise<AdventureSaveResult>;
  delete(id: string): Promise<void>;
}
