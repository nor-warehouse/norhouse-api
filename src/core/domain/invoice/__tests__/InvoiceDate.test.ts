import * as InvoiceErrors from '../errors/InvoiceErrors';
import { InvoiceDate } from '../InvoiceDate';

test('Given invalid date, when InvoiceDate is created, then should throw InvalidDateError', () => {
  try {
    const invoiceDate = InvoiceDate.create({ value: ('' as unknown) as Date });
    expect(invoiceDate).toBeUndefined();
  } catch (error) {
    expect(error).toEqual(InvoiceErrors.InvalidDateError);
  }
});

test('Given valid date, when InvoiceDate is created, then should create an InvoiceDate', () => {
  const date = new Date();
  const invoiceDate = InvoiceDate.create({ value: date });
  expect(invoiceDate).toBeInstanceOf(InvoiceDate);
  expect(invoiceDate.value).toBeInstanceOf(Date);
  expect(invoiceDate.value).toEqual(date);
});
