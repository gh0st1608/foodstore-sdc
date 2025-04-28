import { Encounter } from '../entities/Encounter';

export interface EncounterGetRepository {
  execute(idEncounter : string): Promise<Encounter>;
}

export const EncounterGetRepositorySymbol = Symbol('EncounterGetRepository');