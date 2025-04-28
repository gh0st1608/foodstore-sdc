/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseCustom } from './ResponseCustom';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    this.modifyRequest(request);

    return next.handle().pipe(map((output: ResponseCustom) => this.modifyResponse(output, request, response)));
  }

  modifyRequest(request: any) {
    if (request.body?.Data) {
      request.body = request.body.Data; // Reemplaza el body por el contenido de Data
    }
  }


  modifyResponse(output: ResponseCustom, request: any, response: Response) {
    if (request.method === 'GET') {
      return {
        Data: {
          Encounter: output.payload
        }
      };
    }

    if (request.method === 'DELETE' || request.method === 'POST') {
      return {
        Data: {
          id : output.payload,
          statusCode: output.status,
          message: output.message,
          
        }
      };
    }

    // Si no es GET, agregar statusCode y message
    response.status(output.status);
    return {
      Data: {
        statusCode: output.status,
        message: output.message,
        Encounter: output.payload
      }
    };
  }
}