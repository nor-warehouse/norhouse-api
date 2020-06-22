import { UseCase } from '../../../shared/application/models/UseCase';
import {
  PaginationRequest,
  PaginationResult,
} from '../../../shared/infrastructure/services/PaginationService/PaginationService';
import { Product } from '../../domain/Product/Product';
import { ProductsRepository } from '../../domain/Product/ProductsRepository';

type ProductList = PaginationResult<Product>;

export class GetAllProducts implements UseCase<PaginationRequest, ProductList> {
  constructor(private productsRepo: ProductsRepository) {}

  async execute(request: PaginationRequest): Promise<ProductList> {
    return await this.productsRepo.findAll({ limit: request.limit, page: request.page });
  }
}
