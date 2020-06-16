export class InvalidDateError extends Error {
  constructor(public message: string = 'Invalid InvoiceDate') {
    super(message);
    this.name = 'InvalidDateError';
    this.stack = new Error().stack;
  }
}

export class InvalidNumberError extends Error {
  constructor(public message: string = 'Invalid InvoiceNumber') {
    super(message);
    this.name = 'InvalidNumberError';
    this.stack = new Error().stack;
  }
}
