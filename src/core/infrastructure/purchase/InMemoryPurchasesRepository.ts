import { Purchase } from '../../domain/purchase/purchase/Purchase';
import { PurchaseId } from '../../domain/purchase/purchase/PurchaseId';
import { PurchasesRepository } from '../../domain/purchase/purchase/PurchasesRepository';

export class InMemoryPurchasesRepository implements PurchasesRepository {
  private purchases: Purchase[] = [];

  async findById(id: PurchaseId): Promise<Purchase | undefined> {
    const purchase = this.purchases.find(p => p.purchaseId.equals(id));
    return Promise.resolve(purchase);
  }

  async save(purchase: Purchase): Promise<void> {
    this.purchases = this.purchases.concat(purchase);
    return Promise.resolve();
  }
}
