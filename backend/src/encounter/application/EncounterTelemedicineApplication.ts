import { Inject } from '@nestjs/common';
import { SuccessFormatResponse } from '../../common/application/dto/response/SuccessFormatResponse.dto';
import { TelemedicineEncounterCreateRepositorySymbol } from '../domain/repository/TelemedicineEncounterCreateRepository';
import { TelemedicineEncounterDeleteRepositorySymbol } from '../domain/repository/TelemedicineEncounterDeleteRepository';
import { TelemedicineEncounterCreateRepositoryImp } from '../infrastructure/repository/TelemedicineEncounterCreateRepositoryImp';
import { TelemedicineEncounterDeleteRepositoryImp } from '../infrastructure/repository/TelemedicineEncounterDeleteRepositoryImp';
import { TelemedicineEncounterUpdateRepositoryImp } from '../infrastructure/repository/TelemedicineEncounterUpdateRepositoryImp';
import { TelemedicineEncounterGetRepositoryImp } from '../infrastructure/repository/TelemedicineEncounterGetRepositoryImp';
import { TelemedicineEncounterGetRepositorySymbol } from '../domain/repository/TelemedicineEncounterGetRepository';
import { serviceTypeCode, categoryType, participantType, diagnosisType, typeType, lengthCode } from '../domain/constants/EncounterDomainConstants'
import { DomainSuccessMessages } from '../../common/domain/constants/TelemedicineEncounterDomainMessages';
import { TelemedicineEncounterUpdateRepositorySymbol } from '../domain/repository/TelemedicineEncounterUpdateRepository';
import { TelemedicineEncounterResponseDto } from './dto/response/TelemedicineEncounterListResponse.dto';
import { CreateTelemedicineEncounterDto } from './dto/request/CreateTelemedicineEncounterRequest.dto';
import { UpdateTelemedicineEncounterDto } from './dto/request/UpdateTelemedicineEncounterRequest.dto';
import { TelemedicineEncounter } from '../domain/entities/TelemedicineEncounter';
import { HelperError } from '../../common/infrastructure/errors/HelperError';

export class TelemedicineEncounterApplication {
    constructor(
        @Inject(TelemedicineEncounterCreateRepositorySymbol)
        private readonly TelemedicineEncounterCreateRepository: TelemedicineEncounterCreateRepositoryImp,
        @Inject(TelemedicineEncounterDeleteRepositorySymbol)
        private readonly TelemedicineEncounterDeleteRepository: TelemedicineEncounterDeleteRepositoryImp,
        @Inject(TelemedicineEncounterUpdateRepositorySymbol)
        private readonly TelemedicineEncounterUpdateRepository: TelemedicineEncounterUpdateRepositoryImp,
        @Inject(TelemedicineEncounterGetRepositorySymbol)
        private readonly TelemedicineEncounterGetRepository: TelemedicineEncounterGetRepositoryImp,
    ) { }
    
    async create(input: CreateTelemedicineEncounterDto): Promise<TelemedicineEncounterResponseDto> {
        const { meta, serviceType, statusHistory, status, type, length, category, identifier, subject, appointment, serviceProvider, participant, period, reasonCode, diagnosis, account, basedOn, episodeOfCare } = input.TelemedicineEncounter;
        const transformType = [{ text: type.text, coding: type.coding.map(c => ({ code: c.code, display: typeType[c.code].display, system: typeType[c.code].system })) }];
        const transformCategory = { code: category.code, display: categoryType[category.code].display, system: categoryType[category.code].system };
        const transformIdentifier = [{ assigner: { reference: `Organization/${identifier.assigner}` }, system: identifier.system, value: identifier.value }];
        const transformSubject = { reference: `Patient/${subject}` };
        const transformServiceProvider = { reference: `Organization/${serviceProvider}` };
        const transformAppointment = appointment ? [{ reference: `Appointment/${appointment}` }] : [];
        const transformEpisodeOfCare = Array.isArray(episodeOfCare) ? episodeOfCare.map(eoc => ({ reference: `EpisodeOfCare/${eoc}` })) : [];
        const transformBasedOn = Array.isArray(basedOn) ? basedOn.map(b => ({ reference: `ServiceRequest/${b}` })) : [];
        const transformParticipant = participant.map(p => ({ individual: { reference: `PractitionerRole/${p.individual}` }, type: p.type.map(t => ({ coding: t.coding.map(c => ({ system: participantType[c.code].system, code: c.code, display: participantType[c.code].display })) })) }));
        const transformReasonCode = reasonCode.map(r => ({ text: r.text, coding: r.coding.map(c => ({ code: c.code, display: c.display, system: c.system })) }));
        const transformDiagnosis = diagnosis.map(d => ({ condition: { reference: `Condition/${d.condition}` }, rank: d.rank, use: d.use ? { coding: d.use.coding.map(c => ({ code: c.code, display: diagnosisType[c.code].display, system: diagnosisType[c.code].system })) } : null }));
        const transformLength = { val: length.value, unit: lengthCode[length.code]?.unit, system: lengthCode[length.code]?.system, code: length.code };
        const transformServiceType = { text: serviceType.text, coding: serviceType.coding.map(c => { const foundService = serviceTypeCode.find(service => service.code === c.code); return { code: c.code, display: foundService.display, system: foundService.system } }) };
        const transformAccount = Array.isArray(account) ? account.map(eoc => ({ reference: `Account/${eoc}` })) : [];
        try {
            const entity = TelemedicineEncounter.create({
                encounter: {
                    status,
                    type: transformType,
                    length: transformLength,
                    identifier: transformIdentifier,
                    category: transformCategory,
                    subject: transformSubject,
                    serviceProvider: transformServiceProvider,
                    appointment: transformAppointment,
                    participant: transformParticipant,
                    period,
                    reasonCode: transformReasonCode,
                    diagnosis: transformDiagnosis,
                    meta
                },
                statusHistory,
                serviceType: transformServiceType,
                account: transformAccount,
                episodeOfCare: transformEpisodeOfCare,
                basedOn: transformBasedOn
            });
            const createdTelemedicineEncounter = await this.TelemedicineEncounterCreateRepository.execute(entity);
            return SuccessFormatResponse.transform(createdTelemedicineEncounter, DomainSuccessMessages.CREATE_SUCESS);
        } catch (error) {
            throw await HelperError.response(error);
        }
    }


