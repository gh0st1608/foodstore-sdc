import { DomainErrorMessages } from '../constants/DomainErrorMessages';
import { HttpStatusResponse } from '../constants/HttpStatusResponse';
import { CustomError } from './CustomError';

export class EmailError extends CustomError {
  constructor(mensaje?: string) {
    super(HttpStatusResponse.INTERNAL_SERVER_ERROR, mensaje ?? DomainErrorMessages.EMAIL);
  }
}
