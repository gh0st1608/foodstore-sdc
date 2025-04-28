export interface EncounterDeleteRepository {
  execute(id: string): Promise<void>;
}

export const EncounterDeleteRepositorySymbol = Symbol('EncounterDeleteRepository');
