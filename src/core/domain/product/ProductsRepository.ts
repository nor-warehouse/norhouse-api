import { Pagination } from '../shared/Pagination';
import { Product } from './Product';
import { ProductId } from './ProductId';

export interface ProductList {
  products: Product[];
  count: number;
}

export interface ProductsRepository {
  findAll(pagination?: Pagination): Promise<ProductList>;
  findById(id: ProductId): Promise<Product | undefined>;
  save(product: Product): Promise<void>;
}
