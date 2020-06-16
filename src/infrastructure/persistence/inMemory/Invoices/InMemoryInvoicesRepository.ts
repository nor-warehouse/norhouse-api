import { Invoice } from '../../../../core/domain/Invoice/Invoice';
import { InvoiceId } from '../../../../core/domain/Invoice/InvoiceId';
import { InvoiceNumber } from '../../../../core/domain/Invoice/InvoiceNumber';
import { InvoicesRepository } from '../../../../core/domain/Invoice/InvoicesRepository';

export class InMemoryInvoicesRepository implements InvoicesRepository {
  private invoices: Invoice[] = [];

  findById(id: InvoiceId): Promise<Invoice | undefined> {
    const invoice = this.invoices.find(invoice => invoice.invoiceId.equals(id));
    return Promise.resolve(invoice);
  }

  findByNumber(number: InvoiceNumber): Promise<Invoice | undefined> {
    const invoice = this.invoices.find(invoice => invoice.number.equals(number));
    return Promise.resolve(invoice);
  }

  save(invoice: Invoice): Promise<void> {
    this.invoices.push(invoice);
    return Promise.resolve();
  }
}
