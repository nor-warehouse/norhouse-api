import { Supplier } from './Supplier';
import { SupplierId } from './SupplierId';

export interface SuppliersRepository {
  findById(supplierId: SupplierId): Promise<Supplier | undefined>;
  save(supplier: Supplier): Promise<void>;
}
