/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { HelperError } from '../errors/HelperError';
import { TokenValidationError } from '../errors/TokenValidationError';
import { decode } from 'jsonwebtoken';
import { GetDataTokenError } from '../errors/GetDataTokenError';
import { DataToken } from '../../domain/entities/DataToken';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const authorization = request.headers.authorization;
      if (!authorization) throw new TokenValidationError('El encabezado de autorización es requerido.');

      const token = request.headers.authorization.split(' ')[1];
      this.obtenerDataToken(token, request);
      return true;
    } catch (error) {
      throw HelperError.response(error);
    }
  }

  private obtenerDataToken(token: string, request: any) {
    const decoded: any = decode(token);
    if (!decoded) throw new TokenValidationError('Error al verificar el token de autorización.');
    try {
      const split_uid = decoded.user_id.split('_');

      const dataToken = DataToken.create({ documentType: split_uid[0], documentNumber: split_uid[1] });
      request.dataToken = dataToken.toPrimitives();
    } catch (error) {
      throw new GetDataTokenError();
    }
  }
}
