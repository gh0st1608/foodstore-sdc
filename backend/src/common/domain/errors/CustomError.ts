export class CustomError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
  }
}
