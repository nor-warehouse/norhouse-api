/* eslint-disable @typescript-eslint/no-use-before-define */
import { UniqueEntityID } from '../../../../shared/core/UniqueEntityID';
import { InvoiceNumber } from '../../../domain/invoice/InvoiceNumber';
import { InvoicesRepository } from '../../../domain/invoice/InvoicesRepository';
import { PurchaseInvoice } from '../../../domain/purchase/invoice/PurchaseInvoice';
import { PurchaseProduct } from '../../../domain/purchase/product/PurchaseProduct';
import { Supplier } from '../../../domain/supplier/Supplier';
import { SupplierCuit } from '../../../domain/supplier/SupplierCuit';
import { SupplierMail } from '../../../domain/supplier/SupplierMail';
import { SupplierName } from '../../../domain/supplier/SupplierName';
import { SupplierPhone } from '../../../domain/supplier/SupplierPhone';
import { SuppliersRepository } from '../../../domain/supplier/SuppliersRepository';
import { InRuntimeMemoryInvoicesRepository } from '../../../infrastructure/invoice/InRuntimeMemoryInvoicesRepository';
import { InRuntimeMemorySuppliersRepository } from '../../../infrastructure/supplier/InRuntimeMemorySuppliersRepository';
import { RegisterPurchaseRequestDTO } from '../RegisterPurchaseRequestDTO';
import { RegisterPurchaseUseCase } from '../RegisterPurchaseUseCase';

let request: RegisterPurchaseRequestDTO;
let purchase: any;
const invoicesRepo: InvoicesRepository = new InRuntimeMemoryInvoicesRepository();
let suppliersRepo: SuppliersRepository = new InRuntimeMemorySuppliersRepository();
let registerPurchase = new RegisterPurchaseUseCase(invoicesRepo, suppliersRepo);

beforeEach(() => cleanUp());

test('Given a valid RegisterPurchaseRequestDTO, when purchase is registered, then should not throw', () => {
  givenARegisterPurchaseRequest();
  expect(whenPurchaseIsRegistered).not.toThrow();
});

test('Given a valid RegisterPurchaseRequestDTO, when purchase is registered, then should have a PurchaseInvoice', async () => {
  givenARegisterPurchaseRequest();
  await whenPurchaseIsRegistered();
  expect(purchase).toHaveProperty('invoice');
  expect(purchase.invoice).toBeInstanceOf(PurchaseInvoice);
  expect(purchase.invoice).toHaveProperty('date');
  expect(purchase.invoice.date.value).toEqual(request.invoice.date);
  expect(purchase.invoice).toHaveProperty('number');
  expect(purchase.invoice.number.value).toEqual(request.invoice.number);
});

test('Given a valid RegisterPurchaseRequestDTO, when purchase is registered, then an Invoice should be saved', async () => {
  givenARegisterPurchaseRequest();
  await whenPurchaseIsRegistered();

  const invoiceNumber = InvoiceNumber.create({ value: request.invoice.number });
  const invoice = await invoicesRepo.findByNumber(invoiceNumber);

  expect(invoice).not.toBe(null);
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
  await whenPurchaseIsRegistered();
  expect(purchase).toHaveProperty('supplierId');
  expect(purchase.supplierId.id.toValue()).toEqual(request.supplier.id);
});

test('Given a valid RegisterPurchaseRequestDTO with a new supplier, when purchase is registered, then should save a new Supplier', async () => {
  givenARegisterPurchaseRequestWithNewSupplier();
  await whenPurchaseIsRegistered();
  expect(purchase).toHaveProperty('supplierId');
  expect(purchase.supplierId).not.toBe(undefined);

  const supplier = await suppliersRepo.findById(purchase.supplierId);
  expect(supplier.supplierId).toEqual(purchase.supplierId);
  expect(supplier.cuit.value).toEqual(request.supplier.new.cuit);
  expect(supplier.mail.value).toEqual(request.supplier.new.mail);
  expect(supplier.name.value).toEqual(request.supplier.new.name);
  expect(supplier.phone.value).toEqual(request.supplier.new.phone);
});

test('Given a valid RegisterPurchaseRequestDTO, when purchase is registered, then should have them as props', async () => {
  givenARegisterPurchaseRequest();
  await whenPurchaseIsRegistered();
  expect(purchase).toHaveProperty('products');
  expect(purchase.products).toHaveLength(2);
  purchase.products.forEach((product, i) => {
    const rawProduct = request.products[i];
    expect(product).toBeInstanceOf(PurchaseProduct);
    expect(product.productId.id.toValue()).toEqual(rawProduct.id);
    expect(product.price.value).toEqual(rawProduct.price);
    expect(product.quantity.value).toEqual(rawProduct.quantity);
    expect(product.totalPrice).toEqual(rawProduct.price * rawProduct.quantity);
  });
});

const basePurchaseRequestDTO: RegisterPurchaseRequestDTO = {
  invoice: {
    date: new Date(1956, 9, 10),
    number: '4523',
  },
  products: [
    { id: '1', price: 124, quantity: 2 },
    { id: '2', price: 52, quantity: 1 },
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

async function whenPurchaseIsRegistered(): Promise<void> {
  purchase = await registerPurchase.execute(request);
}

function cleanUp(): void {
  request = undefined;
  purchase = undefined;
  suppliersRepo = new InRuntimeMemorySuppliersRepository();
  registerPurchase = new RegisterPurchaseUseCase(invoicesRepo, suppliersRepo);
}
