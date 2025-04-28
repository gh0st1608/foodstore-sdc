import { Inject } from '@nestjs/common';
import { SuccessFormatResponse } from '../../common/application/dto/response/SuccessFormatResponse.dto';
import { EncounterCreateRepositorySymbol } from '../domain/repository/EncounterCreateRepository';
import { EncounterDeleteRepositorySymbol } from '../domain/repository/EncounterDeleteRepository';
import { EncounterCreateRepositoryImp } from '../infrastructure/repository/EncounterCreateRepositoryImp';
import { EncounterDeleteRepositoryImp } from '../infrastructure/repository/EncounterDeleteRepositoryImp';
import { CreateEncounterDto } from './dto/request/CreateEncounterRequest.dto';
import { EncounterResponseDto } from './dto/response/EncounterListResponse.dto';
import { EncounterUpdateRepositoryImp } from '../infrastructure/repository/EncounterUpdateRepositoryImp';
import { EncounterUpdateRepositorySymbol } from '../domain/repository/EncounterUpdateRepository';
import { EncounterGetRepositoryImp } from '../infrastructure/repository/EncounterGetRepositoryImp';
import { EncounterGetRepositorySymbol } from '../domain/repository/EncounterGetRepository';
import { UpdateEncounterDto } from './dto/request/UpdateEncounterRequest.dto';
import { Encounter } from '../domain/entities/Encounter';
import { categoryType, piorityType, participantType, diagnosisType, typeType, lengthCode, PiorityType, ParticipantType } from '../domain/constants/EncounterDomainConstants'
import { DomainSuccessMessages } from '../../common/domain/constants/EncounterDomainMessages';

export class EncounterApplication {
  constructor(
    @Inject(EncounterCreateRepositorySymbol)
    private readonly EncounterCreateRepository: EncounterCreateRepositoryImp,
    @Inject(EncounterDeleteRepositorySymbol)
    private readonly EncounterDeleteRepository: EncounterDeleteRepositoryImp,
    @Inject(EncounterUpdateRepositorySymbol)
    private readonly EncounterUpdateRepository: EncounterUpdateRepositoryImp,
    @Inject(EncounterGetRepositorySymbol)
    private readonly EncounterGetRepository: EncounterGetRepositoryImp,
  ) { }


  // Método para crear una organización
  // En la capa de aplicación:

  async create(input: CreateEncounterDto): Promise<EncounterResponseDto> {
    const { meta, status, type, length, category, identifier, priority, subject, appointment, serviceProvider, participant, period, reasonCode, diagnosis } = input.Encounter;
    try {
      // Transformación de 'type'
      const transformType = [{
        coding: [{
          code: type,
          system: typeType[type].system,
          display: typeType[type].display
        }],
        text: typeType[type].display
      }];

      // Transformación de 'category'
      const transformCategory = {
        code: category.code,
        display: categoryType[category.code].display,
        system: categoryType[category.code].system
      };

      // Transformación de 'identifier'
      const transformIdentifier = [{
        assigner: {
          reference: `Organization/${identifier.assigner}`,
        },
        system: identifier.system,
        value: identifier.value
      }];

      const transformPriority = {
        coding: priority.coding.map(codingItem => ({
          system: piorityType[codingItem.code].system,  // Se usa el valor de system del objeto coding
          code: codingItem.code,      // Se usa el valor de code del objeto coding
          display: piorityType[codingItem.code].display // Se usa el valor de display del objeto coding
        }))
      };

      // Transformación de 'subject'
      const transformSubject = {
        reference: `Patient/${subject}`,
      };

      // Transformación de 'serviceProvider'
      const transformServiceProvider = {
        reference: `Organization/${serviceProvider}`,
      };

      // Transformación de 'appointment' (puede ser opcional)
      const transformAppointment = appointment ? [{
        reference: `Appointment/${appointment}`,
      }] : [];

      // Transformación de 'participant'
      const transformParticipant = participant.map(p => ({
        individual: {
          reference: `PractitionerRole/${p.individual}` // Formato requerido para "individual"
        },
        type: p.type.map(t => ({
          coding: t.coding.map(codingItem => ({
            system: participantType[codingItem.code].system,  // Se usa el valor de system del objeto coding
            code: codingItem.code,      // Se usa el valor de code del objeto coding
            display: participantType[codingItem.code].display // Se usa el valor de display del objeto coding
          }))
        }))
      }));

      // Transformación de 'reasonCode'
      const transformReasonCode = reasonCode.map(r => ({
        text: r.text,
        coding: r.coding.map(c => ({
          code: c.code, // Código de tipo de participación
          display: c.display, // Display del tipo
          system: c.system // Sistema asociado al tipo
        }))
      }));

      // Transformación de 'diagnosis'
      const transformDiagnosis = diagnosis.map(d => ({
        condition: {
          reference: `Condition/${d.condition}` // Formato requerido para "individual"
        },
        rank: d.rank,
        use: d.use ? {
          coding: d.use.coding.map(c => ({
            code: c.code, // Código de tipo de participación
            display: diagnosisType[c.code].display, // Display del tipo
            system: diagnosisType[c.code].system // Sistema asociado al tipo
          }))
        } : null
      }));

      // Transformación de 'length'
      const transformLength = {
        val: length.value, // Número que representa la duración
        unit: lengthCode[length.code]?.unit, // Unidad en formato texto
        system: lengthCode[length.code]?.system, // Sistema de medidas estándar
        code: length.code // Código correspondiente a la unidad
      };

      // Ahora construimos el objeto para la creación del Encounter
      const entity = Encounter.create({
        status,
        type: transformType,
        length: transformLength,
        identifier: transformIdentifier,
        category: transformCategory,
        priority: transformPriority,
        subject: transformSubject,
        serviceProvider: transformServiceProvider,
        appointment: transformAppointment,
        participant: transformParticipant,
        period,
        reasonCode: transformReasonCode,
        diagnosis: transformDiagnosis,
        meta
      });

      // Guarda la entidad utilizando el repositorio correspondiente
      const createdEncounter = await this.EncounterCreateRepository.execute(entity);
      return SuccessFormatResponse.transform(createdEncounter, DomainSuccessMessages.CREATE_SUCESS)
    } catch (error) {
      throw error
    }
  }


