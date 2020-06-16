import { Invoice } from '../Invoice';
import { InvoiceFactory } from '../InvoiceFactory';

test('Given an InvoiceFactory, when create is executed with a RawInvoice, then should return a created Invoice', () => {
  const invoiceFactory = new InvoiceFactory();
  const invoice = invoiceFactory.create({ date: new Date(), number: 123, type: 'sale' });
  expect(invoice).toBeInstanceOf(Invoice);
});
