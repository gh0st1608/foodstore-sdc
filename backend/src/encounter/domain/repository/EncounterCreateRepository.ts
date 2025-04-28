import { Encounter } from '../entities/Encounter';


export interface EncounterCreateRepository {
  execute(input: Encounter): Promise<string>;
}

export const EncounterCreateRepositorySymbol = Symbol('EncounterCreateRepository');
