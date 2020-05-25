import { InRuntimeMemoryInvoicesRepository } from '../../infrastructure/invoice/InRuntimeMemoryInvoicesRepository';
import { InRuntimeMemorySuppliersRepository } from '../../infrastructure/supplier/InRuntimeMemorySuppliersRepository';
import { RegisterPurchaseUseCase } from './RegisterPurchaseUseCase';

const invoicesRepo = new InRuntimeMemoryInvoicesRepository();
const suppliersRepo = new InRuntimeMemorySuppliersRepository();

export const registerPurchase = new RegisterPurchaseUseCase(invoicesRepo, suppliersRepo);
