import { Primitives } from '../../../common/domain/helper/Primitives';
/* import { EncounterTypeText } from '../properties/EncounterTypeText';
import { EncounterTypeCoding } from '../properties/EncounterTypeCoding';
import { EncounterUse } from '../properties/EncounterUse'; */
import { EncounterText } from '../properties/EncounterText';
import { EncounterValue } from '../properties/EncounterValue';
import { EncounterSystem } from '../properties/EncounterSystem';
import { EncounterCodeIdentifier } from '../properties/EncounterCodeIdentifier';
import { EncounterCodeType } from '../properties/EncounterCodeType';
import { EncounterDisplay } from '../properties/EncounterDisplay';
import { EncounterAssigner } from '../properties/EncounterAssigner';
import { EncounterSubject } from '../properties/EncounterSubject';
import { EncounterAppointment } from '../properties/EncounterAppointment';
import { EncounterIndividual } from '../properties/EncounterIndividual';
import { EncounterStart } from '../properties/EncounterStart';
import { EncounterEnd } from '../properties/EncounterEnd';
import { EncounterRank } from '../properties/EnocunterRank';
import { EncounterCondition } from '../properties/EncounterCondition';
import { EncounterServiceProvider } from '../properties/EncounterServiceProvider';
import { EncounterUnit } from '../properties/EncounterUnit';
import { EncounterLength } from '../properties/EncounterLength';
import { EncounterVersion } from '../properties/EncounterVersion';
import { classToPlain, instanceToPlain } from 'class-transformer';


// Clase base para Coding
export class CodingBase {
  constructor(
    readonly system: EncounterSystem,
    readonly display: EncounterDisplay
  ) { }

  // Método create para CodingBase (lo heredarán las clases derivadas)
  public static createBase(data: { system: string; display: string }) {
    return new CodingBase(
      new EncounterSystem(data.system),
      new EncounterDisplay(data.display)
    );
  }
}

// Clase CodingClass que extiende de CodingBase
export class CodingClass extends CodingBase {
  constructor(
    readonly code: EncounterCodeType,
    system: EncounterSystem,
    display: EncounterDisplay
  ) {
    super(system, display); // Llamada al constructor de CodingBase
  }

  // Método create para CodingClass
  public static create(data: { code: string; system: string; display: string }) {
    return new CodingClass(
      new EncounterCodeType(data.code),
      new EncounterSystem(data.system),
      new EncounterDisplay(data.display)
    );
  }
}

// Clase CodingClass que extiende de CodingBase
export class CodingPriority extends CodingBase {
  constructor(
    readonly code: EncounterCodeType,
    system: EncounterSystem,
    display: EncounterDisplay
  ) {
    super(system, display); // Llamada al constructor de CodingBase
  }

  // Método create para CodingPriority
  public static create(data: { code: string; system: string; display: string }) {
    return new CodingPriority(
      new EncounterCodeIdentifier(data.code),
      new EncounterSystem(data.system),
      new EncounterDisplay(data.display)
    );
  }
}

export class CodingParticipant extends CodingBase {
  constructor(
    readonly code: EncounterCodeType,
    system: EncounterSystem,
    display: EncounterDisplay
  ) {
    super(system, display); // Llamada al constructor de CodingBase
  }

  // Método create para CodingParticipant
  public static create(data: { code: string; system: string; display: string }) {
    return new CodingParticipant(
      new EncounterCodeType(data.code),
      new EncounterSystem(data.system),
      new EncounterDisplay(data.display)
    );
  }
}

export class CodingReasonCode extends CodingBase {
  constructor(
    readonly code: EncounterCodeType,
    system: EncounterSystem,
    display: EncounterDisplay
  ) {
    super(system, display); // Llamada al constructor de CodingBase
  }

  // Método create para CodingReasonCode
  public static create(data: { code: string; system: string; display: string }) {
    return new CodingReasonCode(
      new EncounterCodeType(data.code),
      new EncounterSystem(data.system),
      new EncounterDisplay(data.display)
    );
  }
}

export class CodingDiagnosis extends CodingBase {
  constructor(
    readonly code: EncounterCodeType,
    system: EncounterSystem,
    display: EncounterDisplay
  ) {
    super(system, display); // Llamada al constructor de CodingBase
  }

  // Método create para codingDiagnosis
  public static create(data: { code: string; system: string; display: string }) {
    return new CodingDiagnosis(
      new EncounterCodeType(data.code),
      new EncounterSystem(data.system),
      new EncounterDisplay(data.display)
    );
  }
}

export class Identifier {
  constructor(
    readonly assigner: { reference: EncounterAssigner },
    readonly value: EncounterValue,
    readonly system: EncounterSystem
  ) { }

  // Método create para Identifier
  public static create(data: Primitives<Identifier>) {
    return new Identifier(
      { reference: new EncounterAssigner(data.assigner.reference) },
      new EncounterValue(data.value),
      new EncounterSystem(data.system)
    );
  }
}

