// src/application/exceptions/application.exception.ts

export class ApplicationException extends Error {
  public readonly statusCode: number;
  public readonly title: string;

  constructor(message: string, statusCode = 400, title = 'Error de aplicación') {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.title = title;

    Error.captureStackTrace(this, this.constructor);
  }
}
