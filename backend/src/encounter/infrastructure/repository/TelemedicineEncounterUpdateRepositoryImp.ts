import { TelemedicineEncounter } from '../../domain/entities/TelemedicineEncounter';
import { AuthGoogleClient } from '../../../common/infrastructure/google/AuthGoogleClient';
import { ResourceTypeEnum } from '../../../common/infrastructure/google/ResourceType.enum';
import { TelemedicineEncounterUpdateRepository } from '../../domain/repository/TelemedicineEncounterUpdateRepository';
import { classToPlain } from 'class-transformer';
import { extractValues } from '../../../common/domain/helper/Json';
import { HttpException } from '@nestjs/common';
import { HttpStatusResponse } from '../../../common/domain/constants/HttpStatusResponse';
import { DomainErrorMessages } from '../../../common/domain/constants/TelemedicineEncounterDomainMessages';
import { HelperError } from '../../../common/infrastructure/errors/HelperError';

export class TelemedicineEncounterUpdateRepositoryImp implements TelemedicineEncounterUpdateRepository {
  async execute(idTelemedicineEncounter: string, input: Partial<TelemedicineEncounter>): Promise<void> {
    try {
      const clientGoogle = await AuthGoogleClient.getInstance();
      const url = `${process.env.FHIR_BASE}${process.env.FHIR_PROJECT}/fhir/${ResourceTypeEnum.ENCOUNTER}`;
      const urlGet = `${process.env.FHIR_BASE}${process.env.FHIR_PROJECT}/fhir/${ResourceTypeEnum.ENCOUNTER}?_id=${idTelemedicineEncounter}`;
      const plainTelemedicineEncounters = classToPlain(input)
      const inputTransform = extractValues(plainTelemedicineEncounters)
      const data = {
        ...inputTransform
      }
      data.class = data.category;
      data.length.value = data.length.val
      delete data.length.val;
      delete data.category;
      console.log('data',data)
      const { basedOn, episodeOfCare, account, statusHistory, participant, diagnosis, reasonCode, ...restData } = data;
      const patchOperations = [];
      // Obtener el recurso actual para verificar si 'telecom' y 'address' existen
      const existingResource : any = await clientGoogle.request({
        url : urlGet,
        method: 'GET',
        headers: {
          'Content-Type': 'application/fhir+json'
        }
      });
      const resultTelemedicineEncounter = JSON.parse(await existingResource.data.text());
      const encounter = resultTelemedicineEncounter.entry[0].resource;

      if (!encounter) {
        throw new Error(DomainErrorMessages.TELEMEDICINE_ENCOUNTER_NOT_FOUND);
      }

      // Inicializar 'telecom' si no existe en el recurso
      if (!encounter.participant) {
        patchOperations.push({
          op: 'replace',
          path: '/participant',
          value: [] // Inicializa como un array vacío
        });
      }

      // Inicializar 'telecom' si no existe en el recurso
      if (!encounter.reasonCode) {
        patchOperations.push({
          op: 'replace',
          path: '/reasonCode',
          value: [] // Inicializa como un array vacío
        });
      }

      // Inicializar 'diagnosis' si no existe en el recurso
      if (!encounter.diagnosis) {
        patchOperations.push({
          op: 'replace',
          path: '/diagnosis',
          value: [] // Inicializa como un array vacío
        });
      }

      if (!encounter.basedOn) {
        patchOperations.push({
          op: 'replace',
          path: '/basedOn',
          value: [] // Inicializa como un array vacío
        });
      }

      if (!encounter.episodeOfCare) {
        patchOperations.push({
          op: 'replace',
          path: '/episodeOfCare',
          value: [] // Inicializa como un array vacío
        });
      }

      if (!encounter.account) {
        patchOperations.push({
          op: 'replace',
          path: '/account',
          value: [] // Inicializa como un array vacío
        });
      }

      if (!encounter.statusHistory) {
        patchOperations.push({
          op: 'replace',
          path: '/statusHistory',
          value: [] // Inicializa como un array vacío
        });
      }

      // Agregar datos a 'address' si hay contenido
      if (Array.isArray(participant) && participant.length > 0) {
        patchOperations.push(
          ...participant.map(part => ({
            op: 'add',
            path: '/participant/-',
            value: part
          }))
        ); 
      } else {
        throw new HttpException('El campo "participant" no es un array válido',HttpStatusResponse.BAD_REQUEST);
      }

      // Agregar datos a 'address' si hay contenido
      if (Array.isArray(reasonCode) && reasonCode.length > 0) {
        patchOperations.push(
          ...reasonCode.map(addr => ({
            op: 'add',
            path: '/reasonCode/-',
            value: addr
          }))
        ); 
      } else {
        throw new HttpException('El campo "reasonCode" no es un array válido',HttpStatusResponse.BAD_REQUEST);
      }

      // Agregar datos a 'telecom' si hay contenido
      if (Array.isArray(diagnosis) && diagnosis.length > 0) {
        patchOperations.push(
          ...diagnosis.map(diag => ({
            op: 'add',
            path: '/diagnosis/-',
            value: diag
          }))
        );
      } else {
        throw new HttpException('El campo "diagnosis" no es un array válido',HttpStatusResponse.BAD_REQUEST);
      }

      // Reemplazar otros campos directamente
      patchOperations.push(
        ...Object.entries(restData).map(([key, value]) => ({
          op: 'replace',
          path: `/${key}`,
          value
        }))
      );

      // Enviar la solicitud PATCH
      await clientGoogle.request({
        url,
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json-patch+json'
        },
        data: patchOperations
      });

    } catch (error) {
      console.log(error)
      throw await HelperError.response(error);
    }
  }
}
