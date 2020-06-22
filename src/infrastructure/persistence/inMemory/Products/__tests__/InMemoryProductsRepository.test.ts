/* eslint-disable @typescript-eslint/no-use-before-define */
import { Product } from '../../../../../core/domain/Product/Product';
import { ProductFactory } from '../../../../../core/domain/Product/ProductFactory';
import { ProductId } from '../../../../../core/domain/Product/ProductId';
import { ProductsRepository } from '../../../../../core/domain/Product/ProductsRepository';
import { PaginationService } from '../../../../../shared/infrastructure/services/PaginationService';
import { UniqueEntityID } from '../../../../../shared/core/UniqueEntityID';
import { InMemoryProductsRepository } from '../InMemoryProductsRepository';

let productsRepo: ProductsRepository;
const paginationService = new PaginationService();

beforeEach(() => {
  productsRepo = new InMemoryProductsRepository(paginationService);
});

test('Given an InMemoryProductsRepository, when no products are saved, then should return empty products and zero count', async () => {
  const productList = await productsRepo.findAll();
  expect(productList.count).toEqual(0);
  expect(productList.entries).toHaveLength(0);
});

describe('Given an InMemoryProductsRepository with 2 products', () => {
  beforeEach(() => {
    productsRepo.save(createFakeProduct('1'));
    productsRepo.save(createFakeProduct('2'));
  });

  test('when findAll is executed with page 1 and limit 1, then should return 1 product and count 2', async () => {
    const productList = await productsRepo.findAll({ limit: 1, page: 1 });
    expect(productList.count).toEqual(2);
    expect(productList.entries).toHaveLength(1);
  });

  test('when findById is executed and product exists, then should return the product', async () => {
    const product = await productsRepo.findById(createFakeProductId('2'));
    expect(product.productId.id.toValue()).toEqual('2');
  });

  test('when findById is executed and product does not exist, then should return undefined', async () => {
    const product = await productsRepo.findById(createFakeProductId('3'));
    expect(product).toBeUndefined();
  });
});

function createFakeProduct(id: string): Product {
  const productFactory = new ProductFactory();
  return productFactory.create({ id, name: `product ${id}`, price: 54, stock: 5, category: { name: 'some category' } });
}

function createFakeProductId(id: string): ProductId {
  return ProductId.create(new UniqueEntityID(id));
}
