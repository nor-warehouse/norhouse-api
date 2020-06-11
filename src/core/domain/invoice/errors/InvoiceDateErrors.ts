export class InvalidDateError extends Error {
  constructor(public message: string = 'Invalid InvoiceDate') {
    super(message);
    this.name = 'InvalidDateError';
    this.stack = new Error().stack;
  }
}
