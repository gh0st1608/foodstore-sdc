import { HttpStatusResponse } from '../../domain/constants/HttpStatusResponse';
import { CustomError } from '../../domain/errors/CustomError';
import { ServerErrorMessages } from './ServerErrorMessages';

export class TokenValidationError extends CustomError {
  constructor(mensaje?: string) {
    super(HttpStatusResponse.UNAUTHORIZED, mensaje ?? ServerErrorMessages.TOKEN_VALIDATION);
  }
}
