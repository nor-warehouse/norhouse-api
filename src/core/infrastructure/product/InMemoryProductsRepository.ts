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
