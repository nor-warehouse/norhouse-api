import { ValueObject } from '../../../../shared/core/ValueObject';

interface PurchaseProductQuantityProps {
  value: number;
}

export class PurchaseProductQuantity extends ValueObject<PurchaseProductQuantityProps> {
  private constructor(props: PurchaseProductQuantityProps) {
    super(props);
  }

  public static create(props: PurchaseProductQuantityProps): PurchaseProductQuantity {
    return new PurchaseProductQuantity(props);
  }

  get value(): number {
    return this.props.value;
  }
}
