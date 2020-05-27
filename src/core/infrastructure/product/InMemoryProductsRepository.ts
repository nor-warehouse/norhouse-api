import { Product } from '../../domain/product/product/Product';
import { ProductId } from '../../domain/product/product/ProductId';
import { ProductsRepository } from '../../domain/product/product/ProductsRepository';

export class InMemoryProductsRepository implements ProductsRepository {
  private products: Product[] = [];

  findById(id: ProductId): Promise<Product | undefined> {
    const product = this.products.find(p => p.productId.equals(id));
    return Promise.resolve(product);
  }

  save(product: Product): Promise<void> {
    this.products.push(product);
    return Promise.resolve();
  }
}
