import axios from 'axios';
import { TelemedicineEncounter } from '../../domain/entities/TelemedicineEncounter';
import { TelemedicineEncounterDeleteRepository } from '../../domain/repository/TelemedicineEncounterDeleteRepository'
import { AuthGoogleClient } from '../../../common/infrastructure/google/AuthGoogleClient';
import { ResourceTypeEnum } from '../../../common/infrastructure/google/ResourceType.enum';
import { HelperError } from '../../../common/infrastructure/errors/HelperError';

export class TelemedicineEncounterDeleteRepositoryImp implements TelemedicineEncounterDeleteRepository {
  async execute(idTelemedicineEncounter: string): Promise<void> {
    try {
      const clientGoogle = await AuthGoogleClient.getInstance();
      const url = `${process.env.FHIR_BASE}${process.env.FHIR_PROJECT}/fhir/${ResourceTypeEnum.ENCOUNTER}/${idTelemedicineEncounter}`;
      const patchBody = [
        {
          op: "replace",
          path: "/status",
          value: 'cancelled'
        }
      ];
      await clientGoogle.request({
        url,
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json-patch+json', // Tipo de contenido para operaciones PATCH en FHIR
        },
        data: patchBody
      });
    } catch (error) {
      console.log(error)
      throw await HelperError.response(error);
    }
  }
}
