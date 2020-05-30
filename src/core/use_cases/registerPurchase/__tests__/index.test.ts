/* eslint-disable @typescript-eslint/no-use-before-define */
import { UniqueEntityID } from '../../../../shared/core/UniqueEntityID';
import { Invoice } from '../../../domain/invoice/Invoice';
import { InvoiceNumber } from '../../../domain/invoice/InvoiceNumber';
import { InvoicesRepository } from '../../../domain/invoice/InvoicesRepository';
import { InvoiceTypes } from '../../../domain/invoice/InvoiceType';
import { CategoriesRepository } from '../../../domain/product/category/CategoriesRepository';
import { Category } from '../../../domain/product/category/Category';
import { CategoryName } from '../../../domain/product/category/CategoryName';
import { Product } from '../../../domain/product/Product';
import { ProductName } from '../../../domain/product/ProductName';
import { ProductPrice } from '../../../domain/product/ProductPrice';
import { ProductsRepository } from '../../../domain/product/ProductsRepository';
import { ProductStock } from '../../../domain/product/ProductStock';
import { PurchaseProduct } from '../../../domain/purchase/product/PurchaseProduct';
import { Purchase } from '../../../domain/purchase/Purchase';
import { PurchasesRepository } from '../../../domain/purchase/PurchasesRepository';
import { Supplier } from '../../../domain/supplier/Supplier';
import { SupplierCuit } from '../../../domain/supplier/SupplierCuit';
import { SupplierMail } from '../../../domain/supplier/SupplierMail';
import { SupplierName } from '../../../domain/supplier/SupplierName';
import { SupplierPhone } from '../../../domain/supplier/SupplierPhone';
import { SuppliersRepository } from '../../../domain/supplier/SuppliersRepository';
import { InRuntimeMemoryInvoicesRepository } from '../../../infrastructure/invoice/InRuntimeMemoryInvoicesRepository';
import { InMemoryCategoriesRepository } from '../../../infrastructure/product/InMemoryCategoriesRepository';
import { InMemoryProductsRepository } from '../../../infrastructure/product/InMemoryProductsRepository';
import { InMemoryPurchasesRepository } from '../../../infrastructure/purchase/InMemoryPurchasesRepository';
import { InRuntimeMemorySuppliersRepository } from '../../../infrastructure/supplier/InRuntimeMemorySuppliersRepository';
import { RegisterPurchaseRequestDTO } from '../RegisterPurchaseRequestDTO';
import { RegisterPurchaseUseCase } from '../RegisterPurchaseUseCase';

let request: RegisterPurchaseRequestDTO;
let purchase: Purchase;

const invoicesRepo: InvoicesRepository = new InRuntimeMemoryInvoicesRepository();
let suppliersRepo: SuppliersRepository = new InRuntimeMemorySuppliersRepository();
let categoriesRepo: CategoriesRepository = new InMemoryCategoriesRepository();
let productsRepo: ProductsRepository = new InMemoryProductsRepository();
let purchasesRepo: PurchasesRepository = new InMemoryPurchasesRepository();

let registerPurchase = new RegisterPurchaseUseCase(
  invoicesRepo,
  suppliersRepo,
  categoriesRepo,
  productsRepo,
  purchasesRepo,
);

beforeEach(() => cleanUp());

test('Given a valid RegisterPurchaseRequestDTO, when purchase is registered, then should not throw', () => {
  givenARegisterPurchaseRequest();
  expect(whenPurchaseIsRegisteredWithProducts).not.toThrow();
});

test('Given a valid RegisterPurchaseRequestDTO, when purchase is registered, then should have a PurchaseInvoice', async () => {
  givenARegisterPurchaseRequest();
  await whenPurchaseIsRegisteredWithProducts();
  expect(purchase).toHaveProperty('invoice');
  expect(purchase.invoice).toBeInstanceOf(Invoice);
  expect(purchase.invoice).toHaveProperty('invoiceId');
  expect(purchase.invoice.invoiceId.id.toValue()).not.toBeFalsy();
  expect(purchase.invoice).toHaveProperty('type');
  expect(purchase.invoice.type).toEqual(InvoiceTypes.purchase);
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
  expect(invoice).toBeInstanceOf(Invoice);
  expect(invoice.number.value).toEqual(purchase.invoice.number.value);
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
  expect(purchase).toHaveProperty('supplier');
  expect(purchase.supplier.supplierId.id.toValue()).toEqual(request.supplier.id);
});

