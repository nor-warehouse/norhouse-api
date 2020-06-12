import { Product } from '../../../../core/domain/product/Product';
import { ProductId } from '../../../../core/domain/product/ProductId';
import { ProductList, ProductsRepository } from '../../../../core/domain/product/ProductsRepository';

export class InMemoryProductsRepository implements ProductsRepository {
  private products: Product[] = [];

  findAll(): Promise<ProductList> {
    return Promise.resolve({
      products: this.products,
      count: this.products.length,
    });
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
