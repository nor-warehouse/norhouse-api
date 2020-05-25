import { Supplier } from '../../domain/supplier/Supplier';
import { SupplierId } from '../../domain/supplier/SupplierId';
import { SuppliersRepository } from '../../domain/supplier/SuppliersRepository';

export class InRuntimeMemorySuppliersRepository implements SuppliersRepository {
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
