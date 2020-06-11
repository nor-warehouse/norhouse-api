import { Invoice } from '../Invoice';
import { InvoiceDate } from '../InvoiceDate';
import { InvoiceNumber } from '../InvoiceNumber';
import { InvoiceTypes } from '../InvoiceType';

describe('Given valid date, number and type', () => {
  test('when Invoice is created with purchase InvoiceType, then should return a new Invoice', () => {
    const date = new Date();
    const invoice = Invoice.create({
      date: InvoiceDate.create({ value: date }),
      number: InvoiceNumber.create({ value: '1234' }),
      type: 'purchase',
    });
    expect(invoice).toBeInstanceOf(Invoice);
    expect(invoice.invoiceId).toBeDefined();
    expect(invoice.date.value).toEqual(date);
    expect(invoice.number.value).toEqual('1234');
    expect(invoice.type).toEqual(InvoiceTypes.purchase);
  });

  test('when Invoice is created with sale InvoiceType, then should return a new Invoice', () => {
    const date = new Date();
    const invoice = Invoice.create({
      date: InvoiceDate.create({ value: date }),
      number: InvoiceNumber.create({ value: '1234' }),
      type: 'sale',
    });
    expect(invoice).toBeInstanceOf(Invoice);
    expect(invoice.invoiceId).toBeDefined();
    expect(invoice.date.value).toEqual(date);
    expect(invoice.number.value).toEqual('1234');
    expect(invoice.type).toEqual(InvoiceTypes.sale);
  });
});

test('Given invalid date, when Invoice is created, then should throw an error', () => {
  const createInvoice = (): Invoice =>
    Invoice.create({
      date: InvoiceDate.create({ value: ('' as unknown) as Date }),
      number: InvoiceNumber.create({ value: '1234' }),
      type: 'purchase',
    });
  expect(createInvoice).toThrow();
});

test('Given invalid number, when Invoice is created, then should not create the Invoice', () => {
  const createInvoice = (): Invoice =>
    Invoice.create({
      date: InvoiceDate.create({ value: new Date() }),
      number: InvoiceNumber.create({ value: '' }),
      type: 'sale',
    });
  expect(createInvoice).toThrow();
});
