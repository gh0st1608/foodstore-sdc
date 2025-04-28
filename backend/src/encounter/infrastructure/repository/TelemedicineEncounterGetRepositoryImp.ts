import { TelemedicineEncounter } from '../../domain/entities/TelemedicineEncounter';
import { TelemedicineEncounterGetRepository } from '../../domain/repository/TelemedicineEncounterGetRepository';
import { AuthGoogleClient } from '../../../common/infrastructure/google/AuthGoogleClient';
import { ResourceTypeEnum } from '../../../common/infrastructure/google/ResourceType.enum';
import { DomainErrorMessages } from '../../../common/domain/constants/TelemedicineEncounterDomainMessages';
import { HelperError } from '../../../common/infrastructure/errors/HelperError';

export class TelemedicineEncounterGetRepositoryImp implements TelemedicineEncounterGetRepository {
  async execute(idTelemedicineEncounter: string): Promise<TelemedicineEncounter> {
    try {
      const clientGoogle = await AuthGoogleClient.getInstance();
      const url = `${process.env.FHIR_BASE}${process.env.FHIR_PROJECT}/fhir/${ResourceTypeEnum.ENCOUNTER}?_id=${idTelemedicineEncounter}`;
      const responseFhir: any = await clientGoogle.request({ url, method: 'GET' });
      // Parsear la respuesta correctamente
      const resultEncounter = JSON.parse(await responseFhir.data.text());

      if(!resultEncounter){
        throw new Error(DomainErrorMessages.TELEMEDICINE_ENCOUNTER_NOT_FOUND);
      }

      // Verificar si total es igual a 0
      if (resultEncounter.total === 0) {
        throw new Error(DomainErrorMessages.TELEMEDICINE_ENCOUNTER_NOT_FOUND);
      }

      // Extraer la organización del resultado
      const encounter = resultEncounter.entry[0]?.resource;

      return encounter;
    } catch (error) {
      console.error('Error en infraestructura:', error);
      throw await HelperError.response(error);
    }
  }
}
