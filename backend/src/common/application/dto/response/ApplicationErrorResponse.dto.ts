export class ApplicationErrorResponseDto {
  error: {
    httpStatus: number;
    message: string;
  };
}
