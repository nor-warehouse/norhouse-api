import { InMemoryCategoriesRepository } from '../../../infrastructure/persistence/inMemory/Categories/InMemoryCategoriesRepository';
import { InRuntimeMemoryInvoicesRepository } from '../../../infrastructure/persistence/inMemory/Invoices/InRuntimeMemoryInvoicesRepository';
import { InMemoryProductsRepository } from '../../../infrastructure/persistence/inMemory/Products/InMemoryProductsRepository';
import { InMemoryPurchasesRepository } from '../../../infrastructure/persistence/inMemory/Purchases/InMemoryPurchasesRepository';
import { InRuntimeMemorySuppliersRepository } from '../../../infrastructure/persistence/inMemory/Suppliers/InRuntimeMemorySuppliersRepository';
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
