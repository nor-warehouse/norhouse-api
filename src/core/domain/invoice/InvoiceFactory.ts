import { Invoice } from './Invoice';
import { InvoiceDate } from './InvoiceDate';
import { InvoiceNumber } from './InvoiceNumber';
import { InvoiceType } from './InvoiceType';

export class InvoiceFactory {
  create(raw: { date: Date; number: string; type: InvoiceType }): Invoice {
    return Invoice.create({
      date: InvoiceDate.create({ value: raw.date }),
      number: InvoiceNumber.create({ value: raw.number }),
      type: raw.type,
    });
  }
}
