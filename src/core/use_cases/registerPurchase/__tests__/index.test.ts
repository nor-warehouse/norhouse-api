/* eslint-disable @typescript-eslint/no-use-before-define */
import { InvoiceNumber } from '../../../domain/invoice/InvoiceNumber';
import { InvoicesRepository } from '../../../domain/invoice/InvoicesRepository';
import { PurchaseInvoice } from '../../../domain/purchase/invoice/PurchaseInvoice';
import { InRuntimeMemoryInvoicesRepository } from '../../../infrastructure/InRuntimeMemoryInvoicesRepository';
import { RegisterPurchaseRequestDTO } from '../RegisterPurchaseRequestDTO';
import { RegisterPurchaseUseCase } from '../RegisterPurchaseUseCase';

let request: RegisterPurchaseRequestDTO;
let purchase: any;
const invoicesRepo: InvoicesRepository = new InRuntimeMemoryInvoicesRepository();
const registerPurchase = new RegisterPurchaseUseCase(invoicesRepo);

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

function givenARegisterPurchaseRequest(): void {
  request = {
    invoice: {
      date: new Date(1956, 9, 10),
      number: '4523',
    },
    products: [{ id: '2', price: 200, quantity: 2 }],
    supplier: {
      id: '25',
    },
  };
}

async function whenPurchaseIsRegistered(): Promise<void> {
  purchase = await registerPurchase.execute(request);
}

function cleanUp(): void {
  request = undefined;
  purchase = undefined;
}
