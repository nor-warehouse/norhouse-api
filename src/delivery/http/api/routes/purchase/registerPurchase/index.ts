import { Router } from 'express';
import { RegisterPurchase } from '../../../../../../core/use_cases/registerPurchase/RegisterPurchase';
import { InMemoryCategoriesRepository } from '../../../../../../infrastructure/persistence/inMemory/Categories/InMemoryCategoriesRepository';
import { InMemoryInvoicesRepository } from '../../../../../../infrastructure/persistence/inMemory/Invoices/InMemoryInvoicesRepository';
import { InMemoryProductsRepository } from '../../../../../../infrastructure/persistence/inMemory/Products/InMemoryProductsRepository';
import { InMemoryPurchasesRepository } from '../../../../../../infrastructure/persistence/inMemory/Purchases/InMemoryPurchasesRepository';
import { InMemorySuppliersRepository } from '../../../../../../infrastructure/persistence/inMemory/Suppliers/InMemorySuppliersRepository';
import { PaginationService } from '../../../../../../shared/application/services/PaginationService';
import { RegisterPurchaseController } from './RegisterPurchaseController';

const invoicesRepo = new InMemoryInvoicesRepository();
const suppliersRepo = new InMemorySuppliersRepository();
const categoriesRepo = new InMemoryCategoriesRepository();
const productsRepo = new InMemoryProductsRepository(new PaginationService());
const purchasesRepo = new InMemoryPurchasesRepository();

const registerPurchase = new RegisterPurchase(invoicesRepo, suppliersRepo, categoriesRepo, productsRepo, purchasesRepo);

const registerPurchaseController = new RegisterPurchaseController(registerPurchase);

export const registerPurchaseRoute = (router: Router): void => {
  router.post('/register', (req, res) => registerPurchaseController.execute(req, res));
};
