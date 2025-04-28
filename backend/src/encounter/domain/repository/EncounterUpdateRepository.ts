import { Encounter } from '../entities/Encounter';


export interface EncounterUpdateRepository {
  execute(id: string, input: Encounter): Promise<void>;
}

export const EncounterUpdateRepositorySymbol = Symbol('EncounterUpdateRepository');