  // Método para actualizar una organización
  async update(idEncounter: string, input: UpdateEncounterDto): Promise<EncounterResponseDto> {
    const { meta, status, type, length, category, identifier, priority, subject, appointment, serviceProvider, participant, period, reasonCode, diagnosis } = input.Encounter;
    try {
      // Transformación de 'type'
      const transformType = [{
        coding: [{
          code: type,
          system: typeType[type].system,
          display: typeType[type].display
        }],
        text: typeType[type].display
      }];

      // Transformación de 'category'
      const transformCategory = {
        code: category.code,
        display: categoryType[category.code].display,
        system: categoryType[category.code].system
      };

      // Transformación de 'identifier'
      const transformIdentifier = [{
        assigner: {
          reference: `Organization/${identifier.assigner}`,
        },
        system: identifier.system,
        value: identifier.value
      }];

      const transformPriority = {
        coding: priority.coding.map(codingItem => ({
          system: piorityType[codingItem.code].system,  // Se usa el valor de system del objeto coding
          code: codingItem.code,      // Se usa el valor de code del objeto coding
          display: piorityType[codingItem.code].display // Se usa el valor de display del objeto coding
        }))
      };

      // Transformación de 'subject'
      const transformSubject = {
        reference: `Patient/${subject}`,
      };

      // Transformación de 'serviceProvider'
      const transformServiceProvider = {
        reference: `Organization/${serviceProvider}`,
      };

      // Transformación de 'appointment' (puede ser opcional)
      const transformAppointment = appointment ? [{
        reference: `Appointment/${appointment}`,
      }] : [];

      // Transformación de 'participant'
      const transformParticipant = participant.map(p => ({
        individual: {
          reference: `PractitionerRole/${p.individual}` // Formato requerido para "individual"
        },
        type: p.type.map(t => ({
          coding: t.coding.map(codingItem => ({
            system: participantType[codingItem.code].system,  // Se usa el valor de system del objeto coding
            code: codingItem.code,      // Se usa el valor de code del objeto coding
            display: participantType[codingItem.code].display // Se usa el valor de display del objeto coding
          }))
        }))
      }));

      // Transformación de 'reasonCode'
      const transformReasonCode = reasonCode.map(r => ({
        text: r.text,
        coding: r.coding.map(c => ({
          code: c.code, // Código de tipo de participación
          display: c.display, // Display del tipo
          system: c.system // Sistema asociado al tipo
        }))
      }));

      // Transformación de 'diagnosis'
      const transformDiagnosis = diagnosis.map(d => ({
        condition: {
          reference: `Condition/${d.condition}` // Formato requerido para "individual"
        },
        rank: d.rank,
        use: d.use ? {
          coding: d.use.coding.map(c => ({
            code: c.code, // Código de tipo de participación
            display: diagnosisType[c.code].display, // Display del tipo
            system: diagnosisType[c.code].system // Sistema asociado al tipo
          }))
        } : null
      }));

      // Transformación de 'length'
      const transformLength = {
        val: length.value, // Número que representa la duración
        unit: lengthCode[length.code]?.unit, // Unidad en formato texto
        system: lengthCode[length.code]?.system, // Sistema de medidas estándar
        code: length.code // Código correspondiente a la unidad
      };

      // Ahora construimos el objeto para la creación del Encounter
      const entity = Encounter.update({
        status,
        type: transformType,
        length: transformLength,
        identifier: transformIdentifier,
        category: transformCategory,
        priority: transformPriority,
        subject: transformSubject,
        serviceProvider: transformServiceProvider,
        appointment: transformAppointment,
        participant: transformParticipant,
        period,
        reasonCode: transformReasonCode,
        diagnosis: transformDiagnosis,
        meta
      });

      // Guarda la entidad utilizando el repositorio correspondiente
      const updatedEncounter = await this.EncounterUpdateRepository.execute(idEncounter, entity);
      return SuccessFormatResponse.transform(updatedEncounter, DomainSuccessMessages.UPDATE_SUCESS)
    } catch (error) {
      throw error
    }
  }

  // Método para eliminar una organización
  async delete(idEncounter: string): Promise<EncounterResponseDto> {
    try {
      await this.getEncounter(idEncounter);
      await this.EncounterDeleteRepository.execute(idEncounter);

      // Formatear la respuesta exitosa
      return SuccessFormatResponse.transform(idEncounter, DomainSuccessMessages.DELETE_SUCESS);
    } catch (error) {
      console.error('Error en capa de aplicación:', error);
      throw error
    }
  }

  // Método para obtener una organización por ID
  async getEncounter(idEncounter: string): Promise<EncounterResponseDto> {
    try {
      const response = await this.EncounterGetRepository.execute(idEncounter);
      // Transformar la entidad de Organización a DTO antes de devolver la respuesta
      return SuccessFormatResponse.transform(response, DomainSuccessMessages.GET_SUCESS)
    } catch (error) {
      console.error('Error en capa de aplicación:', error);
      throw error
    }
  }
}
