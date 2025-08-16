// src/infrastructure/filters/lambda-error.filter.ts

import { HelperError } from './helper-error';

export class LambdaErrorFilter {
  static catch(exception: any) {
    const errorData = HelperError.format(exception);
    HelperError.log(exception); // opcional, ya imprime bonito en consola
    return {
      Error: errorData,
      Data: null,
    };
  }
}
