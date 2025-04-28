import { TelemedicineEncounter } from '../../domain/entities/TelemedicineEncounter';
import { TelemedicineEncounterCreateRepository } from '../../domain/repository/TelemedicineEncounterCreateRepository';
import { AuthGoogleClient } from '../../../common/infrastructure/google/AuthGoogleClient';
import { ResourceTypeEnum } from '../../../common/infrastructure/google/ResourceType.enum';
import { classToPlain, plainToInstance } from 'class-transformer';
import { extractValues } from '../../../common/domain/helper/Json'
import { HelperError } from '../../../common/infrastructure/errors/HelperError';

export class TelemedicineEncounterCreateRepositoryImp implements TelemedicineEncounterCreateRepository {
  async execute(input: TelemedicineEncounter): Promise<string> {
    try {
      const clientGoogle = await AuthGoogleClient.getInstance();
      const urlTelemedicineEncounter = `${process.env.FHIR_BASE}${process.env.FHIR_PROJECT}/fhir/${ResourceTypeEnum.ENCOUNTER}`;
      const paramsAdd = { resourceType: ResourceTypeEnum.ENCOUNTER };
      const inputTransform = extractValues(input)
      const data = {
        ...inputTransform,
        ...paramsAdd
      }

      data.class = data.category;
      data.length.value = data.length.val
      delete data.length.val;
      delete data.category;
      delete data.priority;
      const responseFhir: any = await clientGoogle.request(
        {
          url: urlTelemedicineEncounter,
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
