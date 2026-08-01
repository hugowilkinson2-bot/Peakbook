import type { Adventure, AdventureInput, AdventureUpdate } from "./adventure";

export interface AdventureRepository {
  list(): Promise<Adventure[]>;
  findById(id: string): Promise<Adventure | null>;
  create(input: AdventureInput): Promise<Adventure>;
  update(id: string, input: AdventureUpdate): Promise<Adventure>;
  delete(id: string): Promise<void>;
}
