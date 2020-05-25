import { Entity } from '../../../../shared/core/Entity';
import { UniqueEntityID } from '../../../../shared/core/UniqueEntityID';
import { ProductId } from '../../product/ProductId';
import { ProductPrice } from '../../product/ProductPrice';
import { PurchaseProductQuantity } from './PurchaseProductQuantity';

interface PurchaseProductProps {
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
