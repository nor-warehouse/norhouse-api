import { InRuntimeMemoryInvoicesRepository } from '../../infrastructure/invoice/InRuntimeMemoryInvoicesRepository';
import { InMemoryCategoriesRepository } from '../../infrastructure/product/InMemoryCategoriesRepository';
import { InMemoryProductsRepository } from '../../infrastructure/product/InMemoryProductsRepository';
import { InMemoryPurchasesRepository } from '../../infrastructure/purchase/InMemoryPurchasesRepository';
import { InRuntimeMemorySuppliersRepository } from '../../infrastructure/supplier/InRuntimeMemorySuppliersRepository';
import { RegisterPurchaseController } from './RegisterPurchaseController';
import { RegisterPurchaseUseCase } from './RegisterPurchaseUseCase';

const invoicesRepo = new InRuntimeMemoryInvoicesRepository();
const suppliersRepo = new InRuntimeMemorySuppliersRepository();
const categoriesRepo = new InMemoryCategoriesRepository();
const productsRepo = new InMemoryProductsRepository();
const purchasesRepo = new InMemoryPurchasesRepository();

export const registerPurchase = new RegisterPurchaseUseCase(
  invoicesRepo,
  suppliersRepo,
  categoriesRepo,
  productsRepo,
  purchasesRepo,
);

export const registerPurchaseController = new RegisterPurchaseController(registerPurchase);
