import { HttpStatusResponse } from '../../domain/constants/HttpStatusResponse';
import { CustomError } from '../../domain/errors/CustomError';
import { ServerErrorMessages } from './ServerErrorMessages';

export class GetDataTokenError extends CustomError {
  constructor() {
    super(HttpStatusResponse.INTERNAL_SERVER_ERROR, ServerErrorMessages.GET_DATA_TOKEN);
  }
}
