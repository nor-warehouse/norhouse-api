import { Invoice } from './Invoice';
import { InvoiceNumber } from './InvoiceNumber';

export interface InvoicesRepository {
  findAll(): Promise<Invoice[]>;
  findByNumber(number: InvoiceNumber): Promise<Invoice | undefined>;
  save(invoice: Invoice): Promise<void>;
}
