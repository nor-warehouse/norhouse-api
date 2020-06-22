import {
  PaginationRequest,
  PaginationResult,
} from '../../../shared/infrastructure/services/PaginationService/PaginationService';
import { Product } from './Product';
import { ProductId } from './ProductId';

export interface ProductList {
  products: Product[];
  count: number;
}

export interface ProductsRepository {
  findAll(pagination?: PaginationRequest): Promise<PaginationResult<Product>>;
  findById(id: ProductId): Promise<Product | undefined>;
  save(product: Product): Promise<void>;
}
