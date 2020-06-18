import { InMemoryClientsRepository } from '../../../../infrastructure/persistence/inMemory/Clients/InMemoryClientsRepository';
import { InMemoryInvoicesRepository } from '../../../../infrastructure/persistence/inMemory/Invoices/InMemoryInvoicesRepository';
import { InMemoryProductsRepository } from '../../../../infrastructure/persistence/inMemory/Products/InMemoryProductsRepository';
import { InMemorySalesRepository } from '../../../../infrastructure/persistence/inMemory/Sales/InMemorySalesRepository';
import { PaginationService } from '../../../../shared/application/services/PaginationService';
import { UniqueEntityID } from '../../../../shared/core/UniqueEntityID';
import { Client } from '../../../domain/Client/Client';
import { ClientName } from '../../../domain/Client/ClientName';
import { ClientsRepository } from '../../../domain/Client/ClientsRepository';
import { Invoice } from '../../../domain/Invoice/Invoice';
import { InvoicesRepository } from '../../../domain/Invoice/InvoicesRepository';
import { InvoiceTypes } from '../../../domain/Invoice/InvoiceType';
import { Category } from '../../../domain/Product/Category/Category';
import { CategoryName } from '../../../domain/Product/Category/CategoryName';
import { Product } from '../../../domain/Product/Product';
import { ProductName } from '../../../domain/Product/ProductName';
import { ProductPrice } from '../../../domain/Product/ProductPrice';
import { ProductsRepository } from '../../../domain/Product/ProductsRepository';
import { ProductStock } from '../../../domain/Product/ProductStock';
import { Sale } from '../../../domain/Sale/Sale';
import { SaleId } from '../../../domain/Sale/SaleId';
import { SalesRepository } from '../../../domain/Sale/SalesRepository';
import { Cuit } from '../../../domain/shared/Cuit';
import { Mail } from '../../../domain/shared/Mail';
import { Phone } from '../../../domain/shared/Phone';
import { TransactionProduct } from '../../../domain/TransactionProduct/TransactionProduct';
import { RegisterSale } from '../RegisterSale';
import {
  RegisterSaleRequestDTO,
  RegisterSaleRequestDTOClient,
  RegisterSaleRequestDTOProduct,
} from '../RegisterSaleRequestDTO';

const rawFakeClient: RegisterSaleRequestDTOClient['new'] = {
  cuit: 'some-cuit',
  mail: 'some-mail',
  name: 'some-name',
  phone: 'some-phone',
};

function createFakeClient(id?: string): Client {
  const idOrNot = id ? new UniqueEntityID(id) : undefined;
  return Client.create(
    {
      cuit: Cuit.create({ value: rawFakeClient.cuit }),
      mail: Mail.create({ value: rawFakeClient.mail }),
      name: ClientName.create({ value: rawFakeClient.name }),
      phone: Phone.create({ value: rawFakeClient.phone }),
    },
    idOrNot,
  );
}

function createFakeProduct(id?: string): Product {
  const idOrNot = id ? new UniqueEntityID(id) : undefined;
  return Product.create(
    {
      category: Category.create({ name: CategoryName.create({ value: 'some-category' }) }),
      name: ProductName.create({ value: 'some-name' }),
      price: ProductPrice.create({ value: 200 }),
      stock: ProductStock.create({ value: 5 }),
    },
    idOrNot,
  );
}

let request: RegisterSaleRequestDTO = {
  client: { id: '5' },
  invoice: {
    date: new Date(),
    number: '12-34-56',
  },
  products: [{ id: '1', price: 200, quantity: 2 }],
};

function enhanceRequest(props: object): void {
  request = { ...request, ...props };
}

const paginationService = new PaginationService();
let salesRepo: SalesRepository = new InMemorySalesRepository();
let clientsRepo: ClientsRepository = new InMemoryClientsRepository();
let invoicesRepo: InvoicesRepository = new InMemoryInvoicesRepository();
let productsRepo: ProductsRepository = new InMemoryProductsRepository(paginationService);
let registerSale = new RegisterSale(salesRepo, clientsRepo, invoicesRepo, productsRepo);

beforeEach(() => {
  salesRepo = new InMemorySalesRepository();
  clientsRepo = new InMemoryClientsRepository();
  invoicesRepo = new InMemoryInvoicesRepository();
  productsRepo = new InMemoryProductsRepository(paginationService);
  registerSale = new RegisterSale(salesRepo, clientsRepo, invoicesRepo, productsRepo);
});

