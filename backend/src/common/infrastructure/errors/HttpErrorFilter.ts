/* eslint-disable no-console */
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { HelperError } from './HelperError';

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  async catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    // Usa HelperError.get() para estructurar el error, pero captura propiedades relevantes
    const errorData = await HelperError.get(exception);

    // Logging de errores no HTTP para propósitos de depuración
    if (!(exception instanceof HttpException)) {
      console.error('Unhandled exception:', exception);
    }

    // Responde con el formato esperado
    response.status(status).json({
      statusCode: errorData.status,
      message: errorData.message,
      title: errorData.title, // Incluye título del error si está definido
      code: errorData.code, // Incluye el código del error
      datetime: errorData.dateTime // Hora exacta del error
    });
  }
}
