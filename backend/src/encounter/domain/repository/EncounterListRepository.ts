import { Encounter } from '../entities/Encounter';

export interface EncounterListRepository {
  execute(): Promise<Encounter[]>;
}

export const EncounterListRepositorySymbol = Symbol('EncounterListRepository');