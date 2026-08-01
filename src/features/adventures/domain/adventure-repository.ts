import type { Adventure, AdventureMutation } from "./adventure";

export interface AdventureRepository {
  list(): Promise<Adventure[]>;
  findById(id: string): Promise<Adventure | null>;
  create(mutation: AdventureMutation): Promise<Adventure>;
  update(id: string, mutation: AdventureMutation): Promise<Adventure>;
  delete(id: string): Promise<void>;
}