export class Category extends CodingClass {
  constructor(
    code: EncounterCodeType,
    system: EncounterSystem,
    display: EncounterDisplay
  ) {
    super(system, display, code); // Llamada al constructor de CodingBase
  }

  // Método create para CodingType
  public static create(data: Primitives<Category>) {
    return new CodingClass(
      new EncounterCodeType(data.code),
      new EncounterSystem(data.system),
      new EncounterDisplay(data.display)
    );
  }
}

export class Priority {
  constructor(
    readonly coding: CodingPriority[]
  ) { }

  public static create(data: Primitives<Priority>) {
    const codingTransformed = data.coding.map(codingData =>
      CodingPriority.create(codingData)
    );

    return new Priority(
      codingTransformed
    );
  }

}

export class Participant {
  constructor(
    readonly individual: { reference: EncounterIndividual },
    readonly type: { coding: CodingParticipant[] }[] // El tipo especifica un arreglo con objetos que contienen 'coding'
  ) { }

  // Método create
  public static create(data: Primitives<Participant>) {
    // Convierte cada objeto de 'type' en su estructura esperada
    const typeTransformed = data.type.map(typeItem => ({
      coding: typeItem.coding.map(codingData =>
        CodingParticipant.create(codingData) // Usa el método 'create' de 'CodingParticipant'
      )
    }));

    return new Participant(
      { reference: new EncounterIndividual(data.individual.reference) }, // Crea 'EncounterIndividual' desde 'data.individual'
      typeTransformed // Pasa la estructura transformada de 'type'
    );
  }
}

export class Period {
  constructor(
    readonly start: EncounterStart,
    readonly end: EncounterEnd
  ) { }

  // Método create
  public static create(data: Primitives<Period>) {
    return new Period(
      new EncounterStart(data.start),
      new EncounterStart(data.end)
    )
  }
}

export class ReasonCode {
  constructor(
    readonly text: EncounterText,
    readonly coding: CodingReasonCode[]
  ) { }

  // Método create

  public static create(data: Primitives<ReasonCode>) {
    const codingTransformed = data.coding.map(codingData =>
      CodingReasonCode.create(codingData)
    );

    return new ReasonCode(
      new EncounterText(data.text),
      codingTransformed
    );
  }
}

export class Diagnosis {
  constructor(
    readonly condition: { reference: EncounterCondition },
    readonly rank: EncounterRank,
    readonly use: { coding: CodingDiagnosis[] }
  ) { }

  // Método create
  public static create(data: Primitives<Diagnosis>) {
    const useTransformed = {
      coding: data.use.coding.map(codingData =>
        CodingDiagnosis.create(codingData) // Usa el método 'create' de CodingDiagnosis
      )
    };

    return new Diagnosis(
      { reference: new EncounterCondition(data.condition.reference) },
      new EncounterRank(data.rank),
      useTransformed
    ); // Pasa el objeto completo al constructor
  }
}

export class Length {
  private constructor(
    readonly val: EncounterLength,
    readonly unit: EncounterUnit,
    readonly system: EncounterSystem,
    readonly code : EncounterCodeType
  ) { }

  // Método create
  public static create(data: Primitives<Length>) {
    return new Length(
      new EncounterLength(data.val),
      new EncounterUnit(data.unit),
      new EncounterSystem(data.system),
      new EncounterCodeType(data.code),
    ); // Pasa el objeto completo al constructor
  }
}

export class CodingType extends CodingBase{
  constructor(
    readonly code: EncounterCodeType,
    system: EncounterSystem,
    display: EncounterDisplay
  ) {
    super(system, display); // Llamada al constructor de CodingBase
  }

  public static create(data: { code: string; system: string; display: string }) {
    return new CodingType(
      new EncounterCodeType(data.code),
      new EncounterSystem(data.system),
      new EncounterDisplay(data.display)
    );
  }
}

export class Type {
  constructor(
    readonly coding: CodingType[], // Garantizamos que esto es un array
    readonly text: string
  ) {}

  // Método create
  public static create(data: Primitives<Type>) {
    const typeCodingTransformed = data.coding.map((codingData) =>
      CodingType.create(codingData) // Usa el método 'create' de CodingType
    );

    return new Type(
      typeCodingTransformed, // Aseguramos que "coding" sea un array
      data.text // Transformación de "text"
    );
  }
}

export class Tag {
  private constructor(
    readonly code: string, // Keep it typed as `OrganizationCodeType`
    readonly system: string, // Keep it typed as `OrganizationSystem`
    readonly version: string // Keep it typed as `OrganizationValue`
  ) {}

  // Método create para Tag
  public static create(data: { code: string; system: string; version: string }): Tag {
    return new Tag(
      data.code, // Wrap string in `OrganizationCodeType`
      data.system, // Wrap string in `OrganizationSystem`
      data.version // Wrap string in `OrganizationValue`
    );
  }
}

export class Meta {
  private constructor(
    readonly profile: string[],
    readonly tag: Tag[]
  ) {}

