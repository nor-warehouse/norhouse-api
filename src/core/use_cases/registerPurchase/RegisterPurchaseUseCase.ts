import { UseCase } from '../../../shared/application/UseCase';
import { Invoice } from '../../domain/invoice/Invoice';
import { InvoiceDate } from '../../domain/invoice/InvoiceDate';
import { InvoiceNumber } from '../../domain/invoice/InvoiceNumber';
import { InvoicesRepository } from '../../domain/invoice/InvoicesRepository';
import { PurchaseInvoice } from '../../domain/purchase/invoice/PurchaseInvoice';
import { RegisterPurchaseRequestDTO } from './RegisterPurchaseRequestDTO';

export class RegisterPurchaseUseCase implements UseCase<RegisterPurchaseRequestDTO> {
  constructor(private invoicesRepo: InvoicesRepository) {}

  async execute(request: RegisterPurchaseRequestDTO): Promise<any> {
    const { date, number } = request.invoice;
    const invoiceDate = InvoiceDate.create({ value: date });
    const invoiceNumber = InvoiceNumber.create({ value: number });
    const purchaseInvoice = PurchaseInvoice.create({ value: { date: invoiceDate, number: invoiceNumber } });
    const invoice = Invoice.create({ date: purchaseInvoice.date, number: purchaseInvoice.number, type: 'purchase' });
    await this.invoicesRepo.save(invoice);
    return {
      invoice: purchaseInvoice,
    };
  }
}
