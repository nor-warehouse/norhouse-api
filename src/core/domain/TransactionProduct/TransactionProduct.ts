import { Entity } from '../../../shared/core/Entity';
import { UniqueEntityID } from '../../../shared/core/UniqueEntityID';
import { Category } from '../Product/Category/Category';
import { ProductId } from '../Product/ProductId';
import { ProductName } from '../Product/ProductName';
import { ProductPrice } from '../Product/ProductPrice';
import { TransactionProductQuantity } from './TransactionProductQuantity';

interface TransactionProductProps {
  category: Category;
  name: ProductName;
  price: ProductPrice;
  quantity: TransactionProductQuantity;
}

export class TransactionProduct extends Entity<TransactionProductProps> {
  private constructor(props: TransactionProductProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: TransactionProductProps, id?: UniqueEntityID): TransactionProduct {
    return new TransactionProduct(props, id);
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

  get quantity(): TransactionProductQuantity {
    return this.props.quantity;
  }

  get totalPrice(): number {
    return this.price.value * this.quantity.value;
  }
}
