import { TelemedicineEncounter } from '../entities/TelemedicineEncounter';

export interface TelemedicineEncounterGetRepository {
  execute(idTelemedicineEncounter : string): Promise<TelemedicineEncounter>;
}

export const TelemedicineEncounterGetRepositorySymbol = Symbol('TelemedicineEncounterGetRepository');