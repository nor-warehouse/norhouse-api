import { Supplier } from '../../../../core/domain/Supplier/Supplier';
import { SupplierId } from '../../../../core/domain/Supplier/SupplierId';
import { SuppliersRepository } from '../../../../core/domain/Supplier/SuppliersRepository';

export class InMemorySuppliersRepository implements SuppliersRepository {
  private suppliers: Supplier[] = [];

  findById(supplierId: SupplierId): Promise<Supplier | undefined> {
    const supplier = this.suppliers.find(s => s.supplierId.id.equals(supplierId.id));
    return Promise.resolve(supplier);
  }

  save(supplier: Supplier): Promise<void> {
    this.suppliers.push(supplier);
    return Promise.resolve();
  }
}
