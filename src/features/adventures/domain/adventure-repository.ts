import type { AdventureDetail, AdventureSummary } from "./adventure";

export interface AdventureRepository {
  list(): Promise<AdventureSummary[]>;
  findById(id: string): Promise<AdventureDetail | null>;
}
