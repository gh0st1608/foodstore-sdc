export interface TelemedicineEncounterDeleteRepository {
  execute(id: string): Promise<void>;
}

export const TelemedicineEncounterDeleteRepositorySymbol = Symbol('TelemedicineEncounterDeleteRepository');
