import { UseCase } from '../../../shared/application/models/UseCase';
import { UniqueEntityID } from '../../../shared/core/UniqueEntityID';
import { Client } from '../../domain/Client/Client';
import { ClientId } from '../../domain/Client/ClientId';
import { ClientName } from '../../domain/Client/ClientName';
import { ClientsRepository } from '../../domain/Client/ClientsRepository';
import { Invoice } from '../../domain/Invoice/Invoice';
import { InvoiceFactory } from '../../domain/Invoice/InvoiceFactory';
import { InvoicesRepository } from '../../domain/Invoice/InvoicesRepository';
import { InvoiceTypes } from '../../domain/Invoice/InvoiceType';
import { ProductId } from '../../domain/Product/ProductId';
import { ProductPrice } from '../../domain/Product/ProductPrice';
import { ProductsRepository } from '../../domain/Product/ProductsRepository';
import { Sale } from '../../domain/Sale/Sale';
import { SalesRepository } from '../../domain/Sale/SalesRepository';
import { Cuit } from '../../domain/shared/Cuit';
import { Mail } from '../../domain/shared/Mail';
import { Phone } from '../../domain/shared/Phone';
import { TransactionProduct } from '../../domain/TransactionProduct/TransactionProduct';
import { TransactionProductQuantity } from '../../domain/TransactionProduct/TransactionProductQuantity';
import {
  RegisterSaleRequestDTO,
  RegisterSaleRequestDTOClient,
  RegisterSaleRequestDTOInvoice,
  RegisterSaleRequestDTOProduct,
} from './RegisterSaleRequestDTO';

export class RegisterSale implements UseCase<RegisterSaleRequestDTO, Sale> {
  private invoiceFactory = new InvoiceFactory();

  constructor(
    private salesRepo: SalesRepository,
    private clientsRepo: ClientsRepository,
    private invoicesRepo: InvoicesRepository,
    private productsRepo: ProductsRepository,
  ) {}

  async execute(request: RegisterSaleRequestDTO): Promise<Sale> {
    const client = await this.handleRequestClient(request.client);
    const invoice = await this.handleRequestInvoice(request.invoice);
    const products = await Promise.all(request.products.map(async p => await this.handleRequestProduct(p)));
    const sale = Sale.create({ client, invoice, products });
    await this.salesRepo.save(sale);
    return sale;
  }

  private async handleRequestClient(request: RegisterSaleRequestDTOClient): Promise<Client> {
    if (request.id) {
      const clientId = ClientId.create(new UniqueEntityID(request.id));
      return await this.clientsRepo.findById(clientId);
    } else if (request.new) {
      const { cuit, mail, name, phone } = request.new;
      const client = Client.create({
        cuit: Cuit.create({ value: cuit }),
        mail: Mail.create({ value: mail }),
        name: ClientName.create({ value: name }),
        phone: Phone.create({ value: phone }),
      });
      await this.clientsRepo.save(client);
      return client;
    }
  }

  private async handleRequestInvoice(request: RegisterSaleRequestDTOInvoice): Promise<Invoice> {
    const { date, number } = request;
    const invoice = this.invoiceFactory.create({ date, number, type: InvoiceTypes.sale });
    await this.invoicesRepo.save(invoice);
    return invoice;
  }

  private async handleRequestProduct(request: RegisterSaleRequestDTOProduct): Promise<TransactionProduct> {
    const productId = ProductId.create(new UniqueEntityID(request.id));
    const product = await this.productsRepo.findById(productId);
    product.substractStock(request.quantity);
    await this.productsRepo.save(product);
    return TransactionProduct.create({
      category: product.category,
      name: product.name,
      price: ProductPrice.create({ value: request.price }),
      quantity: TransactionProductQuantity.create({ value: request.quantity }),
    });
  }
}
