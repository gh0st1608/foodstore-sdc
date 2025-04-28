export class TelemedicineEncounterDto {
  type: string;
  use: string;
  country: string;
  postalCode: string;
  text: string;
  line: string;
}

export class TelemedicineEncounterResponseDto {
  status: number;
  message: string;
  payload: TelemedicineEncounterDto[];
}