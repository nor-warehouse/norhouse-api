import { Sale } from '../../../../core/domain/Sale/Sale';
import { SaleId } from '../../../../core/domain/Sale/SaleId';
import { SalesRepository } from '../../../../core/domain/Sale/SalesRepository';

export class InMemorySalesRepository implements SalesRepository {
  private sales: Sale[] = [];

  async findById(id: SaleId): Promise<Sale | undefined> {
    const sale = this.sales.find(sale => sale.saleId.equals(id));
    return Promise.resolve(sale);
  }

  async save(sale: Sale): Promise<void> {
    this.sales = this.sales.concat(sale);
    return Promise.resolve();
  }
}
