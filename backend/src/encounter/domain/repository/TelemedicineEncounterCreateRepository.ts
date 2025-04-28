import { TelemedicineEncounter } from '../entities/TelemedicineEncounter';


export interface TelemedicineEncounterCreateRepository {
  execute(input: TelemedicineEncounter): Promise<string>;
}

export const TelemedicineEncounterCreateRepositorySymbol = Symbol('TelemedicineEncounterCreateRepository');
