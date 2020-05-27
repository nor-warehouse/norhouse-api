/* eslint-disable @typescript-eslint/no-use-before-define */
import { UniqueEntityID } from '../../../../shared/core/UniqueEntityID';
import { InvoiceNumber } from '../../../domain/invoice/InvoiceNumber';
import { InvoicesRepository } from '../../../domain/invoice/InvoicesRepository';
import { CategoriesRepository } from '../../../domain/product/category/CategoriesRepository';
import { Category } from '../../../domain/product/category/Category';
import { CategoryName } from '../../../domain/product/category/CategoryName';
import { Product } from '../../../domain/product/product/Product';
import { ProductName } from '../../../domain/product/product/ProductName';
import { ProductPrice } from '../../../domain/product/product/ProductPrice';
import { ProductsRepository } from '../../../domain/product/product/ProductsRepository';
import { ProductStock } from '../../../domain/product/product/ProductStock';
import { PurchaseInvoice } from '../../../domain/purchase/invoice/PurchaseInvoice';
import { PurchaseProduct } from '../../../domain/purchase/product/PurchaseProduct';
import { Supplier } from '../../../domain/supplier/Supplier';
import { SupplierCuit } from '../../../domain/supplier/SupplierCuit';
import { SupplierMail } from '../../../domain/supplier/SupplierMail';
import { SupplierName } from '../../../domain/supplier/SupplierName';
import { SupplierPhone } from '../../../domain/supplier/SupplierPhone';
import { SuppliersRepository } from '../../../domain/supplier/SuppliersRepository';
import { InRuntimeMemoryInvoicesRepository } from '../../../infrastructure/invoice/InRuntimeMemoryInvoicesRepository';
import { InMemoryCategoriesRepository } from '../../../infrastructure/product/InMemoryCategoriesRepository';
import { InMemoryProductsRepository } from '../../../infrastructure/product/InMemoryProductsRepository';
import { InRuntimeMemorySuppliersRepository } from '../../../infrastructure/supplier/InRuntimeMemorySuppliersRepository';
import { RegisterPurchaseRequestDTO } from '../RegisterPurchaseRequestDTO';
import { RegisterPurchaseUseCase } from '../RegisterPurchaseUseCase';

let request: RegisterPurchaseRequestDTO;
let purchase: any;

const invoicesRepo: InvoicesRepository = new InRuntimeMemoryInvoicesRepository();
let suppliersRepo: SuppliersRepository = new InRuntimeMemorySuppliersRepository();
let categoriesRepo: CategoriesRepository = new InMemoryCategoriesRepository();
let productsRepo: ProductsRepository = new InMemoryProductsRepository();

let registerPurchase = new RegisterPurchaseUseCase(invoicesRepo, suppliersRepo, categoriesRepo, productsRepo);

beforeEach(() => cleanUp());

test('Given a valid RegisterPurchaseRequestDTO, when purchase is registered, then should not throw', () => {
  givenARegisterPurchaseRequest();
  expect(whenPurchaseIsRegisteredWithProducts).not.toThrow();
});

test('Given a valid RegisterPurchaseRequestDTO, when purchase is registered, then should have a PurchaseInvoice', async () => {
  givenARegisterPurchaseRequest();
  await whenPurchaseIsRegisteredWithProducts();
  expect(purchase).toHaveProperty('invoice');
  expect(purchase.invoice).toBeInstanceOf(PurchaseInvoice);
  expect(purchase.invoice).toHaveProperty('date');
  expect(purchase.invoice.date.value).toEqual(request.invoice.date);
  expect(purchase.invoice).toHaveProperty('number');
  expect(purchase.invoice.number.value).toEqual(request.invoice.number);
});

test('Given a valid RegisterPurchaseRequestDTO, when purchase is registered, then an Invoice should be saved', async () => {
  givenARegisterPurchaseRequest();
  await whenPurchaseIsRegisteredWithProducts();

  const invoiceNumber = InvoiceNumber.create({ value: request.invoice.number });
  const invoice = await invoicesRepo.findByNumber(invoiceNumber);

  expect(invoice).not.toBeFalsy();
  expect(invoice).toHaveProperty('type');
  expect(invoice.type).toEqual('purchase');
  expect(invoice).toHaveProperty('date');
  expect(invoice.date.value).toEqual(request.invoice.date);
  expect(invoice).toHaveProperty('number');
  expect(invoice.number.value).toEqual(request.invoice.number);
});

test('Given a valid RegisterPurchaseRequestDTO with existing supplier, when purchase is registered, then Purchase should have its id', async () => {
  suppliersRepo.findById = jest.fn(() =>
    Promise.resolve(
      Supplier.create(
        {
          cuit: SupplierCuit.create({ value: 'cuit' }),
          mail: SupplierMail.create({ value: 'correo' }),
          name: SupplierName.create({ value: 'nombre' }),
          phone: SupplierPhone.create({ value: 'celular' }),
        },
        new UniqueEntityID(request.supplier.id),
      ),
    ),
  );

  givenARegisterPurchaseRequest();
  await whenPurchaseIsRegisteredWithProducts();
  expect(purchase).toHaveProperty('supplierId');
  expect(purchase.supplierId.id.toValue()).toEqual(request.supplier.id);
});

