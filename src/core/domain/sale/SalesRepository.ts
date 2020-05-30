import { Sale } from './Sale';
import { SaleId } from './SaleId';

export interface SalesRepository {
  findById(id: SaleId): Promise<Sale | undefined>;
  save(sale: Sale): Promise<void>;
}
