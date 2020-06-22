import { Request, Response } from 'express';
import { Product } from '../../../../../../core/domain/Product/Product';
import { GetAllProducts } from '../../../../../../core/use_cases/getAllProducts/GetAllProducts';
import { PaginationResult } from '../../../../../../shared/infrastructure/services/PaginationService';
import { BaseController } from '../../../../../../shared/delivery/http/api/models/BaseController';

interface ProductDTO {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: {
    id: string;
    name: string;
  };
}

class ProductMapper {
  static toDTO(product: Product): ProductDTO {
    return {
      id: product.productId.id.toString(),
      name: product.name.value,
      price: product.price.value,
      stock: product.stock.value,
      category: {
        id: product.category.categoryId.id.toString(),
        name: product.category.name.value,
      },
    };
  }
}

export class GetAllProductsController extends BaseController {
  constructor(private useCase: GetAllProducts) {
    super();
  }

  protected async executeImpl(request: Request, response: Response): Promise<any> {
    try {
      const { count, entries } = await this.useCase.execute(request.pagination);
      console.log(JSON.stringify(entries, null, 2))
      const responseDTO = {
        count,
        entries: entries.map(product => ProductMapper.toDTO(product)),
      };
      return this.ok<PaginationResult<ProductDTO>>(response, responseDTO);
    } catch (error) {
      return this.fail(response, error);
    }
  }
}
