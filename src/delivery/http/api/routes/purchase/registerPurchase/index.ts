import { Router } from 'express';
import { RegisterPurchase } from '../../../../../../core/use_cases/registerPurchase/RegisterPurchase';
import { InMemoryCategoriesRepository } from '../../../../../../infrastructure/persistence/inMemory/Categories/InMemoryCategoriesRepository';
import { InMemoryInvoicesRepository } from '../../../../../../infrastructure/persistence/inMemory/Invoices/InMemoryInvoicesRepository';
import { productsRepo } from '../../../../../../infrastructure/persistence/inMemory/Products';
import { InMemoryPurchasesRepository } from '../../../../../../infrastructure/persistence/inMemory/Purchases/InMemoryPurchasesRepository';
import { InMemorySuppliersRepository } from '../../../../../../infrastructure/persistence/inMemory/Suppliers/InMemorySuppliersRepository';
import { RegisterPurchaseController } from './RegisterPurchaseController';

const invoicesRepo = new InMemoryInvoicesRepository();
const suppliersRepo = new InMemorySuppliersRepository();
const categoriesRepo = new InMemoryCategoriesRepository();
const purchasesRepo = new InMemoryPurchasesRepository();

const registerPurchase = new RegisterPurchase(invoicesRepo, suppliersRepo, categoriesRepo, productsRepo, purchasesRepo);

const registerPurchaseController = new RegisterPurchaseController(registerPurchase);

export const registerPurchaseRoute = (router: Router): void => {
  router.post('/register', (req, res) => registerPurchaseController.execute(req, res));
};
