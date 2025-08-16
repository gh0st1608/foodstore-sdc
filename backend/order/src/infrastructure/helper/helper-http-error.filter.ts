// src/infrastructure/filters/http-error.filter.ts

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
} from '@nestjs/common';
import { Response } from 'express';
import { HelperError } from '../helper/helper-error';

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const formatted = HelperError.format(exception); // ✅ devuelve un objeto plano

    const { code, ...rest } = formatted;

    response.status(code).json(rest); // ✅ usamos el `code` como status HTTP
  }
}
