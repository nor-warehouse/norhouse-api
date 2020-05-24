import { InRuntimeMemoryInvoicesRepository } from '../../infrastructure/InRuntimeMemoryInvoicesRepository';
import { RegisterPurchaseUseCase } from './RegisterPurchaseUseCase';

export const registerPurchase = new RegisterPurchaseUseCase(new InRuntimeMemoryInvoicesRepository());
