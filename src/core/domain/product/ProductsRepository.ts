import { Product } from './Product';
import { ProductId } from './ProductId';

export interface ProductsRepository {
  findById(id: ProductId): Promise<Product | undefined>;
  save(product: Product): Promise<void>;
}
