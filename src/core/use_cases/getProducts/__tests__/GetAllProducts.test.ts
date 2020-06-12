/* eslint-disable @typescript-eslint/no-use-before-define */
import { InMemoryProductsRepository } from '../../../../infrastructure/persistence/inMemory/Products/InMemoryProductsRepository';
import { Product } from '../../../domain/product/Product';
import { ProductFactory } from '../../../domain/product/ProductFactory';
import { GetAllProducts } from '../GetAllProducts';

test('Given GetAllProducts use case, when executed, then should return a ProductList', async () => {
  const productsRepo = new InMemoryProductsRepository();
  productsRepo.findAll = jest.fn().mockResolvedValueOnce({
    products: [createFakeProduct('1'), createFakeProduct('2')],
    count: 2,
  });
  const getAllProducts = new GetAllProducts(productsRepo);

  const response = await getAllProducts.execute();

  expect(response.products).toHaveLength(2);
  expect(response.count).toEqual(2);
});

function createFakeProduct(id?: string): Product {
  const productFactory = new ProductFactory();
  return productFactory.create({ id, name: 'some product', price: 54, stock: 21, category: { name: 'some category' } });
}
