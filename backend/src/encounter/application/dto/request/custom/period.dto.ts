import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

// Definir una restricción personalizada para validar que start sea menor que end
@ValidatorConstraint({ name: 'isStartBeforeEnd', async: false })
export class IsStartBeforeEndConstraint implements ValidatorConstraintInterface {
  validate(start: Date, args: ValidationArguments) {
    const object = args.object as any;
    if (!object.end) return true; // Si end no está definido, no hay comparación
    return new Date(start) < new Date(object.end);
  }

  defaultMessage() {
    return 'start debe ser menor que end';
  }
}