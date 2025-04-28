import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { validate as uuidValidate, version as uuidVersion } from 'uuid';

@Injectable()
export class CustomParseUUIDPipe implements PipeTransform {
  transform(value: any) {
    if (!uuidValidate(value) || uuidVersion(value) !== 4) {
      throw new BadRequestException("El ID proporcionado no tiene el formato correcto. Debe ser un UUID válido de versión 4.");
    }
    return value;
  }
}
