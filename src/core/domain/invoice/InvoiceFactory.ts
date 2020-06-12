import { Factory } from '../../../shared/core/Factory';
import { Invoice } from './Invoice';
import { InvoiceDate } from './InvoiceDate';
import { InvoiceNumber } from './InvoiceNumber';
import { InvoiceType } from './InvoiceType';

interface RawInvoice {
  date: Date;
  number: string;
  type: InvoiceType;
}

export class InvoiceFactory implements Factory<Invoice, RawInvoice> {
  create(raw: RawInvoice): Invoice {
    return Invoice.create({
      date: InvoiceDate.create({ value: raw.date }),
      number: InvoiceNumber.create({ value: raw.number }),
      type: raw.type,
    });
  }
}
