import { UseCase } from '../../../shared/application/UseCase';
import { UniqueEntityID } from '../../../shared/core/UniqueEntityID';
import { Invoice } from '../../domain/invoice/Invoice';
import { InvoiceDate } from '../../domain/invoice/InvoiceDate';
import { InvoiceNumber } from '../../domain/invoice/InvoiceNumber';
import { InvoicesRepository } from '../../domain/invoice/InvoicesRepository';
import { CategoriesRepository } from '../../domain/product/category/CategoriesRepository';
import { CategoryId } from '../../domain/product/category/CategoryId';
import { Product } from '../../domain/product/product/Product';
import { ProductId } from '../../domain/product/product/ProductId';
import { ProductName } from '../../domain/product/product/ProductName';
import { ProductPrice } from '../../domain/product/product/ProductPrice';
import { ProductsRepository } from '../../domain/product/product/ProductsRepository';
import { ProductStock } from '../../domain/product/product/ProductStock';
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
        let product: Product;

        if (raw.id) {
          const productId = ProductId.create(new UniqueEntityID(raw.id));
          product = await this.productsRepo.findById(productId);
        } else if (raw.new) {
          if (raw.new.category.id) {
            const categoryId = CategoryId.create(new UniqueEntityID(raw.new.category.id));
            const category = await this.categoriesRepo.findById(categoryId);
            product = Product.create({
              category,
              name: ProductName.create({ value: raw.new.name }),
              price: ProductPrice.create({ value: raw.price }),
              stock: ProductStock.create({ value: raw.quantity }),
            });
            await this.productsRepo.save(product);
          }
          // else if (raw.new.category.new) {
          //   category = Category.create({ name: CategoryName.create({ value: raw.new.category.new }) });
          //   await this.categoriesRepo.save(category);
          // }
        }

        return PurchaseProduct.create(
          {
            category: product.category,
            price: product.price,
            quantity: PurchaseProductQuantity.create({ value: raw.quantity }),
          },
          product.productId.id,
        );
      }),
    );

    return {
      invoice: purchaseInvoice,
      supplierId,
      products,
    };
  }
}
