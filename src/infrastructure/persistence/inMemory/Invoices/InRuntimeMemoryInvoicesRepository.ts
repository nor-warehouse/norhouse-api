import { Invoice } from '../../../../core/domain/invoice/Invoice';
import { InvoiceId } from '../../../../core/domain/invoice/InvoiceId';
import { InvoiceNumber } from '../../../../core/domain/invoice/InvoiceNumber';
import { InvoicesRepository } from '../../../../core/domain/invoice/InvoicesRepository';

export class InRuntimeMemoryInvoicesRepository implements InvoicesRepository {
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
