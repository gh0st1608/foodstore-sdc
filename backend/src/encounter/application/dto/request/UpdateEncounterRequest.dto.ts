import { PartialType } from "@nestjs/mapped-types";
import { EncounterDto } from "./CreateEncounterRequest.dto";
import { IsOptional, ValidateNested } from "class-validator";
import { Expose, Type } from "class-transformer";


export class PartialEncounterDto extends PartialType(EncounterDto) {}

export class UpdateEncounterDto {
  @ValidateNested()
  @Expose({ name: 'Encounter' })
  @IsOptional() // Cambiar @IsNotEmpty por @IsOptional
  @Type(() => PartialEncounterDto)
  Encounter: PartialEncounterDto;
}
