import { HttpStatusResponse } from '../constants/HttpStatusResponse';
import { DomainErrorMessages } from '../constants/DomainErrorMessages';
import { CustomError } from './CustomError';

export class InternalServerError extends CustomError {
  constructor(message: DomainErrorMessages) {
    super(HttpStatusResponse.INTERNAL_SERVER_ERROR, message);
  }
}
