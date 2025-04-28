import { PartialType } from "@nestjs/mapped-types";
import { TelemedicineEncounterDto } from "./CreateTelemedicineEncounterRequest.dto";
import { IsOptional, ValidateNested } from "class-validator";
import { Expose, Type } from "class-transformer";


export class PartialTelemedicineEncounterDto extends PartialType(TelemedicineEncounterDto) {}

export class UpdateTelemedicineEncounterDto {
  @ValidateNested()
  @Expose({ name: 'TelemedicineEncounter' })
  @IsOptional() // Cambiar @IsNotEmpty por @IsOptional
  @Type(() => PartialTelemedicineEncounterDto)
  TelemedicineEncounter: PartialTelemedicineEncounterDto;
}
