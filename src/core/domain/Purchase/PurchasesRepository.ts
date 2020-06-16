import { Purchase } from './Purchase';
import { PurchaseId } from './PurchaseId';

export interface PurchasesRepository {
  findById(id: PurchaseId): Promise<Purchase | undefined>;
  save(purchase: Purchase): Promise<void>;
}
