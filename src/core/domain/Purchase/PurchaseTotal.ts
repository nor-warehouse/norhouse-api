import { ValueObject } from '../../../shared/core/ValueObject';
import { TransactionProduct } from '../TransactionProduct/TransactionProduct';

interface PurchaseTotalProps {
  value: TransactionProduct[];
}

export class PurchaseTotal extends ValueObject<{ value: number }> {
  private constructor(props: { value: number }) {
    super(props);
  }

  public static create(props: PurchaseTotalProps): PurchaseTotal {
    const total = props.value.reduce((prev, product) => prev + product.totalPrice, 0);
    return new PurchaseTotal({ value: total });
  }

  get value(): number {
    return this.props.value;
  }
}
