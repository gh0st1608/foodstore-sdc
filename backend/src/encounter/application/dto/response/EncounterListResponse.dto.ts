export class EncounterDto {
  type: string;
  use: string;
  country: string;
  postalCode: string;
  text: string;
  line: string;
}

export class EncounterResponseDto {
  status: number;
  message: string;
  payload: EncounterDto[];
}