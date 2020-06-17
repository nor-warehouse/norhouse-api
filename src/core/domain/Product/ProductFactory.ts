import { Factory } from '../../../shared/core/Factory';
import { UniqueEntityID } from '../../../shared/core/UniqueEntityID';
import { Category } from './Category/Category';
import { CategoryName } from './Category/CategoryName';
import { Product } from './Product';
import { ProductName } from './ProductName';
import { ProductPrice } from './ProductPrice';
import { ProductStock } from './ProductStock';

interface RawProduct {
  id?: string;
  name: string;
  price: number;
  stock: number;
  category: {
    id?: string;
    name: string;
  };
}

export class ProductFactory implements Factory<Product, RawProduct> {
  create(raw: RawProduct): Product {
    const idOrNot = raw.id ? new UniqueEntityID(raw.id) : undefined;
    const categoryIdOrNot = raw.category.id ? new UniqueEntityID(raw.category.id) : undefined;
    return Product.create(
      {
        category: Category.create({ name: CategoryName.create({ value: raw.category.name }) }, categoryIdOrNot),
        name: ProductName.create({ value: raw.name }),
        price: ProductPrice.create({ value: raw.price }),
        stock: ProductStock.create({ value: raw.stock }),
      },
      idOrNot,
    );
  }
}
