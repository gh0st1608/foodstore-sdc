import { Expose, Transform, Type } from 'class-transformer';
import { IsArray, IsBoolean, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, IsUUID, Matches, MaxLength, Validate, ValidateNested } from 'class-validator';
import { CategoryType, DiagnosisTypes, LengthCode, ParticipantType, PiorityType, StatusUse } from '../../../domain/constants/EncounterDomainConstants';
import { IsStartBeforeEndConstraint } from './custom/period.dto';
import { CodeServiceType } from './custom/serviceType.dto';

export class DiagnosisUseCodingDto {
  @IsNotEmpty({ message: 'code es requerido' })
  @IsEnum(DiagnosisTypes, { message: `use debe ser uno de los siguientes valores: ${Object.values(DiagnosisTypes).join(', ')}` })
  code: string;
}

export class DiagnosisUseDto{
  @ValidateNested()
  @IsOptional()
  @IsArray()
  @Type(() => DiagnosisUseCodingDto)
  coding: DiagnosisUseCodingDto[];
}

export class DiagnosisDto {
  @ValidateNested()
  @IsOptional()
  @Type(() => DiagnosisUseDto)
  use: DiagnosisUseDto;

  @IsOptional()
  @IsNumber()
  rank: number;

  @IsNotEmpty({ message: 'condition es requerido' })
  @IsString()
  condition: string;
}

export class ReasonCodeCodingDto {
  @IsNotEmpty({ message: 'code es requerido' })
  @Matches(/^\d{6,10}$/, { message: 'code debe contener solo dígitos y tener entre 6 y 10 caracteres' })
  code: string;

  @IsNotEmpty({ message: 'system es requerido' })
  @IsUrl()
  system: string;

  @IsNotEmpty({ message: 'display es requerido' })
  @MaxLength(500,{ message: 'Campo display no debe exceder los 500 caracteres' })
  @IsString()
  display: string;
}

export class ReasonCodeDto {
  @ValidateNested()
  @IsOptional()
  @IsArray()
  @Type(() => ReasonCodeCodingDto)
  coding: ReasonCodeCodingDto[];

  @IsOptional()
  @IsString()
  text: string;
}

export class ParticipantTypeCodingDto {
  @IsNotEmpty({ message: 'code es requerido' })
  @IsEnum(ParticipantType, { message: `use debe ser uno de los siguientes valores: ${Object.values(ParticipantType).join(', ')}` })
  code: string;
}

export class ParticipantTypeDto {
  @ValidateNested()
  @IsOptional()
  @IsArray({ message: 'coding debe ser un array' })
  @Type(() => ParticipantTypeCodingDto)
  coding: ParticipantTypeCodingDto[];
}

export class ParticipantDto {
  @IsNotEmpty({ message: 'individual es requerido' })
  @IsString()
  individual: string;

  @ValidateNested()
  @IsNotEmpty({ message: 'type es requerido' })
  @IsArray({ message: 'type debe ser un array' })
  @Type(() => ParticipantTypeDto)
  type: ParticipantTypeDto[];
}

// DTO para CodingType
export class PeriodDto {
  @IsNotEmpty({ message: 'start es requerido' })
  @Validate(IsStartBeforeEndConstraint)
  @IsString()
  start: Date;

  @IsOptional()
  @IsString()
  end: Date;
}

// DTO para Identifier
export class IdentifierDto {
  @IsNotEmpty({ message: 'system es requerido' })
  @IsUrl()
  system: string;

  @IsNotEmpty({ message: 'value es requerido' })
  @IsString()
  value: string;

  @IsNotEmpty({ message: 'assigner es requerido' })
  @IsUUID()
  assigner: string;

}

export class ClassDto {
  @IsNotEmpty({ message: 'code es requerido' })
  @IsEnum(CategoryType, { message: `use debe ser uno de los siguientes valores: ${Object.values(CategoryType).join(', ')}` })
  @IsString()
  code: string;
}

export class LengthDto {
  @IsNotEmpty({ message: 'value es requerido' })
  @IsNumber()
  value: number;

  @IsNotEmpty({ message: 'code es requerido' })
  @IsEnum(LengthCode, { message: `use debe ser uno de los siguientes valores: ${Object.values(LengthCode).join(', ')}` })
  @IsString()
  code: string;

}

export class StatusHistoryDto {
  @IsNotEmpty({ message: 'status es requerido' })
  @IsEnum(StatusUse, { message: `use debe ser uno de los siguientes valores: ${Object.values(StatusUse).join(', ')}` })
  @IsString()
  status: string;

  @ValidateNested()
  @IsNotEmpty({ message: 'period es requerido' })
  @Type(() => PeriodDto) // Aquí identificamos que 'identifier' es un arreglo de objetos ClassDto
  period: PeriodDto;
}

export class ServiceTypeCodingDto {
  @IsNotEmpty({ message: 'code es requerido' })
  @Validate(CodeServiceType, { message: 'El campo code serviceType no tiene un valor permitido' })
  @IsString()
  code: string;

}

export class TypeCodingDto {
  @IsNotEmpty({ message: 'code es requerido' })
  @Matches(/^(440655000|410620009|308516007|409001005|281036007|275926002)$/, {
    message: `type debe ser uno de los siguientes valores: 440655000, 410620009, 308516007, 409001005, 281036007, 275926002`,
  })
  @IsString()
  code: string;

}

export class TypeDto {
  @ValidateNested()
  @IsArray()
  @IsOptional()
  @Type(() => TypeCodingDto)
  coding: TypeCodingDto[];

  @IsOptional()
  @IsString()
  text: string;
}

