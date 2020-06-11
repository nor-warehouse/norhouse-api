import * as InvoiceDateErrors from '../errors/InvoiceDateErrors';
import { InvoiceDate } from '../InvoiceDate';

test('Given invalid date, when InvoiceDate is created, then should throw InvalidDateError', () => {
  try {
    InvoiceDate.create({ value: ('' as unknown) as Date });
  } catch (error) {
    expect(error.name).toEqual(InvoiceDateErrors.InvalidDateError.name);
  }
});

test('Given valid date, when InvoiceDate is created, then should create an InvoiceDate', () => {
  const date = new Date();
  const invoice = InvoiceDate.create({ value: date });
  expect(invoice).toBeInstanceOf(InvoiceDate);
  expect(invoice.value).toBeInstanceOf(Date);
  expect(invoice.value).toEqual(date);
});
