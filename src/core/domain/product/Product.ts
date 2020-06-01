import { Entity } from '../../../shared/core/Entity';
import { UniqueEntityID } from '../../../shared/core/UniqueEntityID';
import { Category } from './category/Category';
import { ProductId } from './ProductId';
import { ProductName } from './ProductName';
import { ProductPrice } from './ProductPrice';
import { ProductStock } from './ProductStock';

interface ProductProps {
  category: Category;
  name: ProductName;
  price: ProductPrice;
  stock: ProductStock;
}

export class Product extends Entity<ProductProps> {
  private constructor(props: ProductProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: ProductProps, id?: UniqueEntityID): Product {
    return new Product(props, id);
  }

  get productId(): ProductId {
    return ProductId.create(this._id);
  }

  get category(): Category {
    return this.props.category;
  }

  get name(): ProductName {
    return this.props.name;
  }

  get price(): ProductPrice {
    return this.props.price;
  }

  get stock(): ProductStock {
    return this.props.stock;
  }

  public addStock(value: number): void {
    const updatedStock = this.stock.add(value);
    this.props.stock = updatedStock;
  }

  public substractStock(value: number): void {
    const updatedStock = this.stock.substract(value);
    this.props.stock = updatedStock;
  }
}
