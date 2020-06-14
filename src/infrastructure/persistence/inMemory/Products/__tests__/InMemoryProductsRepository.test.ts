/* eslint-disable @typescript-eslint/no-use-before-define */
import { Product } from '../../../../../core/domain/product/Product';
import { ProductFactory } from '../../../../../core/domain/product/ProductFactory';
import { ProductId } from '../../../../../core/domain/product/ProductId';
import { ProductsRepository } from '../../../../../core/domain/product/ProductsRepository';
import { UniqueEntityID } from '../../../../../shared/core/UniqueEntityID';
import { InMemoryProductsRepository } from '../InMemoryProductsRepository';

let productsRepo: ProductsRepository;

beforeEach(() => {
  productsRepo = new InMemoryProductsRepository();
});

test('Given an InMemoryProductsRepository, when no products are saved, then should return a ProductList with empty products and zero count', async () => {
  const productList = await productsRepo.findAll();
  expect(productList.count).toEqual(0);
  expect(productList.products).toHaveLength(0);
});

describe('Given an InMemoryProductsRepository with 2 products', () => {
  beforeEach(() => {
    productsRepo.save(createFakeProduct('1'));
    productsRepo.save(createFakeProduct('2'));
  });

  test('when findAll is executed, then should return a ProductList with 2 products and count 2', async () => {
    const productList = await productsRepo.findAll();
    expect(productList.count).toEqual(2);
    expect(productList.products).toHaveLength(2);
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
