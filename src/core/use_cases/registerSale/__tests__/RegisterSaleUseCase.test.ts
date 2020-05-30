import { Sale } from '../../../domain/sale/Sale';
import { SaleId } from '../../../domain/sale/SaleId';
import { SalesRepository } from '../../../domain/sale/SalesRepository';
import { InMemorySalesRepository } from '../../../infrastructure/sale/InMemorySalesRepository';
import { RegisterSaleRequestDTO } from '../RegisterSaleRequestDTO';
import { RegisterSaleUseCase } from '../RegisterSaleUseCase';

const salesRepo: SalesRepository = new InMemorySalesRepository();
const registerSale = new RegisterSaleUseCase(salesRepo);
const request: RegisterSaleRequestDTO = {};

test('Given a RegisterSaleRequestDTO, when sale is registered, then should create a Sale', async () => {
  const sale = await registerSale.execute(request);
  expect(sale).toBeInstanceOf(Sale);
});

test('Given a RegisterSaleRequestDTO, when sale is registered, then created Sale should have a SaleId', async () => {
  const sale = await registerSale.execute(request);
  expect(sale.saleId).toBeDefined();
  expect(sale.saleId).toBeInstanceOf(SaleId);
});

test('Given a RegisterSaleRequestDTO, when sale is registered, then created Sale should be persisted', async () => {
  const sale = await registerSale.execute(request);
  const persistedSale = await salesRepo.findById(sale.saleId);
  expect(persistedSale).toBeInstanceOf(Sale);
  expect(persistedSale.saleId.equals(sale.saleId)).toBe(true);
});
