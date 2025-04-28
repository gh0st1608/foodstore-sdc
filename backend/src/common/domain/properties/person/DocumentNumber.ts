import { MissingFieldException } from '../../errors/FieldException';
import { StringValueObject } from '../../value-objects/StringValueObject';

export class DocumentNumber extends StringValueObject {
  constructor(readonly value: string) {
    super(value);
    this.validate();
  }

  private validate() {
    if (!this.value) {
      throw new MissingFieldException('Numero de Documento');
    }
  }
}
