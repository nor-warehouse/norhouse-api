import { Router } from 'express';
import { RegisterPurchase } from '../../../../../../core/use_cases/registerPurchase/RegisterPurchase';
import { InMemoryCategoriesRepository } from '../../../../../persistence/inMemory/Categories/InMemoryCategoriesRepository';
import { InMemoryInvoicesRepository } from '../../../../../persistence/inMemory/Invoices/InMemoryInvoicesRepository';
import { InMemoryProductsRepository } from '../../../../../persistence/inMemory/Products/InMemoryProductsRepository';
import { InMemoryPurchasesRepository } from '../../../../../persistence/inMemory/Purchases/InMemoryPurchasesRepository';
import { InMemorySuppliersRepository } from '../../../../../persistence/inMemory/Suppliers/InMemorySuppliersRepository';
import { RegisterPurchaseController } from './RegisterPurchaseController';

const invoicesRepo = new InMemoryInvoicesRepository();
const suppliersRepo = new InMemorySuppliersRepository();
const categoriesRepo = new InMemoryCategoriesRepository();
const productsRepo = new InMemoryProductsRepository();
const purchasesRepo = new InMemoryPurchasesRepository();

const registerPurchase = new RegisterPurchase(invoicesRepo, suppliersRepo, categoriesRepo, productsRepo, purchasesRepo);

const registerPurchaseController = new RegisterPurchaseController(registerPurchase);

export const registerPurchaseRoute = (router: Router): void => {
  router.post('/register', (req, res) => registerPurchaseController.execute(req, res));
};
