/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiResponse } from '@nestjs/swagger';

export function SuccessCustomApiResponseSwagger(input: any) {
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    ApiResponse({
      status: 200,
      description: 'Solicitud completada con éxito.',
      type: input
    })(target, key, descriptor);
  };
}
