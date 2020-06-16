import { UseCase } from '../../../shared/application/models/UseCase';
import { UniqueEntityID } from '../../../shared/core/UniqueEntityID';
import { Invoice } from '../../domain/Invoice/Invoice';
import { InvoiceFactory } from '../../domain/Invoice/InvoiceFactory';
import { InvoicesRepository } from '../../domain/Invoice/InvoicesRepository';
import { InvoiceTypes } from '../../domain/Invoice/InvoiceType';
import { CategoriesRepository } from '../../domain/Product/category/CategoriesRepository';
import { Category } from '../../domain/Product/category/Category';
import { CategoryId } from '../../domain/Product/category/CategoryId';
import { CategoryName } from '../../domain/Product/category/CategoryName';
import { Product } from '../../domain/Product/Product';
import { ProductId } from '../../domain/Product/ProductId';
import { ProductName } from '../../domain/Product/ProductName';
import { ProductPrice } from '../../domain/Product/ProductPrice';
import { ProductsRepository } from '../../domain/Product/ProductsRepository';
import { ProductStock } from '../../domain/Product/ProductStock';
import { Purchase } from '../../domain/Purchase/Purchase';
import { PurchasesRepository } from '../../domain/Purchase/PurchasesRepository';
import { PurchaseTotal } from '../../domain/Purchase/PurchaseTotal';
import { Cuit } from '../../domain/shared/Cuit';
import { Mail } from '../../domain/shared/Mail';
import { Phone } from '../../domain/shared/Phone';
import { Supplier } from '../../domain/Supplier/Supplier';
import { SupplierId } from '../../domain/Supplier/SupplierId';
import { SupplierName } from '../../domain/Supplier/SupplierName';
import { SuppliersRepository } from '../../domain/Supplier/SuppliersRepository';
import { TransactionProduct } from '../../domain/TransactionProduct/TransactionProduct';
import { TransactionProductQuantity } from '../../domain/TransactionProduct/TransactionProductQuantity';
import {
  RegisterPurchaseRequestDTO,
  RegisterPurchaseRequestDTOInvoice,
  RegisterPurchaseRequestDTOProduct,
  RegisterPurchaseRequestDTOSupplier,
} from './RegisterPurchaseRequestDTO';

export class RegisterPurchase implements UseCase<RegisterPurchaseRequestDTO, Purchase> {
  private invoiceFactory = new InvoiceFactory();

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
    const invoice = this.invoiceFactory.create({ date, number, type: InvoiceTypes.purchase });
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
        cuit: Cuit.create({ value: cuit }),
        mail: Mail.create({ value: mail }),
        name: SupplierName.create({ value: name }),
        phone: Phone.create({ value: phone }),
      });
      await this.suppliersRepo.save(supplier);
      return supplier;
    }
  }

  private async handleRequestProduct(request: RegisterPurchaseRequestDTOProduct): Promise<TransactionProduct> {
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

    return TransactionProduct.create(
      {
        category: product.category,
        name: product.name,
        price: product.price,
        quantity: TransactionProductQuantity.create({ value: request.quantity }),
      },
      product.productId.id,
    );
  }

  private async createPurchase(
    invoice: Invoice,
    supplier: Supplier,
    products: TransactionProduct[],
  ): Promise<Purchase> {
    const purchase = Purchase.create({
      invoice,
      supplier,
      products,
      total: PurchaseTotal.create({ value: products }),
    });

    await this.purchasesRepo.save(purchase);

    return purchase;
  }
}