    // Método para actualizar una organización
    async update(idTelemedicineEncounter: string, input: UpdateTelemedicineEncounterDto): Promise<TelemedicineEncounterResponseDto> {
        const { meta, serviceType, statusHistory, status, type, length, category, identifier, subject, appointment, serviceProvider, participant, period, reasonCode, diagnosis, account, basedOn, episodeOfCare } = input.TelemedicineEncounter;

        const transformType = { text: type.text, coding: type.coding.map(c => ({ code: c.code, display: typeType[c.code].display, system: typeType[c.code].system })) };
        const transformCategory = { code: category.code, display: categoryType[category.code].display, system: categoryType[category.code].system };
        const transformIdentifier = [{ assigner: { reference: `Organization/${identifier.assigner}` }, system: identifier.system, value: identifier.value }];
        const transformSubject = { reference: `Patient/${subject}` };
        const transformServiceProvider = { reference: `Organization/${serviceProvider}` };
        const transformAppointment = appointment ? [{ reference: `Appointment/${appointment}` }] : [];
        const transformEpisodeOfCare = Array.isArray(episodeOfCare) ? episodeOfCare.map(eoc => ({ reference: `EpisodeOfCare/${eoc}` })) : [];
        const transformBasedOn = Array.isArray(basedOn) ? basedOn.map(b => ({ reference: `ServiceRequest/${b}` })) : [];
        const transformParticipant = participant.map(p => ({ individual: { reference: `PractitionerRole/${p.individual}` }, type: p.type.map(t => ({ coding: t.coding.map(c => ({ system: participantType[c.code].system, code: c.code, display: participantType[c.code].display })) })) }));
        const transformReasonCode = reasonCode.map(r => ({ text: r.text, coding: r.coding.map(c => ({ code: c.code, display: c.display, system: c.system })) }));
        const transformDiagnosis = diagnosis.map(d => ({ condition: { reference: `Condition/${d.condition}` }, rank: d.rank, use: d.use ? { coding: d.use.coding.map(c => ({ code: c.code, display: diagnosisType[c.code].display, system: diagnosisType[c.code].system })) } : null }));
        const transformLength = { val: length.value, unit: lengthCode[length.code]?.unit, system: lengthCode[length.code]?.system, code: length.code };
        const transformServiceType = { text: serviceType.text, coding: serviceType.coding.map(c => { const foundService = serviceTypeCode.find(service => service.code === c.code); return { code: c.code, display: foundService.display, system: foundService.system } }) };
        const transformAccount = Array.isArray(account) ? account.map(eoc => ({ reference: `Account/${eoc}` })) : [];
        try {
            // Ahora construimos el objeto para la creación del Encounter
            const entity = TelemedicineEncounter.update({
                encounter: {
                    status,
                    type: transformType,
                    length: transformLength,
                    identifier: transformIdentifier,
                    category: transformCategory,
                    subject: transformSubject,
                    serviceProvider: transformServiceProvider,
                    appointment: transformAppointment,
                    participant: transformParticipant,
                    period,
                    reasonCode: transformReasonCode,
                    diagnosis: transformDiagnosis,
                    meta
                },
                statusHistory,
                serviceType: transformServiceType,
                account: transformAccount,
                episodeOfCare: transformEpisodeOfCare,
                basedOn: transformBasedOn
            });
            const updatedTelemedicineEncounter = await this.TelemedicineEncounterUpdateRepository.execute(idTelemedicineEncounter, entity);
            return SuccessFormatResponse.transform(updatedTelemedicineEncounter, DomainSuccessMessages.UPDATE_SUCESS);
        } catch (error) {
            throw error
        }
    }

    // Método para eliminar una organización
    async delete(idTelemedicineEncounter: string): Promise<TelemedicineEncounterResponseDto> {
        try {
            await this.getTelemedicineEncounter(idTelemedicineEncounter);
            await this.TelemedicineEncounterDeleteRepository.execute(idTelemedicineEncounter);

            // Formatear la respuesta exitosa
            return SuccessFormatResponse.transform(idTelemedicineEncounter, DomainSuccessMessages.DELETE_SUCESS);
        } catch (error) {
            throw error
        }
    }

    // Método para obtener una organización por ID
    async getTelemedicineEncounter(idTelemedicineEncounter: string): Promise<TelemedicineEncounterResponseDto> {
        try {
            const response = await this.TelemedicineEncounterGetRepository.execute(idTelemedicineEncounter);
            // Transformar la entidad de Organización a DTO antes de devolver la respuesta
            return SuccessFormatResponse.transform(response, DomainSuccessMessages.GET_SUCESS)
        } catch (error) {
            throw error
        }
    }
}
