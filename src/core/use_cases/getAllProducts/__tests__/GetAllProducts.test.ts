import { InMemoryProductsRepository } from '../../../../infrastructure/persistence/inMemory/Products/InMemoryProductsRepository';
import { PaginationService } from '../../../../shared/infrastructure/services/PaginationService';
import { GetAllProducts } from '../GetAllProducts';

test('Given GetAllProducts use case, when executed with GetAllProductsRequestDTO, then should return a PaginationResult', async () => {
  const productsRepo = new InMemoryProductsRepository(new PaginationService());
  productsRepo.findAll = jest.fn().mockReturnValueOnce({ count: 3, entries: [1, 2] });
  const getAllProducts = new GetAllProducts(productsRepo);

  const productList = await getAllProducts.execute({ page: 1, limit: 2 });

  expect(productList.count).toEqual(3);
  expect(productList.entries).toHaveLength(2);
});
