import { TelemedicineEncounter } from '../entities/TelemedicineEncounter';


export interface TelemedicineEncounterUpdateRepository {
  execute(id: string, input: TelemedicineEncounter): Promise<void>;
}

export const TelemedicineEncounterUpdateRepositorySymbol = Symbol('TelemedicineEncounterUpdateRepository');
