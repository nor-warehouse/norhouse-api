import { UseCase } from '../../../shared/application/UseCase';
import { ProductList, ProductsRepository } from '../../domain/product/ProductsRepository';

export class GetAllProducts implements UseCase<{}, ProductList> {
  constructor(private productsRepo: ProductsRepository) {}

  async execute(): Promise<ProductList> {
    const productsList = await this.productsRepo.findAll();
    return productsList;
  }
}
