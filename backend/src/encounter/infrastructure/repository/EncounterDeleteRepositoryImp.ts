import axios from 'axios';
import { Encounter } from '../../domain/entities/Encounter';
import { EncounterDeleteRepository } from '../../domain/repository/EncounterDeleteRepository'
import { AuthGoogleClient } from '../../../common/infrastructure/google/AuthGoogleClient';
import { ResourceTypeEnum } from '../../../common/infrastructure/google/ResourceType.enum';
import { HelperError } from '../../../common/infrastructure/errors/HelperError';

export class EncounterDeleteRepositoryImp implements EncounterDeleteRepository {
  async execute(idEncounter: string): Promise<void> {
    try {
      const clientGoogle = await AuthGoogleClient.getInstance();
      const url = `${process.env.FHIR_BASE}${process.env.FHIR_PROJECT}/fhir/${ResourceTypeEnum.ENCOUNTER}/${idEncounter}`;
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
