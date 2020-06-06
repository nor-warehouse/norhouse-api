import { Router } from 'express';
import { RegisterPurchase } from '../../../../../../core/use_cases/registerPurchase/RegisterPurchase';
import { InMemoryCategoriesRepository } from '../../../../../persistence/inMemory/Categories/InMemoryCategoriesRepository';
import { InRuntimeMemoryInvoicesRepository } from '../../../../../persistence/inMemory/Invoices/InRuntimeMemoryInvoicesRepository';
import { InMemoryProductsRepository } from '../../../../../persistence/inMemory/Products/InMemoryProductsRepository';
import { InMemoryPurchasesRepository } from '../../../../../persistence/inMemory/Purchases/InMemoryPurchasesRepository';
import { InRuntimeMemorySuppliersRepository } from '../../../../../persistence/inMemory/Suppliers/InRuntimeMemorySuppliersRepository';
import { RegisterPurchaseController } from './RegisterPurchaseController';

const invoicesRepo = new InRuntimeMemoryInvoicesRepository();
const suppliersRepo = new InRuntimeMemorySuppliersRepository();
const categoriesRepo = new InMemoryCategoriesRepository();
const productsRepo = new InMemoryProductsRepository();
const purchasesRepo = new InMemoryPurchasesRepository();

const registerPurchase = new RegisterPurchase(invoicesRepo, suppliersRepo, categoriesRepo, productsRepo, purchasesRepo);

const registerPurchaseController = new RegisterPurchaseController(registerPurchase);

export const registerPurchaseRoute = (router: Router): void => {
  router.post('/register', (req, res) => registerPurchaseController.execute(req, res));
};
