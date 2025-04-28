/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiResponse } from '@nestjs/swagger';
import { ApplicationErrorResponseDto } from '../../application/dto/response/ApplicationErrorResponse.dto';

export function ErrorCustomApiResponseSwagger(target: any, key: string, descriptor: PropertyDescriptor) {
  ApiResponse({
    status: '4XX',
    description: 'No tiene permisos.',
    type: ApplicationErrorResponseDto
  })(target, key, descriptor);

  ApiResponse({
    status: '5XX',
    description: 'Error interno del servidor.',
    type: ApplicationErrorResponseDto
  })(target, key, descriptor);
}