  public static create(data: { profile: string[]; tag: { code: string; system: string; version: string }[] }): Meta {
    return new Meta(
      data.profile, // This is directly a string array
      data.tag.map(tag =>
        Tag.create({
          code: tag.code, // Pass `tag.code` as a string
          system: tag.system, // Pass `tag.system` as a string
          version: tag.version // Pass `tag.value` as a string
        })
      )
    );
  }
}

export class Encounter {
  public constructor(
    readonly status: string,
    readonly type: Type[],
    readonly length: Length,
    readonly subject: { reference: EncounterSubject },
    readonly serviceProvider: { reference: EncounterServiceProvider },
    readonly appointment: { reference: EncounterAppointment }[],
    readonly identifier: Identifier[],
    readonly category: Category,
    readonly priority: Priority,
    readonly participant: Participant[], // Corrección de nombre: "participant" en lugar de "particpant"
    readonly period: Period,
    readonly reasonCode: ReasonCode[],
    readonly diagnosis: Diagnosis[],
    readonly meta: Meta
  ) { }

  // Método create para Encounter
  public static create(data: Primitives<Encounter>) {
    const identifiers = data.identifier.map((identifier: { use: string; value: string; system: string; assigner: { reference: string }; type: { coding: any[] } }) => {
      return {
        ...Identifier.create({
          value: identifier.value,
          system: identifier.system,
          assigner: { reference: identifier.assigner.reference }
        })
      };
    });

    const appointmentsTransformed = data.appointment.map(appointmentData => ({
      reference: new EncounterAppointment(appointmentData.reference)
    }));
    

    const participantsTransformed = data.participant.map(participantData =>
      Participant.create(participantData)
    );

    const reasonCodesTransformed = data.reasonCode.map(reasonCodeData =>
      ReasonCode.create(reasonCodeData)
    );

    const diagnosisTransformed = data.diagnosis.map(diagnosisData =>
      Diagnosis.create(diagnosisData)
    );

    const typeTransformed = data.type.map((typeData) =>
      Type.create(typeData) // Correcta inicialización usando el método "create" de Type
    );

    return new Encounter(
      data.status, // Transformación de "status"
      typeTransformed, // Transformación de "type" como un array
      Length.create(data.length), // Transformación de "length"
      { reference: new EncounterAssigner(data.subject.reference) }, // Transformación de "subject"
      { reference: new EncounterAssigner(data.serviceProvider.reference) }, // Transformación de "serviceProvider"
      appointmentsTransformed, // Transformación de "appointment"
      identifiers,
      Category.create(data.category), // Transformación usando el método "create" de Category
      data.priority ? Priority.create(data.priority) : null, // Lista de objetos Priority transformados
      participantsTransformed, // Lista de objetos Participant transformados
      Period.create(data.period), // Transformación usando el método "create" de Period
      reasonCodesTransformed, // Lista de objetos ReasonCode transformados
      diagnosisTransformed, // Transformación usando el método "create" de Diagnosis
      data.meta
    );
    
  }

  public static update(data: Partial<Primitives<Encounter>>) {
    // Transformación de cada propiedad según su tipo
    const identifiers = data.identifier.map((identifier: { use: string; value: string; system: string; assigner: { reference: string }; type: { coding: any[] } }) => {
      return {
        ...Identifier.create({
          value: identifier.value,
          system: identifier.system,
          assigner: { reference: identifier.assigner.reference }
        })
      };
    });

    const appointmentsTransformed = data.appointment.map(appointmentData => ({
      reference: new EncounterAppointment(appointmentData.reference)
    }));
    

    const participantsTransformed = data.participant.map(participantData =>
      Participant.create(participantData)
    );

    const reasonCodesTransformed = data.reasonCode.map(reasonCodeData =>
      ReasonCode.create(reasonCodeData)
    );

    const diagnosisTransformed = data.diagnosis.map(diagnosisData =>
      Diagnosis.create(diagnosisData)
    );

    const typeTransformed = data.type.map((typeData) =>
      Type.create(typeData) // Correcta inicialización usando el método "create" de Type
    );


    return new Encounter(
      data.status, // Transformación de "status"
      typeTransformed, // Transformación de "type"
      Length.create(data.length), // Transformación de "length"
      { reference: new EncounterAssigner(data.subject.reference) }, // Transformación de "subject"
      { reference: new EncounterAssigner(data.serviceProvider.reference) }, // Transformación de "serviceProvider"
      appointmentsTransformed, // Transformación de "appointment"
      identifiers,
      Category.create(data.category), // Transformación usando el método "create" de Category
      Priority.create(data.priority), // Lista de objetos Priority transformados
      participantsTransformed, // Lista de objetos Participant transformados
      Period.create(data.period), // Transformación usando el método "create" de Period
      reasonCodesTransformed, // Lista de objetos ReasonCode transformados
      diagnosisTransformed, // Transformación usando el método "create" de Diagnosis
      data.meta
    );
  }
}


