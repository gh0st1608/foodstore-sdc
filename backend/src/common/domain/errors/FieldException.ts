export class MissingFieldException extends Error {
  constructor(fieldName: string) {
    super(`Falta el campo : ${fieldName}`);
    this.name = 'MissingFieldException';
  }
}

export class InvalidFieldException extends Error {
  constructor(fieldName: string, message: string) {
    super(`Invalid field: ${fieldName}. ${message}`);
    this.name = 'InvalidFieldException';
  }
}
