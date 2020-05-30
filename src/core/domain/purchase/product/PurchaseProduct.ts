import { Entity } from '../../../../shared/core/Entity';
import { UniqueEntityID } from '../../../../shared/core/UniqueEntityID';
import { Category } from '../../product/category/Category';
import { ProductId } from '../../product/ProductId';
import { ProductName } from '../../product/ProductName';
import { ProductPrice } from '../../product/ProductPrice';
import { PurchaseProductQuantity } from './PurchaseProductQuantity';

interface PurchaseProductProps {
  category: Category;
  name: ProductName;
  price: ProductPrice;
  quantity: PurchaseProductQuantity;
}

export class PurchaseProduct extends Entity<PurchaseProductProps> {
  private constructor(props: PurchaseProductProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: PurchaseProductProps, id?: UniqueEntityID): PurchaseProduct {
    return new PurchaseProduct(props, id);
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

  get quantity(): PurchaseProductQuantity {
    return this.props.quantity;
  }

  get totalPrice(): number {
    return this.price.value * this.quantity.value;
  }
}
