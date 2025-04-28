import { Encounter } from '../../domain/entities/Encounter';
import { EncounterCreateRepository } from '../../domain/repository/EncounterCreateRepository';
import { AuthGoogleClient } from '../../../common/infrastructure/google/AuthGoogleClient';
import { ResourceTypeEnum } from '../../../common/infrastructure/google/ResourceType.enum';
import { classToPlain } from 'class-transformer';
import { extractValues } from '../../../common/domain/helper/Json'
import { HelperError } from '../../../common/infrastructure/errors/HelperError';

export class EncounterCreateRepositoryImp implements EncounterCreateRepository {
  async execute(input: Encounter): Promise<string> {
    try {
      const clientGoogle = await AuthGoogleClient.getInstance();
      const urlEncounter = `${process.env.FHIR_BASE}${process.env.FHIR_PROJECT}/fhir/${ResourceTypeEnum.ENCOUNTER}`;
  
      const paramsAdd = { resourceType: "Encounter" };
      const plainEncounters = classToPlain(input)
      console.log('Antes:', plainEncounters);
      const inputTransform = extractValues(plainEncounters)
      console.log('Después:', inputTransform);
      const data = {
        ...inputTransform,
        ...paramsAdd
      }

      data.class = data.category;
      data.length.value = data.length.val
      delete data.length.val;
      delete data.category;

      const responseFhir : any = await clientGoogle.request(
        {
          url: urlEncounter,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          data
        }
      );

      const { id } = JSON.parse(await responseFhir.data.text());
      return id

    } catch (error) {
      console.log(error)
      throw await HelperError.response(error);
    }
  }
}
