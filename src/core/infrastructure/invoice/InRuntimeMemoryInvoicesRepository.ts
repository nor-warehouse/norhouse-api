import { Invoice } from '../../domain/invoice/Invoice';
import { InvoiceNumber } from '../../domain/invoice/InvoiceNumber';
import { InvoicesRepository } from '../../domain/invoice/InvoicesRepository';

export class InRuntimeMemoryInvoicesRepository implements InvoicesRepository {
  private invoices: Invoice[] = [];

  findAll(): Promise<Invoice[]> {
    return Promise.resolve(this.invoices);
  }

  findByNumber(number: InvoiceNumber): Promise<Invoice | undefined> {
    const invoice = this.invoices.find(i => i.number.value === number.value);
    return Promise.resolve(invoice);
  }

  save(invoice: Invoice): Promise<void> {
    this.invoices.push(invoice);
    return Promise.resolve();
  }
}
