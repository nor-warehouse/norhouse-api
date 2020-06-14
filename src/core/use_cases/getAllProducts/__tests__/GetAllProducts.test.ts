import { InMemoryProductsRepository } from '../../../../infrastructure/persistence/inMemory/Products/InMemoryProductsRepository';
import { GetAllProducts } from '../GetAllProducts';

test('Given GetAllProducts use case, when executed with GetAllProductsRequestDTO, then should return a ProductList', async () => {
  const productsRepo = new InMemoryProductsRepository();
  productsRepo.findAll = jest.fn().mockReturnValueOnce({ count: 3, products: [1, 2] });
  const getAllProducts = new GetAllProducts(productsRepo);

  const productList = await getAllProducts.execute({ page: 1, limit: 2 });

  expect(productList.count).toEqual(3);
  expect(productList.products).toHaveLength(2);
});
