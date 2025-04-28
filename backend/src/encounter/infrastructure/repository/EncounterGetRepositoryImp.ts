import { Encounter } from '../../domain/entities/Encounter';
import { EncounterGetRepository } from '../../domain/repository/EncounterGetRepository';
import { AuthGoogleClient } from '../../../common/infrastructure/google/AuthGoogleClient';
import { ResourceTypeEnum } from '../../../common/infrastructure/google/ResourceType.enum';
import { DomainErrorMessages } from '../../../common/domain/constants/EncounterDomainMessages';
import { HelperError } from '../../../common/infrastructure/errors/HelperError';

export class EncounterGetRepositoryImp implements EncounterGetRepository {
  async execute(idEncounter: string): Promise<Encounter> {
    try {
      const clientGoogle = await AuthGoogleClient.getInstance();
      const url = `${process.env.FHIR_BASE}${process.env.FHIR_PROJECT}/fhir/${ResourceTypeEnum.ENCOUNTER}?_id=${idEncounter}`;
      const responseFhir: any = await clientGoogle.request({ url, method: 'GET' });
      // Parsear la respuesta correctamente
      const resultEncounter = JSON.parse(await responseFhir.data.text());

      // Verificar si total es igual a 0
      if (resultEncounter.total === 0) {
        throw new Error(DomainErrorMessages.ENCOUNTER_NOT_FOUND);
      }

      // Extraer la organización del resultado
      const encounter = resultEncounter.entry[0]?.resource;

      return encounter;
    } catch (error) {
      console.log(error)
      throw await HelperError.response(error);
    }
  }
}
