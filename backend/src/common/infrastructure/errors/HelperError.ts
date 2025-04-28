import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { MissingFieldException } from '../../domain/errors/FieldException';
import { TokenValidationError } from './TokenValidationError';
import { DomainErrorMessages } from '../../domain/constants/EncounterDomainMessages';
import { GaxiosError } from 'gaxios';
import { OperationOutcome } from 'fhir/r4';

export interface StructureError {
  code: string;
  title: string;
  status: number;
  dateTime: string;
  message: string;
}

export class HelperError {
  public static async response(error: Error): Promise<HttpException> {
    const structureError = await this.get(error);
    return new HttpException(
      structureError, // ✅ Se envía el objeto completo en lugar de formatearlo manualmente
      structureError.status
    );
  }



  public static async get(exception: any): Promise<StructureError> {
    const errorResponse: StructureError = {
      code: 'InternalError',
      title: 'Error',
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      dateTime: new Date().toISOString(),
      message: 'Internal Error'
    };

    if (exception instanceof MissingFieldException) {
      errorResponse.code = 'BadRequest';
      errorResponse.title = 'Missing Field';
      errorResponse.status = HttpStatus.BAD_REQUEST;
      errorResponse.message = exception.message;
      return errorResponse;
    }

    if (exception instanceof TokenValidationError) {
      errorResponse.code = 'NotAuthorizated';
      errorResponse.title = 'Token Error';
      errorResponse.status = HttpStatus.FORBIDDEN;
      errorResponse.message = exception.message;
      return errorResponse;
    }

    if (exception instanceof BadRequestException) {
      console.log('error bad request')
      const exceptionResponse = exception.getResponse() as any;
      errorResponse.code = 'ValidationError';
      errorResponse.title = 'Error de Validación';
      errorResponse.status = HttpStatus.BAD_REQUEST;
      errorResponse.message = `Se encontraron errores en los datos proporcionados: ${exceptionResponse.message?.join('; ') || 'Detalles no disponibles.'}`;
      return errorResponse;
    }
    

    if (exception instanceof HttpException) {
      console.log('error http exception')
      errorResponse.code = 'Http Exception';
      errorResponse.title = 'Error Http Exception';
      errorResponse.status = exception.getStatus();
      errorResponse.message = (exception.getResponse() as any)?.message || exception.message;
      return errorResponse;
    }

    if (exception instanceof GaxiosError) {
      const dataBlob = exception?.response?.data as Blob;
      const outcomes = JSON.parse(await dataBlob.text()) as OperationOutcome;
      const issuesMessage = outcomes.issue?.map((issue, idx) =>
        `${idx + 1}. [${issue.severity.toUpperCase()}] ${issue.details?.text || 'Sin detalles adicionales.'} - ${JSON.stringify(issue.diagnostics)}`
      ).join('; ') || 'No se pudo determinar el motivo del error.';

      errorResponse.code = 'FHIRBadRequest';
      errorResponse.title = 'Healthcare Error';
      errorResponse.status = HttpStatus.BAD_REQUEST;
      errorResponse.message = `Ocurrió un error en el procesamiento del recurso FHIR: ${issuesMessage}`; // ✅ Convertimos objetos en strings

      return errorResponse;
    }



    if (Object.values(DomainErrorMessages).includes(exception.message)) {
      const foundEntry = Object.entries(DomainErrorMessages).find(
        ([key, value]) => value === exception.message
      );

      if (foundEntry) {
        errorResponse.code = 'NotFound';
        errorResponse.title = foundEntry[1]; // El valor del mensaje encontrado
        errorResponse.status = HttpStatus.NOT_FOUND; // Código HTTP 404
        errorResponse.message = exception.message;
        return errorResponse;
      }
    }

    return errorResponse;
  }
}
