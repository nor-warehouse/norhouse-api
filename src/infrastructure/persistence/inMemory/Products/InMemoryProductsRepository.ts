import { Product } from '../../../../core/domain/Product/Product';
import { ProductId } from '../../../../core/domain/Product/ProductId';
import { ProductsRepository } from '../../../../core/domain/Product/ProductsRepository';
import {
  PaginationRequest,
  PaginationResult,
  PaginationService,
} from '../../../../shared/infrastructure/services/PaginationService';

export class InMemoryProductsRepository implements ProductsRepository {
  private products: Product[] = [];

  constructor(private paginationService: PaginationService) {}

  findAll(pagination?: PaginationRequest): Promise<PaginationResult<Product>> {
    const paginationResult = this.paginationService.paginate(this.products, pagination);
    return Promise.resolve(paginationResult);
  }

  findById(id: ProductId): Promise<Product | undefined> {
    const product = this.products.find(p => p.productId.equals(id));
    return Promise.resolve(product);
  }

  save(product: Product): Promise<void> {
    const exists = this.products.some(p => p.productId.equals(product.productId));
    this.products = exists ? this.update(product) : this.create(product);
    return Promise.resolve();
  }

  private create(product: Product): Product[] {
    return this.products.concat(product);
  }

  private update(product: Product): Product[] {
    return this.products.map(p => {
      if (!p.productId.equals(product.productId)) return p;
      return product;
    });
  }
}
