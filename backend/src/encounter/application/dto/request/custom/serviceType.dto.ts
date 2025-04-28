import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { serviceTypeCode } from '../../../../domain/constants/EncounterDomainConstants'

@ValidatorConstraint({ name: 'CodeServiceType', async: false })
export class CodeServiceType implements ValidatorConstraintInterface {
  validate(value: string): boolean {
    return serviceTypeCode.some(allowed => allowed.code === value);
  }

  defaultMessage(): string {
    return 'El valor proporcionado no coincide con ningún código permitido';
  }
}