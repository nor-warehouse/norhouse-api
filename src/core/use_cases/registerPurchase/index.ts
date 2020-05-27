import { InRuntimeMemoryInvoicesRepository } from '../../infrastructure/invoice/InRuntimeMemoryInvoicesRepository';
import { InMemoryCategoriesRepository } from '../../infrastructure/product/InMemoryCategoriesRepository';
import { InMemoryProductsRepository } from '../../infrastructure/product/InMemoryProductsRepository';
import { InRuntimeMemorySuppliersRepository } from '../../infrastructure/supplier/InRuntimeMemorySuppliersRepository';
import { RegisterPurchaseUseCase } from './RegisterPurchaseUseCase';

const invoicesRepo = new InRuntimeMemoryInvoicesRepository();
const suppliersRepo = new InRuntimeMemorySuppliersRepository();
const categoriesRepo = new InMemoryCategoriesRepository();
const productsRepo = new InMemoryProductsRepository();

export const registerPurchase = new RegisterPurchaseUseCase(invoicesRepo, suppliersRepo, categoriesRepo, productsRepo);
