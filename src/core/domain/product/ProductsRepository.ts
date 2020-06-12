import { Product } from './Product';
import { ProductId } from './ProductId';

export interface ProductsRepository {
  findAll(): Promise<ProductList>;
  findById(id: ProductId): Promise<Product | undefined>;
  save(product: Product): Promise<void>;
}

export interface ProductList {
  products: Product[];
  count: number;
}
