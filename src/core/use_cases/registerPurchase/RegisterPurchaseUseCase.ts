import { UseCase } from '../../../shared/application/UseCase';
import { UniqueEntityID } from '../../../shared/core/UniqueEntityID';
import { Invoice } from '../../domain/invoice/Invoice';
import { InvoiceDate } from '../../domain/invoice/InvoiceDate';
import { InvoiceNumber } from '../../domain/invoice/InvoiceNumber';
import { InvoicesRepository } from '../../domain/invoice/InvoicesRepository';
import { PurchaseInvoice } from '../../domain/purchase/invoice/PurchaseInvoice';
import { Supplier } from '../../domain/supplier/Supplier';
import { SupplierCuit } from '../../domain/supplier/SupplierCuit';
import { SupplierId } from '../../domain/supplier/SupplierId';
import { SupplierMail } from '../../domain/supplier/SupplierMail';
import { SupplierName } from '../../domain/supplier/SupplierName';
import { SupplierPhone } from '../../domain/supplier/SupplierPhone';
import { SuppliersRepository } from '../../domain/supplier/SuppliersRepository';
import { RegisterPurchaseRequestDTO } from './RegisterPurchaseRequestDTO';

export class RegisterPurchaseUseCase implements UseCase<RegisterPurchaseRequestDTO> {
  constructor(private invoicesRepo: InvoicesRepository, private suppliersRepo: SuppliersRepository) {}

  async execute(request: RegisterPurchaseRequestDTO): Promise<any> {
    // Setup Invoice
    const { date, number } = request.invoice;
    const purchaseInvoice = PurchaseInvoice.create({
      value: {
        date: InvoiceDate.create({ value: date }),
        number: InvoiceNumber.create({ value: number }),
      },
    });
    const invoice = Invoice.create({ date: purchaseInvoice.date, number: purchaseInvoice.number, type: 'purchase' });
    await this.invoicesRepo.save(invoice);

    // Setup Supplier
    let supplierId: SupplierId;
    if (request.supplier.id) {
      const id = SupplierId.create(new UniqueEntityID(request.supplier.id));
      const supplier = await this.suppliersRepo.findById(id);
      if (supplier) {
        supplierId = supplier.supplierId;
      }
    } else if (request.supplier.new) {
      const { cuit, mail, name, phone } = request.supplier.new;
      const supplier = Supplier.create({
        cuit: SupplierCuit.create({ value: cuit }),
        mail: SupplierMail.create({ value: mail }),
        name: SupplierName.create({ value: name }),
        phone: SupplierPhone.create({ value: phone }),
      });
      await this.suppliersRepo.save(supplier);
      supplierId = supplier.supplierId;
    }

    return {
      invoice: purchaseInvoice,
      supplierId,
    };
  }
}
