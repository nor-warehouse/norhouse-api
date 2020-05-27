import { UseCase } from '../../../shared/application/UseCase';
import { UniqueEntityID } from '../../../shared/core/UniqueEntityID';
import { Invoice } from '../../domain/invoice/Invoice';
import { InvoiceDate } from '../../domain/invoice/InvoiceDate';
import { InvoiceNumber } from '../../domain/invoice/InvoiceNumber';
import { InvoicesRepository } from '../../domain/invoice/InvoicesRepository';
import { CategoriesRepository } from '../../domain/product/category/CategoriesRepository';
import { ProductPrice } from '../../domain/product/product/ProductPrice';
import { ProductsRepository } from '../../domain/product/product/ProductsRepository';
import { PurchaseInvoice } from '../../domain/purchase/invoice/PurchaseInvoice';
import { PurchaseProduct } from '../../domain/purchase/product/PurchaseProduct';
import { PurchaseProductQuantity } from '../../domain/purchase/product/PurchaseProductQuantity';
import { Supplier } from '../../domain/supplier/Supplier';
import { SupplierCuit } from '../../domain/supplier/SupplierCuit';
import { SupplierId } from '../../domain/supplier/SupplierId';
import { SupplierMail } from '../../domain/supplier/SupplierMail';
import { SupplierName } from '../../domain/supplier/SupplierName';
import { SupplierPhone } from '../../domain/supplier/SupplierPhone';
import { SuppliersRepository } from '../../domain/supplier/SuppliersRepository';
import { RegisterPurchaseRequestDTO } from './RegisterPurchaseRequestDTO';
import { Category } from '../../domain/product/category/Category';
import { CategoryId } from '../../domain/product/category/CategoryId';

export class RegisterPurchaseUseCase implements UseCase<RegisterPurchaseRequestDTO> {
  constructor(
    private invoicesRepo: InvoicesRepository,
    private suppliersRepo: SuppliersRepository,
    private categoriesRepo: CategoriesRepository,
    private productsRepo: ProductsRepository,
  ) {}

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

    // Setup Products
    const products = await Promise.all(
      request.products.map(async raw => {
        if (raw.category.id) {
          const categoryId = CategoryId.create(new UniqueEntityID(raw.category.id));
          const category = await this.categoriesRepo.findById(categoryId);
          return PurchaseProduct.create(
            {
              category,
              price: ProductPrice.create({ value: raw.price }),
              quantity: PurchaseProductQuantity.create({ value: raw.quantity }),
            },
            new UniqueEntityID(raw.product.id),
          );
        }
      }),
    );

    return {
      invoice: purchaseInvoice,
      supplierId,
      products,
    };
  }
}