test('Given a RegisterSaleRequestDTO, when sale is registered, then should create a Sale', async () => {
  productsRepo.findById = jest.fn().mockImplementationOnce(id => Promise.resolve(createFakeProduct(id)));
  const sale = await registerSale.execute(request);
  expect(sale).toBeInstanceOf(Sale);
});

test('Given a RegisterSaleRequestDTO, when sale is registered, then created Sale should have a SaleId', async () => {
  productsRepo.findById = jest.fn().mockImplementationOnce(id => Promise.resolve(createFakeProduct(id)));
  const sale = await registerSale.execute(request);
  expect(sale.saleId).toBeDefined();
  expect(sale.saleId).toBeInstanceOf(SaleId);
});

test('Given a RegisterSaleRequestDTO, when sale is registered, then created Sale should be persisted', async () => {
  productsRepo.findById = jest.fn().mockImplementationOnce(id => Promise.resolve(createFakeProduct(id)));
  const sale = await registerSale.execute(request);
  const persistedSale = await salesRepo.findById(sale.saleId);
  expect(persistedSale).toBeInstanceOf(Sale);
  expect(persistedSale.saleId.equals(sale.saleId)).toBe(true);
});

test('Given a RegisterSaleRequestDTO with client id, when sale is registered, then created Sale should have a Client', async () => {
  productsRepo.findById = jest.fn().mockImplementationOnce(id => Promise.resolve(createFakeProduct(id)));
  clientsRepo.findById = jest.fn().mockImplementationOnce(() => Promise.resolve(createFakeClient(request.client.id)));
  const sale = await registerSale.execute(request);
  expect(sale.client).toBeDefined();
  expect(sale.client).toBeInstanceOf(Client);
});

test('Given a RegisterSaleRequestDTO with new client, when sale is registered, then created Sale should have a Client', async () => {
  productsRepo.findById = jest.fn().mockImplementationOnce(id => Promise.resolve(createFakeProduct(id)));
  enhanceRequest({ client: { new: rawFakeClient } as RegisterSaleRequestDTOClient });
  const sale = await registerSale.execute(request);
  expect(sale.client).toBeDefined();
  expect(sale.client).toBeInstanceOf(Client);
});

test('Given a RegisterSaleRequestDTO with new client, when sale is registered, then created Client should be persisted', async () => {
  productsRepo.findById = jest.fn().mockImplementationOnce(id => Promise.resolve(createFakeProduct(id)));
  enhanceRequest({ client: { new: rawFakeClient } as RegisterSaleRequestDTOClient });
  const sale = await registerSale.execute(request);
  const persistedClient = await clientsRepo.findById(sale.client.clientId);
  expect(persistedClient).toBeInstanceOf(Client);
});

test('Given a RegisterSaleRequestDTO, when sale is registered, then created Sale should have a sale type Invoice', async () => {
  productsRepo.findById = jest.fn().mockImplementationOnce(id => Promise.resolve(createFakeProduct(id)));
  const sale = await registerSale.execute(request);
  expect(sale.invoice).toBeDefined();
  expect(sale.invoice).toBeInstanceOf(Invoice);
  expect(sale.invoice.type).toEqual(InvoiceTypes.sale);
});

test('Given a RegisterSaleRequestDTO, when sale is registered, then created Invoice should be persisted', async () => {
  productsRepo.findById = jest.fn().mockImplementationOnce(id => Promise.resolve(createFakeProduct(id)));
  const sale = await registerSale.execute(request);
  const persistedInvoice = await invoicesRepo.findById(sale.invoice.invoiceId);
  expect(persistedInvoice).toBeInstanceOf(Invoice);
});

test('Given a RegisterSaleRequestDTO, when sale is registered, then created Sale should have a list of TransactionProducts', async () => {
  productsRepo.findById = jest.fn().mockImplementationOnce(id => Promise.resolve(createFakeProduct(id)));
  const sale = await registerSale.execute(request);
  expect(sale.products).toHaveLength(1);
  sale.products.forEach(product => {
    expect(product).toBeDefined();
    expect(product).toBeInstanceOf(TransactionProduct);
  });
});

test('Given a RegisterSaleRequestDTO, when sale is registered, then its TransactionProducts should update stock', async () => {
  const product = createFakeProduct();
  await productsRepo.save(product);
  enhanceRequest({
    products: [{ id: product.productId.id.toString(), price: 200, quantity: 2 }] as RegisterSaleRequestDTOProduct[],
  });
  await registerSale.execute(request);
  const persistedProduct = await productsRepo.findById(product.productId);
  expect(persistedProduct.stock.value).toEqual(3);
});
