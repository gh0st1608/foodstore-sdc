import { Encounter, Period, CodingBase, Meta, Type, Length, Identifier, Category, Priority, Participant, Diagnosis, ReasonCode } from './Encounter';
import { Primitives } from '../../../common/domain/helper/Primitives';
import { EncounterUse } from '../properties/EncounterUse';
import { EncounterCodeType } from '../properties/EncounterCodeType';
import { EncounterSystem } from '../properties/EncounterSystem';
import { EncounterDisplay } from '../properties/EncounterDisplay';
import { EncounterText } from '../properties/EncounterText';
import { EncounterAccount } from '../properties/EncounterAccount';
import { EncounterEpisodeOfCare } from '../properties/EncounterEpisodeOfCare';
import { EncounterBasedOn } from '../properties/EncounterBasedOn';

export class CodingServiceType extends CodingBase {
  private constructor(
    readonly code: EncounterCodeType,
    system: EncounterSystem,
    display: EncounterDisplay
  ) {
    super(system, display);
  }

  // Método create para CodingClass
  public static create(data: { code: string; system: string; display: string }) {
    return new CodingServiceType(
      new EncounterCodeType(data.code),
      new EncounterSystem(data.system),
      new EncounterDisplay(data.display)
    );
  }
}

export class ServiceType {
  private constructor(
    readonly coding: CodingServiceType[],
    readonly text: EncounterText
  ) { }

  public static create(data: Primitives<ServiceType>) {
    const codingTransformed = data.coding.map(codingData =>
      CodingServiceType.create(codingData)
    );

    return new ServiceType(
      codingTransformed,
      new EncounterText(data.text)
    );
  }

}

export class StatusHistory {
  private constructor(
    readonly status: EncounterUse,
    readonly period: Period,
  ) { }

  public static create(data: Primitives<StatusHistory>) {
    return new StatusHistory(
      new EncounterUse(data.status),
      Period.create(data.period)
    )
  }
}

export class TelemedicineEncounter extends Encounter {
  private constructor(
    readonly statusHistory: StatusHistory[],
    readonly serviceType: ServiceType,
    readonly account: { reference: EncounterAccount }[],
    readonly episodeOfCare: { reference: EncounterEpisodeOfCare }[],
    readonly basedOn: { reference: EncounterBasedOn }[],
    encounter: Encounter
  ) {
    super(
      encounter.status,
      encounter.type,
      encounter.length,
      encounter.subject,
      encounter.serviceProvider,
      encounter.appointment,
      encounter.identifier,
      encounter.category,
      encounter.priority,
      encounter.participant,
      encounter.period,
      encounter.reasonCode,
      encounter.diagnosis,
      encounter.meta
    );
  }

  public static create(data: any): TelemedicineEncounter {
    return new TelemedicineEncounter(
      data.statusHistory.map(StatusHistory.create),
      ServiceType.create(data.serviceType),
      data.account, //
      data.episodeOfCare,
      data.basedOn,
      Encounter.create(data.encounter)
    );
  }

  public static update(data: any): TelemedicineEncounter {
    return new TelemedicineEncounter(
      (data.statusHistory ?? []).map(StatusHistory.create),
      ServiceType.create(data.serviceType ?? {}),
      data.account,
      data.episodeOfCare,
      data.basedOn,
      Encounter.create(data.encounter)
    );
  }
}


