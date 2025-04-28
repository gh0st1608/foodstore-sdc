import { HttpStatusResponse } from '../../../common/domain/constants/HttpStatusResponse';
import { CustomError } from '../../../common/domain/errors/CustomError';
import { TemplateServerErrorMessages } from './TemplateServerErrorMessages';

export class TemplateOperationError extends CustomError {
  constructor(message?: string) {
    super(
      HttpStatusResponse.INTERNAL_SERVER_ERROR,
      message ?? TemplateServerErrorMessages.EXAMPLE_ERROR
    );
  }
}
