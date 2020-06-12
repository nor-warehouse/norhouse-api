import * as InvoiceErrors from '../errors/InvoiceErrors';
import { InvoiceNumber } from '../InvoiceNumber';

test('Given invalid number, when InvoiceNumber is created, then should throw InvalidDateError', () => {
  try {
    InvoiceNumber.create({ value: '' });
  } catch (error) {
    expect(error).toEqual(InvoiceErrors.InvalidNumberError);
  }
});

test('Given an empty string, when InvoiceNumber is created, then should throw InvalidNumberError', () => {
  try {
    const invoiceNumber = InvoiceNumber.create({ value: '' });
    expect(invoiceNumber).toBeUndefined();
  } catch (error) {
    expect(error).toEqual(InvoiceErrors.InvalidNumberError);
  }
});

test('Given an string with only spaces, when InvoiceNumber is created, then should throw InvalidNumberError', () => {
  try {
    const invoiceNumber = InvoiceNumber.create({ value: ' ' });
    expect(invoiceNumber).toBeUndefined();
  } catch (error) {
    expect(error).toEqual(InvoiceErrors.InvalidNumberError);
  }
});

test('Given valid number as string, when InvoiceNumber is created, then should create an InvoiceNumber', () => {
  const invoiceNumber = InvoiceNumber.create({ value: '123456' });
  expect(invoiceNumber).toBeInstanceOf(InvoiceNumber);
  expect(typeof invoiceNumber.value === 'string').toBe(true);
  expect(invoiceNumber.value).toEqual('123456');
});

test('Given valid number as number, when InvoiceNumber is created, then should create an InvoiceNumber', () => {
  const invoiceNumber = InvoiceNumber.create({ value: 123456 });
  expect(invoiceNumber).toBeInstanceOf(InvoiceNumber);
  expect(typeof invoiceNumber.value === 'string').toBe(true);
  expect(invoiceNumber.value).toEqual('123456');
});
