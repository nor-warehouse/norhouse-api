import { Purchase } from '../../../../core/domain/Purchase/Purchase';
import { PurchaseId } from '../../../../core/domain/Purchase/PurchaseId';
import { PurchasesRepository } from '../../../../core/domain/Purchase/PurchasesRepository';

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
