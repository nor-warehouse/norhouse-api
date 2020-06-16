import { UseCase } from '../../../shared/application/models/UseCase';
import { ProductList, ProductsRepository } from '../../domain/Product/ProductsRepository';
import { GetAllProductsRequestDTO } from './GetAllProductsRequestDTO';

export class GetAllProducts implements UseCase<GetAllProductsRequestDTO, ProductList> {
  constructor(private productsRepo: ProductsRepository) {}

  async execute(request: GetAllProductsRequestDTO): Promise<ProductList> {
    const productsList = await this.productsRepo.findAll({ limit: request.limit, page: request.page });
    return productsList;
  }
}
