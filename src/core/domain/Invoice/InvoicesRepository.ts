import { Invoice } from './Invoice';
import { InvoiceNumber } from './InvoiceNumber';
import { InvoiceId } from './InvoiceId';

export interface InvoicesRepository {
  findById(id: InvoiceId): Promise<Invoice | undefined>;
  findByNumber(number: InvoiceNumber): Promise<Invoice | undefined>;
  save(invoice: Invoice): Promise<void>;
}
