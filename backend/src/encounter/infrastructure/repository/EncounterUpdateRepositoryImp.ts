import { Encounter } from '../../domain/entities/Encounter';
import { AuthGoogleClient } from '../../../common/infrastructure/google/AuthGoogleClient';
import { ResourceTypeEnum } from '../../../common/infrastructure/google/ResourceType.enum';
import { EncounterUpdateRepository } from '../../domain/repository/EncounterUpdateRepository';
import { classToPlain } from 'class-transformer';
import { extractValues } from '../../../common/domain/helper/Json';
import { HttpException } from '@nestjs/common';
import { HttpStatusResponse } from '../../../common/domain/constants/HttpStatusResponse';
import { DomainErrorMessages } from '../../../common/domain/constants/EncounterDomainMessages';
import { HelperError } from '../../../common/infrastructure/errors/HelperError';

export class EncounterUpdateRepositoryImp implements EncounterUpdateRepository {
  async execute(idEncounter: string, input: Partial<Encounter>): Promise<void> {
    try {
      const clientGoogle = await AuthGoogleClient.getInstance();
      const url = `${process.env.FHIR_BASE}${process.env.FHIR_PROJECT}/fhir/${ResourceTypeEnum.ENCOUNTER}`;
      const urlGet = `${process.env.FHIR_BASE}${process.env.FHIR_PROJECT}/fhir/${ResourceTypeEnum.ENCOUNTER}?_id=${idEncounter}`;
      const plainEncounters = classToPlain(input)
      const inputTransform = extractValues(plainEncounters)
      const data = {
        ...inputTransform
      }
      data.class = data.category;
      data.length.value = data.length.val
      delete data.length.val;
      delete data.category;
      console.log('data',data)
      const { participant, diagnosis, reasonCode, ...restData } = data;
      const patchOperations = [];
      // Obtener el recurso actual para verificar si 'telecom' y 'address' existen
      const existingResource : any = await clientGoogle.request({
        url : urlGet,
        method: 'GET',
        headers: {
          'Content-Type': 'application/fhir+json'
        }
      });
      const resultEncounter = JSON.parse(await existingResource.data.text());
      const encounter = resultEncounter.entry[0].resource;

      if (!encounter) {
        throw new Error(DomainErrorMessages.ENCOUNTER_NOT_FOUND);
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

      // Inicializar 'address' si no existe en el recurso
      if (!encounter.diagnosis) {
        patchOperations.push({
          op: 'replace',
          path: '/address',
          value: [] // Inicializa como un array vacío
        });
      }

      /* if (Array.isArray(type)) {
        // Iterar por cada elemento del array type que viene en el input
        type.forEach((typeItem) => {
          // Verificar que el elemento tenga una estructura válida
          if (typeItem && Array.isArray(typeItem.coding)) {
            const codingItems = typeItem.coding.map(codingItem => ({
              code: codingItem.code,
              display: codingItem.display,
              system: codingItem.system,
            }));
          
            if (codingItems.length > 0) {
              // Construir el objeto que deseas agregar a FHIR
              const addType = {
                coding: codingItems, // Usar todos los objetos del array
              };
          
              // Crear la operación PATCH para agregar el nuevo elemento al array type
              patchOperations.push({
                op: 'add',
                path: '/type/-', // Agregar al final del array type
                value: addType,
              });
            } else {
              throw new Error('El array "coding" no contiene elementos válidos.');
            }
          } else {
            throw new Error('El campo "coding" no es un array válido.');
          }
        });
      } else {
        // Manejar el caso donde type no sea un array
        throw new Error('El campo "type" no es un array');
      } */
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
