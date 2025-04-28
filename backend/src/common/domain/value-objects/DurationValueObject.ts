export abstract class DurationValueObject {
    constructor(
        readonly value: number,
        readonly unit: string,
        readonly system: string,
        readonly code: string
    ) {}
  }
  