test('Given a valid RegisterPurchaseRequestDTO with a new supplier, when purchase is registered, then should save a new Supplier', async () => {
  givenARegisterPurchaseRequestWithNewSupplier();
  await whenPurchaseIsRegisteredWithProducts();

  const supplier = await suppliersRepo.findById(purchase.supplier.supplierId);
  expect(supplier.supplierId.equals(purchase.supplier.supplierId)).toBe(true);
  expect(supplier.cuit.value).toEqual(purchase.supplier.cuit.value);
  expect(supplier.mail.value).toEqual(purchase.supplier.mail.value);
  expect(supplier.name.value).toEqual(purchase.supplier.name.value);
  expect(supplier.phone.value).toEqual(purchase.supplier.phone.value);
});

test('Given a valid RegisterPurchaseRequestDTO with existing products, when purchase is registered, then Purchase should have PurchaseProducts', async () => {
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

test('Given a valid RegisterPurchaseRequestDTO with new product and new category, when purchase is registered, then a Product and Category should be created', async () => {
  givenARegisterPurchaseRequestWithNewProductAndNewCategory();
  await whenPurchaseIsRegistered();
  expect(purchase).toHaveProperty('products');
  expect(purchase.products).toHaveLength(1);

  purchase.products.forEach(async product => {
    expect(product.category).toHaveProperty('categoryId');
    expect(product.category).not.toBeFalsy();
    expect(product.category.categoryId).not.toBeFalsy();

    const storedProduct = await productsRepo.findById(product.productId);
    expect(storedProduct.productId.equals(product.productId)).toBe(true);
    expect(storedProduct.stock.value).toEqual(product.quantity.value);

    const storedCategory = await categoriesRepo.findById(product.category.categoryId);
    expect(storedCategory.categoryId.equals(product.category.categoryId)).toBe(true);
  });
});

test('Given a valid RegisterPurchaseRequestDTO with existing products, when purchase is registeres, then Products stock should be updated', async () => {
  const product = Product.create({
    category: createCategory('2'),
    name: ProductName.create({ value: 'nombre' }),
    price: ProductPrice.create({ value: 199 }),
    stock: ProductStock.create({ value: 50 }),
  });
  await productsRepo.save(product);

  const request: RegisterPurchaseRequestDTO = {
    ...basePurchaseRequestDTO,
    products: [{ id: product.productId.id.toString(), price: 199, quantity: 50 }],
  };
  await registerPurchase.execute(request);

  const storedProduct = await productsRepo.findById(product.productId);
  expect(storedProduct.stock.value).toEqual(100);
});

test('Given a RegisterPurchaseRequestDTO, when a purchase is registered, then a Purchase should be created', async () => {
  givenARegisterPurchaseRequest();
  await whenPurchaseIsRegisteredWithProducts();
  expect(purchase).toBeInstanceOf(Purchase);

  const storedPurchase = await purchasesRepo.findById(purchase.purchaseId);
  expect(storedPurchase).not.toBeFalsy();
  expect(storedPurchase.purchaseId.equals(purchase.purchaseId)).toBe(true);
});

const basePurchaseRequestDTO: RegisterPurchaseRequestDTO = {
  invoice: {
    date: new Date(1956, 9, 10),
    number: '4523',
  },
  products: [
    { id: '1', price: 120, quantity: 10 },
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

function givenARegisterPurchaseRequestWithNewProductAndNewCategory(): void {
  request = {
    ...basePurchaseRequestDTO,
    products: [
      {
        new: {
          name: 'jabon anti bacterial',
          category: { new: 'jabones' },
        },
        price: 140,
        quantity: 32,
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
  purchasesRepo = new InMemoryPurchasesRepository();
  registerPurchase = new RegisterPurchaseUseCase(
    invoicesRepo,
    suppliersRepo,
    categoriesRepo,
    productsRepo,
    purchasesRepo,
  );
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