export class ServiceTypeDto {
  @ValidateNested()
  @IsArray()
  @IsOptional()
  @Type(() => ServiceTypeCodingDto)
  coding: ServiceTypeCodingDto[];

  @IsOptional()
  @IsString()
  text: string;
}

class TagItemDto {
  @IsUUID()
  code: string;

  @IsUrl()
  @MaxLength(150,{ message: 'Campo system no debe exceder los 150 caracteres' })
  system: string;

  @IsDateString()
  version: string;
}

export class MetaDto {
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  @Matches(
    /^(https:\/\/fhir\.onehealth\.com\.pe\/StructureDefinition\/TelemedicineEncounterOH(\|\d+\.\d+\.\d+)?)$/,
    { each: true, message: 'Each profile must be a valid URL with an optional version.' }
  )
  profile: string[];

  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => TagItemDto)
  tag: TagItemDto[];

}

// DTO para Encounter
export class TelemedicineEncounterDto {

  @IsNotEmpty({ message: 'status es requerido' })
  @IsEnum(StatusUse, { message: `use debe ser uno de los siguientes valores: ${Object.values(StatusUse).join(', ')}` })
  @IsString()
  status: string;

  @ValidateNested()
  @Expose({ name: 'statusHistory' })
  @IsArray()
  @IsNotEmpty({ message: 'StatusHistory es requerido' })
  @Transform(({ value }) => value ?? [])
  statusHistory: StatusHistoryDto[];

  @ValidateNested()
  @Expose({ name: 'type' })
  @IsOptional()
  @Type(() => TypeDto)
  type: TypeDto;

  @ValidateNested()
  @Expose({ name: 'length' })
  @IsNotEmpty({ message: 'Length es requerido' })
  @Type(() => LengthDto) // Aquí identificamos que 'identifier' es un arreglo de objetos IdentifierDto
  length: LengthDto;

  @ValidateNested()
  @Expose({ name: 'identifier' })
  @IsNotEmpty({ message: 'Identifier es requerido' })
  @Type(() => IdentifierDto) // Aquí identificamos que 'identifier' es un arreglo de objetos IdentifierDto
  identifier: IdentifierDto;

  @ValidateNested()
  @Expose({ name: 'class' })
  @IsNotEmpty({ message: 'class es requerido' })
  @Type(() => ClassDto) // Aquí identificamos que 'identifier' es un arreglo de objetos ClassDto
  category: ClassDto;

  @IsNotEmpty({ message: 'subject es requerido' })
  //@IsEnum(StatusUse, { message: `use debe ser uno de los siguientes valores: ${Object.values(StatusUse).join(', ')}` })
  @IsString()
  subject: string;

  @IsNotEmpty({ message: 'serviceProvider es requerido' })
  //@IsEnum(StatusUse, { message: `use debe ser uno de los siguientes valores: ${Object.values(StatusUse).join(', ')}` })
  @IsString()
  serviceProvider: string;

  @IsOptional()
  //@IsEnum(StatusUse, { message: `use debe ser uno de los siguientes valores: ${Object.values(StatusUse).join(', ')}` })
  @IsString()
  appointment: string;

  @ValidateNested({ each: true }) // Valida cada elemento del array individualmente
  @Expose({ name: 'participant' })
  @IsArray({ message: 'participant debe ser un array' })
  @IsNotEmpty({ message: 'Participant es requerido' })
  @Type(() => ParticipantDto) // Aquí indicamos que los elementos del array son de la clase TypeDto
  @Transform(({ value }) => value ?? [])
  participant: ParticipantDto[];
  
  @ValidateNested()
  @Expose({ name: 'period' })
  @IsNotEmpty({ message: 'period es requerido' })
  @Type(() => PeriodDto) // Aquí identificamos que 'identifier' es un arreglo de objetos ClassDto
  period: PeriodDto;

  @ValidateNested()
  @Expose({ name: 'reasonCode' })
  @IsArray()
  @IsNotEmpty({ message: 'ReasonCode es requerido' })
  @Type(() => ReasonCodeDto)
  @Transform(({ value }) => value ?? [])
  reasonCode: ReasonCodeDto[];

  @ValidateNested()
  @Expose({ name: 'diagnosis' })
  @IsArray()
  @IsOptional()
  @Type(() => DiagnosisDto)
  @Transform(({ value }) => value ?? [])
  diagnosis: DiagnosisDto[];

  @IsNotEmpty({ message: 'account es requerido' })
  @IsUUID('all', { each: true })
  @IsArray()
  /* @Transform(({ value }) => value ?? []) */
  account: string[];

  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true }) // Validar que cada elemento del array sea un UUID
  @Transform(({ value }) => value ?? [])
  episodeOfCare: string[];

  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true }) // Validar que cada elemento del array sea un UUID
  @Transform(({ value }) => value ?? [])
  basedOn: string[];

  @ValidateNested()
  @Expose({ name: 'serviceType' })
  @IsNotEmpty({ message: 'ServiceType es requerido' })
  @Type(() => ServiceTypeDto)
  serviceType: ServiceTypeDto;

  @ValidateNested()
  @Expose({ name: 'meta' })
  @IsNotEmpty({ message: 'Meta es requerido' })
  @Type(() => MetaDto)
  meta: MetaDto;
}

// DTO para crear una nueva organización
export class CreateTelemedicineEncounterDto {
  @ValidateNested({each : true})
  @Expose({ name: 'TelemedicineEncounter' })
  @IsNotEmpty({ message: 'TelemedicineEncounter es requerido' })
  @Type(() => TelemedicineEncounterDto)
  TelemedicineEncounter: TelemedicineEncounterDto;
}
