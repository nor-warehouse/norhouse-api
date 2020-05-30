import { UseCase } from '../../../shared/application/UseCase';
import { UniqueEntityID } from '../../../shared/core/UniqueEntityID';
import { Invoice } from '../../domain/invoice/Invoice';
import { InvoiceDate } from '../../domain/invoice/InvoiceDate';
import { InvoiceNumber } from '../../domain/invoice/InvoiceNumber';
import { InvoicesRepository } from '../../domain/invoice/InvoicesRepository';
import { InvoiceTypes } from '../../domain/invoice/InvoiceType';
import { CategoriesRepository } from '../../domain/product/category/CategoriesRepository';
import { Category } from '../../domain/product/category/Category';
import { CategoryId } from '../../domain/product/category/CategoryId';
import { CategoryName } from '../../domain/product/category/CategoryName';
import { Product } from '../../domain/product/product/Product';
import { ProductId } from '../../domain/product/product/ProductId';
import { ProductName } from '../../domain/product/product/ProductName';
import { ProductPrice } from '../../domain/product/product/ProductPrice';
import { ProductsRepository } from '../../domain/product/product/ProductsRepository';
import { ProductStock } from '../../domain/product/product/ProductStock';
import { PurchaseProduct } from '../../domain/purchase/product/PurchaseProduct';
import { PurchaseProductQuantity } from '../../domain/purchase/product/PurchaseProductQuantity';
import { Purchase } from '../../domain/purchase/purchase/Purchase';
import { PurchasesRepository } from '../../domain/purchase/purchase/PurchasesRepository';
import { Supplier } from '../../domain/supplier/Supplier';
import { SupplierCuit } from '../../domain/supplier/SupplierCuit';
import { SupplierId } from '../../domain/supplier/SupplierId';
import { SupplierMail } from '../../domain/supplier/SupplierMail';
import { SupplierName } from '../../domain/supplier/SupplierName';
import { SupplierPhone } from '../../domain/supplier/SupplierPhone';
import { SuppliersRepository } from '../../domain/supplier/SuppliersRepository';
import {
  RegisterPurchaseRequestDTO,
  RegisterPurchaseRequestDTOInvoice,
  RegisterPurchaseRequestDTOProduct,
  RegisterPurchaseRequestDTOSupplier,
} from './RegisterPurchaseRequestDTO';

export class RegisterPurchaseUseCase implements UseCase<RegisterPurchaseRequestDTO, Purchase> {
  constructor(
    private invoicesRepo: InvoicesRepository,
    private suppliersRepo: SuppliersRepository,
    private categoriesRepo: CategoriesRepository,
    private productsRepo: ProductsRepository,
    private purchasesRepo: PurchasesRepository,
  ) {}

  async execute(request: RegisterPurchaseRequestDTO): Promise<Purchase> {
    const handleInvoice = this.handleRequestInvoice(request.invoice);
    const handleSupplier = this.handleRequestSupplier(request.supplier);
    const products = await Promise.all(request.products.map(async p => await this.handleRequestProduct(p)));
    const [invoice, supplier] = await Promise.all([handleInvoice, handleSupplier]);

    return await this.createPurchase(invoice, supplier, products);
  }

  private async handleRequestInvoice(request: RegisterPurchaseRequestDTOInvoice): Promise<Invoice> {
    const { date, number } = request;
    const invoice = Invoice.create({
      date: InvoiceDate.create({ value: date }),
      number: InvoiceNumber.create({ value: number }),
      type: InvoiceTypes.purchase,
    });
    await this.invoicesRepo.save(invoice);
    return invoice;
  }

  private async handleRequestSupplier(request: RegisterPurchaseRequestDTOSupplier): Promise<Supplier> {
    if (request.id) {
      const id = SupplierId.create(new UniqueEntityID(request.id));
      const supplier = await this.suppliersRepo.findById(id);
      if (supplier) return supplier;
    } else if (request.new) {
      const { cuit, mail, name, phone } = request.new;
      const supplier = Supplier.create({
        cuit: SupplierCuit.create({ value: cuit }),
        mail: SupplierMail.create({ value: mail }),
        name: SupplierName.create({ value: name }),
        phone: SupplierPhone.create({ value: phone }),
      });
      await this.suppliersRepo.save(supplier);
      return supplier;
    }
  }

  private async handleRequestProduct(request: RegisterPurchaseRequestDTOProduct): Promise<PurchaseProduct> {
    let product: Product;

    if (request.id) {
      const productId = ProductId.create(new UniqueEntityID(request.id));
      product = await this.productsRepo.findById(productId);
      product.addStock(request.quantity);
      await this.productsRepo.save(product);
    } else if (request.new) {
      let category: Category;

      if (request.new.category.id) {
        const categoryId = CategoryId.create(new UniqueEntityID(request.new.category.id));
        category = await this.categoriesRepo.findById(categoryId);
      } else if (request.new.category.new) {
        category = Category.create({ name: CategoryName.create({ value: request.new.category.new }) });
        await this.categoriesRepo.save(category);
      }

      product = Product.create({
        category,
        name: ProductName.create({ value: request.new.name }),
        price: ProductPrice.create({ value: request.price }),
        stock: ProductStock.create({ value: request.quantity }),
      });

      await this.productsRepo.save(product);
    }

    return PurchaseProduct.create(
      {
        category: product.category,
        price: product.price,
        quantity: PurchaseProductQuantity.create({ value: request.quantity }),
      },
      product.productId.id,
    );
  }

  private async createPurchase(invoice: Invoice, supplier: Supplier, products: PurchaseProduct[]): Promise<Purchase> {
    const purchase = Purchase.create({
      invoice,
      supplier,
      products,
    });

    await this.purchasesRepo.save(purchase);

    return purchase;
  }
}