test('Given a valid RegisterPurchaseRequestDTO with a new supplier, when purchase is registered, then should save a new Supplier', async () => {
  givenARegisterPurchaseRequestWithNewSupplier();
  await whenPurchaseIsRegisteredWithProducts();
  expect(purchase).toHaveProperty('supplierId');
  expect(purchase.supplierId).not.toBeFalsy();

  const supplier = await suppliersRepo.findById(purchase.supplierId);
  expect(supplier.supplierId.equals(purchase.supplierId)).toBe(true);
  expect(supplier.cuit.value).toEqual(request.supplier.new.cuit);
  expect(supplier.mail.value).toEqual(request.supplier.new.mail);
  expect(supplier.name.value).toEqual(request.supplier.new.name);
  expect(supplier.phone.value).toEqual(request.supplier.new.phone);
});

test('Given a valid RegisterPurchaseRequestDTO with existing products, when purchase is registered, then should have them as props', async () => {
  givenARegisterPurchaseRequest();
  await whenPurchaseIsRegisteredWithProducts();
  expect(purchase).toHaveProperty('products');
  expect(purchase.products).toHaveLength(2);

  purchase.products.forEach((product, i) => {
    const rawProduct = request.products[i];
    expect(product).toBeInstanceOf(PurchaseProduct);
    expect(product.productId.id.toValue()).toEqual(rawProduct.id);
    expect(product.category.categoryId.id.toValue()).toEqual('8');
    expect(product.price.value).toEqual(rawProduct.price);
    expect(product.quantity.value).toEqual(rawProduct.quantity);
    expect(product.totalPrice).toEqual(rawProduct.price * rawProduct.quantity);
  });
});

test('Given a valid RegisterPurchaseRequestDTO with new product, when purchase is registered, then a Product should be created', async () => {
  givenARegisterPurchaseRequestWithNewProduct();
  await whenPurchaseIsRegistered(withCategories);
  expect(purchase).toHaveProperty('products');
  expect(purchase.products).toHaveLength(1);

  purchase.products.forEach(async (product, i) => {
    const rawProduct = request.products[i];
    expect(product).toBeInstanceOf(PurchaseProduct);
    expect(product.productId).not.toBeFalsy();
    expect(product.category.categoryId.id.toValue()).toEqual('8');
    expect(product.price.value).toEqual(rawProduct.price);
    expect(product.quantity.value).toEqual(rawProduct.quantity);
    expect(product.totalPrice).toEqual(rawProduct.price * rawProduct.quantity);

    const storedProduct = await productsRepo.findById(product.productId);
    expect(storedProduct.productId.equals(product.productId)).toBe(true);
    expect(storedProduct.stock.value).toEqual(3);
  });
});

const basePurchaseRequestDTO: RegisterPurchaseRequestDTO = {
  invoice: {
    date: new Date(1956, 9, 10),
    number: '4523',
  },
  products: [
    { id: '1', price: 120, quantity: 12 },
    { id: '2', price: 120, quantity: 12 },
  ],
  supplier: {
    id: '25',
  },
};

function givenARegisterPurchaseRequest(): void {
  request = basePurchaseRequestDTO;
}

function givenARegisterPurchaseRequestWithNewSupplier(): void {
  request = {
    ...basePurchaseRequestDTO,
    supplier: {
      new: {
        cuit: '12-34-56',
        mail: 'supplier@mail.com',
        name: 'Proveedor SA',
        phone: '48567768',
      },
    },
  };
}

function givenARegisterPurchaseRequestWithNewProduct(): void {
  request = {
    ...basePurchaseRequestDTO,
    products: [
      {
        new: {
          name: 'jabon anti bacterial',
          category: { id: '8' },
        },
        price: 12,
        quantity: 3,
      },
    ],
  };
}

async function whenPurchaseIsRegistered(...fns: Function[]): Promise<void> {
  fns.forEach(fn => fn());
  purchase = await registerPurchase.execute(request);
}

async function whenPurchaseIsRegisteredWithProducts(): Promise<void> {
  await whenPurchaseIsRegistered(withProducts);
}

function cleanUp(): void {
  request = undefined;
  purchase = undefined;
  suppliersRepo = new InRuntimeMemorySuppliersRepository();
  categoriesRepo = new InMemoryCategoriesRepository();
  productsRepo = new InMemoryProductsRepository();
  registerPurchase = new RegisterPurchaseUseCase(invoicesRepo, suppliersRepo, categoriesRepo, productsRepo);
}

function createCategory(id): Category {
  return Category.create({ name: CategoryName.create({ value: 'alcohol en gel' }) }, new UniqueEntityID(id));
}

function withProducts(): void {
  productsRepo.findById = jest.fn(productId =>
    Promise.resolve(
      Product.create(
        {
          category: createCategory('8'),
          name: ProductName.create({ value: 'jabon' }),
          price: ProductPrice.create({ value: 120 }),
          stock: ProductStock.create({ value: 12 }),
        },
        productId.id,
      ),
    ),
  );
}

function withCategories(): void {
  categoriesRepo.findById = jest.fn(categoryId => Promise.resolve(createCategory(categoryId.id.toValue())));
}
